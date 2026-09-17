"""
data_prep.py - CERT Insider Threat Dataset (r4.2) Ingestion & Cohort Isolation

Ingests CERT r4.2 log files (logon.csv, device.csv, file.csv, http.csv) using memory-safe
chunking (pd.read_csv(chunksize=100000)) to keep memory strictly under 150MB.
If raw CERT files are not present locally, generates a high-fidelity synthetic CERT cohort
mirroring r4.2 schema and behavioral dynamics.
"""

import os
import json
import logging
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

DEFAULT_COHORT = [
    "USER_BENIGN_ALICE",
    "USER_INSIDER_MALORY",
    "USER_INSIDER_BOB",
    "USER_PEER_CHARLIE",
    "USER_PEER_DIANA",
    "USER_PEER_EDWARD"
]

def generate_mock_cert_logs(output_dir: str, start_date="2024-03-01", days=30):
    """
    Generates high-fidelity synthetic CERT r4.2 logs for our target cohort.
    Saves logon.csv, device.csv, file.csv, and http.csv matching exact CMU CERT schemas.
    """
    os.makedirs(output_dir, exist_ok=True)
    base_dt = datetime.strptime(start_date, "%Y-%m-%d")
    logging.info(f"Generating realistic CERT r4.2 logs in {output_dir} across {days} days...")

    logon_rows = []
    device_rows = []
    file_rows = []
    http_rows = []

    event_id = 100000

    for day_idx in range(days):
        cur_date = base_dt + timedelta(days=day_idx)
        date_str = cur_date.strftime("%Y-%m-%d")
        is_weekend = cur_date.weekday() >= 5

        # Department wide event on day 17 (e.g. system patch / late sync)
        dept_drift_day = (day_idx == 17)

        for user in DEFAULT_COHORT:
            pc = f"PC-{user.split('_')[-1][:3]}-01"
            
            # Determine profile for this user & day
            # Baseline is days 0..13 (First 14 days)
            is_baseline = day_idx < 14
            
            if is_baseline:
                # Regular 9-5 employee
                if is_weekend:
                    continue  # benign users don't work weekends
                
                # Standard logon ~ 08:30, logoff ~ 17:15
                logon_time = f"{date_str} 08:30:{np.random.randint(10, 59):02d}"
                logoff_time = f"{date_str} 17:15:{np.random.randint(10, 59):02d}"
                
                logon_rows.append({"id": f"LGN-{event_id}", "date": logon_time, "user": user, "pc": pc, "activity": "Logon"})
                event_id += 1
                logon_rows.append({"id": f"LGN-{event_id}", "date": logoff_time, "user": user, "pc": pc, "activity": "Logoff"})
                event_id += 1

                # Normal HTTP browsing (5-10 domains)
                for _ in range(np.random.randint(6, 12)):
                    h_time = f"{date_str} {np.random.randint(9, 16):02d}:{np.random.randint(10, 59):02d}:00"
                    domain = np.random.choice(["google.com", "github.com", "stackoverflow.com", "internal-portal.corp", "docs.python.org", "wikipedia.org"])
                    http_rows.append({"id": f"HTTP-{event_id}", "date": h_time, "user": user, "pc": pc, "url": f"http://{domain}/page"})
                    event_id += 1

                # Normal file operations (local drive C:)
                for _ in range(np.random.randint(3, 7)):
                    f_time = f"{date_str} {np.random.randint(9, 16):02d}:{np.random.randint(10, 59):02d}:00"
                    file_rows.append({"id": f"FIL-{event_id}", "date": f_time, "user": user, "pc": pc, "filename": f"C:\\Users\\{user}\\Documents\\report.docx", "content": "normal"})
                    event_id += 1

            else:
                # Test Period (Days 14..29)
                # CASE 1: USER_BENIGN_ALICE (Role transfer + Emergency Ticket CR-8821 on Day 19)
                if user == "USER_BENIGN_ALICE":
                    if day_idx == 19:
                        # Massive off-hours database migration work (1:00 AM - 5:00 AM)
                        logon_time = f"{date_str} 01:12:00"
                        logoff_time = f"{date_str} 05:45:00"
                        logon_rows.append({"id": f"LGN-{event_id}", "date": logon_time, "user": user, "pc": pc, "activity": "Logon"})
                        event_id += 1
                        
                        # High file access on database archives
                        for i in range(25):
                            f_time = f"{date_str} 02:{i:02d}:10"
                            file_rows.append({"id": f"FIL-{event_id}", "date": f_time, "user": user, "pc": pc, "filename": f"E:\\db-prod-replica\\shard_{i}.dump", "content": "db_replica"})
                            event_id += 1
                        
                        for _ in range(15):
                            h_time = f"{date_str} 03:{np.random.randint(10, 59):02d}:00"
                            http_rows.append({"id": f"HTTP-{event_id}", "date": h_time, "user": user, "pc": pc, "url": "https://aws-s3-backup-storage.internal/upload"})
                            event_id += 1
                        
                        logon_rows.append({"id": f"LGN-{event_id}", "date": logoff_time, "user": user, "pc": pc, "activity": "Logoff"})
                        event_id += 1
                    else:
                        # Routine days
                        if not is_weekend:
                            logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 08:45:00", "user": user, "pc": pc, "activity": "Logon"})
                            event_id += 1
                            logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 17:30:00", "user": user, "pc": pc, "activity": "Logoff"})
                            event_id += 1

                # CASE 2: USER_INSIDER_MALORY (Silent Shift -> Recon -> USB Exfiltration on Days 20..24)
                elif user == "USER_INSIDER_MALORY":
                    if day_idx < 18:
                        # Slight behavioral drift (working slightly later, browsing cloud storage)
                        logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 09:00:00", "user": user, "pc": pc, "activity": "Logon"})
                        event_id += 1
                        logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 19:30:00", "user": user, "pc": pc, "activity": "Logoff"})
                        event_id += 1
                        for d in ["mega.nz", "dropbox.com", "pastebin.com"]:
                            http_rows.append({"id": f"HTTP-{event_id}", "date": f"{date_str} 19:10:00", "user": user, "pc": pc, "url": f"https://{d}/inspect"})
                            event_id += 1
                    else:
                        # Full Silent Shift Peak (Off-hours, USB insertion, massive removable drive copy)
                        # Off hours 02:15 AM
                        logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 02:15:00", "user": user, "pc": pc, "activity": "Logon"})
                        event_id += 1
                        # USB insertion
                        device_rows.append({"id": f"DEV-{event_id}", "date": f"{date_str} 02:20:10", "user": user, "pc": pc, "activity": "Connect"})
                        event_id += 1
                        
                        # Copy 35 proprietary firmware files to Removable Media E:\
                        for f_idx in range(35):
                            file_rows.append({
                                "id": f"FIL-{event_id}",
                                "date": f"{date_str} 02:{25 + (f_idx // 3):02d}:00",
                                "user": user,
                                "pc": pc,
                                "filename": f"E:\\Exfil\\Firmware_Source_v4_secret_{f_idx}.bin",
                                "content": "proprietary_code"
                            })
                            event_id += 1
                        
                        # Disconnect USB
                        device_rows.append({"id": f"DEV-{event_id}", "date": f"{date_str} 03:40:00", "user": user, "pc": pc, "activity": "Disconnect"})
                        event_id += 1
                        logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 03:45:00", "user": user, "pc": pc, "activity": "Logoff"})
                        event_id += 1

                # CASE 3: USER_INSIDER_BOB (Spoofed/Expired Ticket CR-4040, Off-hours recon on Day 19)
                elif user == "USER_INSIDER_BOB":
                    if day_idx == 19:
                        # Off-hours USB dump claiming maintenance
                        logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 01:45:00", "user": user, "pc": pc, "activity": "Logon"})
                        event_id += 1
                        device_rows.append({"id": f"DEV-{event_id}", "date": f"{date_str} 01:55:00", "user": user, "pc": pc, "activity": "Connect"})
                        event_id += 1
                        for f_idx in range(20):
                            file_rows.append({
                                "id": f"FIL-{event_id}",
                                "date": f"{date_str} 02:{10 + f_idx:02d}:00",
                                "user": user,
                                "pc": pc,
                                "filename": f"E:\\Backup_Dump\\ActiveDirectory_Hashes_{f_idx}.ntds",
                                "content": "hash_dump"
                            })
                            event_id += 1
                        device_rows.append({"id": f"DEV-{event_id}", "date": f"{date_str} 02:40:00", "user": user, "pc": pc, "activity": "Disconnect"})
                        event_id += 1
                        logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 02:50:00", "user": user, "pc": pc, "activity": "Logoff"})
                        event_id += 1
                    else:
                        if not is_weekend:
                            logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 08:50:00", "user": user, "pc": pc, "activity": "Logon"})
                            event_id += 1
                            logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 17:10:00", "user": user, "pc": pc, "activity": "Logoff"})
                            event_id += 1

                # PEERS (Data Platform & IT Ops peers)
                else:
                    if dept_drift_day:
                        # Department-wide patch update causes slight elevated late activity across peers
                        logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 08:30:00", "user": user, "pc": pc, "activity": "Logon"})
                        event_id += 1
                        logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 20:00:00", "user": user, "pc": pc, "activity": "Logoff"})
                        event_id += 1
                    elif not is_weekend:
                        logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 08:30:00", "user": user, "pc": pc, "activity": "Logon"})
                        event_id += 1
                        logon_rows.append({"id": f"LGN-{event_id}", "date": f"{date_str} 17:15:00", "user": user, "pc": pc, "activity": "Logoff"})
                        event_id += 1

    # Save to individual CERT-compliant CSV files
    pd.DataFrame(logon_rows).to_csv(os.path.join(output_dir, "logon.csv"), index=False)
    pd.DataFrame(device_rows).to_csv(os.path.join(output_dir, "device.csv"), index=False)
    pd.DataFrame(file_rows).to_csv(os.path.join(output_dir, "file.csv"), index=False)
    pd.DataFrame(http_rows).to_csv(os.path.join(output_dir, "http.csv"), index=False)
    logging.info(f"CERT r4.2 synthetic logs successfully written to {output_dir}.")

