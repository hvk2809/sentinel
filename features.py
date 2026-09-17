"""
features.py - Feature Vectorization and Temporal Aggregation

Aggregates filtered CERT r4.2 logs into 24-hour session vectors X_t containing:
- after_hours_ratio: Ratio of logons/activity outside 08:00–18:00
- usb_connect_count: Frequency of USB device insertions from device.csv
- removable_file_copies: File operations targeting removable drives from file.csv
- resource_cardinality: Count of unique external domains visited from http.csv
- recon_variance: Unique count or standard deviation of internal directories touched

Partitions into Baseline (Days 1–14) and Test periods (Days 15–30).
Saves output to processed_features.csv.
"""

import os
import re
import logging
from urllib.parse import urlparse
import pandas as pd
import numpy as np
from data_prep import ingest_cert_data, DEFAULT_COHORT

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

FEATURE_COLUMNS = [
    "after_hours_ratio",
    "usb_connect_count",
    "removable_file_copies",
    "resource_cardinality",
    "recon_variance"
]

def extract_domain(url_str: str) -> str:
    try:
        parsed = urlparse(str(url_str))
        domain = parsed.netloc or parsed.path.split("/")[0]
        return domain.lower()
    except Exception:
        return "unknown"

def extract_directory(filepath: str) -> str:
    try:
        # Standardize separators
        norm = str(filepath).replace("/", "\\")
        parts = norm.split("\\")
        if len(parts) > 1:
            return "\\".join(parts[:-1])
        return norm
    except Exception:
        return "root"

def build_daily_feature_vectors(dfs: dict, cohort=None, baseline_days=14) -> pd.DataFrame:
    """
    Constructs 24-hour session feature vectors X_t for each user and active date.
    """
    if cohort is None:
        cohort = DEFAULT_COHORT

    logon_df = dfs.get("logon", pd.DataFrame()).copy()
    device_df = dfs.get("device", pd.DataFrame()).copy()
    file_df = dfs.get("file", pd.DataFrame()).copy()
    http_df = dfs.get("http", pd.DataFrame()).copy()

    # Pre-parse timestamps
    for df in [logon_df, device_df, file_df, http_df]:
        if not df.empty and "date" in df.columns:
            df["datetime"] = pd.to_datetime(df["date"])
            df["day_str"] = df["datetime"].dt.strftime("%Y-%m-%d")
            df["hour"] = df["datetime"].dt.hour

    # Identify date range
    all_dates = set()
    for df in [logon_df, device_df, file_df, http_df]:
        if not df.empty and "day_str" in df.columns:
            all_dates.update(df["day_str"].unique())
    
    sorted_dates = sorted(list(all_dates))
    if not sorted_dates:
        return pd.DataFrame()

    date_to_idx = {d: i for i, d in enumerate(sorted_dates)}

    feature_rows = []

    for user in cohort:
        u_logon = logon_df[logon_df["user"] == user] if not logon_df.empty else pd.DataFrame()
        u_dev = device_df[device_df["user"] == user] if not device_df.empty else pd.DataFrame()
        u_file = file_df[file_df["user"] == user] if not file_df.empty else pd.DataFrame()
        u_http = http_df[http_df["user"] == user] if not http_df.empty else pd.DataFrame()

        for day in sorted_dates:
            day_idx = date_to_idx[day]
            is_baseline = (day_idx < baseline_days)

            # Subsets for current day
            cur_logon = u_logon[u_logon["day_str"] == day] if not u_logon.empty else pd.DataFrame()
            cur_dev = u_dev[u_dev["day_str"] == day] if not u_dev.empty else pd.DataFrame()
            cur_file = u_file[u_file["day_str"] == day] if not u_file.empty else pd.DataFrame()
            cur_http = u_http[u_http["day_str"] == day] if not u_http.empty else pd.DataFrame()

            # Skip days with absolutely zero activity across all streams
            total_events = len(cur_logon) + len(cur_dev) + len(cur_file) + len(cur_http)
            if total_events == 0:
                continue

            # 1. after_hours_ratio: events outside 08:00 - 18:00
            total_time_events = 0
            after_hours_events = 0
            for cur_sub in [cur_logon, cur_dev, cur_file, cur_http]:
                if not cur_sub.empty:
                    total_time_events += len(cur_sub)
                    after_hours_events += len(cur_sub[(cur_sub["hour"] < 8) | (cur_sub["hour"] >= 18)])
            
            after_hours_ratio = float(after_hours_events / max(1, total_time_events))

            # 2. usb_connect_count: Connect events from device.csv
            usb_connect_count = 0.0
            if not cur_dev.empty:
                usb_connect_count = float(len(cur_dev[cur_dev["activity"].astype(str).str.lower().isin(["connect", "inserted"])]))

            # 3. removable_file_copies: Operations targeting removable drives (e.g. E:\, F:\, D:\, /media)
            removable_file_copies = 0.0
            recon_variance = 0.0
            if not cur_file.empty:
                # Check for removable drive pattern (letters other than C: or keywords like removable/usb/media)
                removable_mask = cur_file["filename"].astype(str).apply(
                    lambda p: bool(re.search(r"^[D-Zd-z]:|removable|usb|exfil|media", p, re.IGNORECASE))
                )
                removable_file_copies = float(removable_mask.sum())

                # 5. recon_variance: Unique count of distinct directories touched
                dirs = cur_file["filename"].apply(extract_directory).unique()
                recon_variance = float(len(dirs))

            # 4. resource_cardinality: Count of unique external domains visited
            resource_cardinality = 0.0
            if not cur_http.empty:
                domains = cur_http["url"].apply(extract_domain).unique()
                resource_cardinality = float(len(domains))

            feature_rows.append({
                "user": user,
                "date": day,
                "day_index": day_idx,
                "is_baseline": is_baseline,
                "after_hours_ratio": after_hours_ratio,
                "usb_connect_count": usb_connect_count,
                "removable_file_copies": removable_file_copies,
                "resource_cardinality": resource_cardinality,
                "recon_variance": recon_variance
            })

    result_df = pd.DataFrame(feature_rows)
    logging.info(f"Generated {len(result_df)} daily session feature vectors.")
    return result_df

def process_and_save_features(data_dir: str, output_path: str) -> pd.DataFrame:
    dfs = ingest_cert_data(data_dir)
    features_df = build_daily_feature_vectors(dfs)
    features_df.to_csv(output_path, index=False)
    logging.info(f"Feature vectors saved to {output_path}.")
    return features_df

if __name__ == "__main__":
    work_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(work_dir, "data_cert")
    out_csv = os.path.join(work_dir, "processed_features.csv")
    df = process_and_save_features(data_dir, out_csv)
    print(df.head(10))
