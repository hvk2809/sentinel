"""
peer_context.py - Layer II: Lightweight Structural Context & Peer Normalization

1. Groups users by department/role based on mock_enterprise.json.
2. Calculates Department Mean Drift for each day t.
3. Normalizes user drift:
   - If entire department shows elevated drift on day t (e.g. company-wide deployment),
     dampens the anomaly score.
   - If user's drift is isolated while peers remain steady, amplifies the risk multiplier.
"""

import os
import json
import logging
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

DEFAULT_DEPT_MAPPING = {
    "USER_BENIGN_ALICE": "Data Platform",
    "USER_PEER_CHARLIE": "Data Platform",
    "USER_INSIDER_MALORY": "Firmware & Hardware Eng",
    "USER_PEER_DIANA": "Firmware & Hardware Eng",
    "USER_INSIDER_BOB": "IT Operations",
    "USER_PEER_EDWARD": "IT Operations"
}

def load_user_departments(enterprise_json_path: str) -> dict:
    if os.path.exists(enterprise_json_path):
        try:
            with open(enterprise_json_path, "r") as f:
                data = json.load(f)
            hr = data.get("hr_records", {})
            mapping = {uid: info.get("department", "General") for uid, info in hr.items()}
            return mapping
        except Exception as e:
            logging.warning(f"Error reading enterprise json: {e}")
    return DEFAULT_DEPT_MAPPING

class PeerContextEngine:
    def __init__(self, enterprise_json_path=None, isolation_multiplier=1.25, dampening_rate=0.4):
        self.enterprise_path = enterprise_json_path
        self.isolation_multiplier = isolation_multiplier
        self.dampening_rate = dampening_rate
        self.dept_mapping = load_user_departments(enterprise_json_path) if enterprise_json_path else DEFAULT_DEPT_MAPPING

    def apply_peer_context(self, anomaly_df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculates daily department drift and applies peer normalization to anomaly scores.
        """
        df = anomaly_df.copy()
        
        # Attach department
        df["department"] = df["user"].map(lambda u: self.dept_mapping.get(u, "General"))

        # Calculate Department Mean Drift per date
        dept_daily = df.groupby(["department", "date"])["mahalanobis_dist"].transform("mean")
        dept_count = df.groupby(["department", "date"])["user"].transform("count")

        df["dept_mean_drift"] = dept_daily.round(4)
        df["dept_peer_count"] = dept_count

        adjusted_scores = []
        peer_verdicts = []
        peer_explanations = []

        for _, row in df.iterrows():
            dm = row["mahalanobis_dist"]
            dept_drift = row["dept_mean_drift"]
            dept = row["department"]

            # Baseline normal threshold for peer drift
            # If peer drift is high (> 3.0), team-wide event
            if dept_drift > 3.0 and dm > 3.0:
                # Department-wide surge: penalize/dampen score
                # Dampen formula: dm / (1 + dampening_rate * (dept_drift / 3.0))
                factor = 1.0 + self.dampening_rate * (dept_drift / 3.0)
                adj = dm / factor
                verdict = "PEER_ALIGNED_DAMPENED"
                explanation = f"Department '{dept}' exhibited team-wide elevated drift (mean: {dept_drift:.2f}). Risk score penalized by {factor:.2f}x to suppress false positive."
            elif dm >= 3.0 and dept_drift <= 2.5:
                # Isolated anomaly: user is drifting while department peers remain stable
                # Isolation ratio
                isolation_ratio = dm / max(0.5, dept_drift)
                factor = min(2.0, 1.0 + (self.isolation_multiplier - 1.0) * (isolation_ratio / 2.0))
                adj = dm * factor
                verdict = "ISOLATED_DRIFT_AMPLIFIED"
                explanation = f"User drift is highly isolated compared to '{dept}' baseline (dept mean: {dept_drift:.2f}). Risk score amplified by {factor:.2f}x."
            else:
                adj = dm
                verdict = "NORMAL_PEER_BASELINE"
                explanation = f"User behavior aligns with normal peer activity in '{dept}'."

            adjusted_scores.append(round(adj, 4))
            peer_verdicts.append(verdict)
            peer_explanations.append(explanation)

        df["adjusted_risk_score"] = adjusted_scores
        df["peer_context_verdict"] = peer_verdicts
        df["peer_explanation"] = peer_explanations

        return df

if __name__ == "__main__":
    work_dir = os.path.dirname(os.path.abspath(__file__))
    features_csv = os.path.join(work_dir, "processed_features.csv")
    ent_json = os.path.join(work_dir, "mock_enterprise.json")
    
    from detector import MultivariateMutationEngine
    df = pd.read_csv(features_csv)
    engine = MultivariateMutationEngine()
    engine.fit_baseline(df)
    anom_df = engine.compute_anomaly_metrics(df)

    peer_engine = PeerContextEngine(ent_json)
    enriched_df = peer_engine.apply_peer_context(anom_df)

    print(enriched_df[["user", "date", "department", "mahalanobis_dist", "dept_mean_drift", "adjusted_risk_score", "peer_context_verdict"]].head(15))