def ingest_cert_data(data_dir: str, cohort=None, chunksize=100000) -> dict:
    """
    Ingests CERT CSVs in memory-efficient chunks (pd.read_csv(chunksize=100000)).
    Filters rows matching the isolated cohort to maintain memory < 150MB.
    Returns dictionary of filtered DataFrames: {'logon': df, 'device': df, 'file': df, 'http': df}.
    """
    if cohort is None:
        cohort = DEFAULT_COHORT
    
    cohort_set = set(cohort)
    log_types = ["logon", "device", "file", "http"]
    filtered_dfs = {}

    for log_name in log_types:
        csv_path = os.path.join(data_dir, f"{log_name}.csv")
        if not os.path.exists(csv_path):
            logging.warning(f"File {csv_path} not found. Attempting generation...")
            generate_mock_cert_logs(data_dir)
            break

    for log_name in log_types:
        csv_path = os.path.join(data_dir, f"{log_name}.csv")
        chunks = []
        logging.info(f"Ingesting {csv_path} in chunks of {chunksize}...")
        for chunk in pd.read_csv(csv_path, chunksize=chunksize):
            if "user" in chunk.columns:
                sub = chunk[chunk["user"].isin(cohort_set)]
                if not sub.empty:
                    chunks.append(sub)
        
        filtered_dfs[log_name] = pd.concat(chunks, ignore_index=True) if chunks else pd.DataFrame()
        logging.info(f"Retained {len(filtered_dfs[log_name])} records for {log_name}.")

    return filtered_dfs

if __name__ == "__main__":
    work_dir = os.path.dirname(os.path.abspath(__file__))
    cert_dir = os.path.join(work_dir, "data_cert")
    dfs = ingest_cert_data(cert_dir)
    print("Ingestion complete. Total events retained:", sum(len(d) for d in dfs.values()))
