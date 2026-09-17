"""
detector.py - Layer I: Multivariate Mutation Engine

Implements:
1. Personal baseline mean vector (mu) and historical covariance matrix (Sigma) for each user.
2. Regularized Mahalanobis Distance:
   D_M(X_t) = sqrt((X_t - mu)^T * (Sigma + epsilon * I)^(-1) * (X_t - mu))
   where epsilon = 1e-5 for numerical stability.
3. Mutation Velocity:
   Delta_M_t = D_M(X_t) - D_M(X_{t-1})
4. Trigger Condition: Chi-Square p-value < 0.01 (df=k) or Delta_M_t spike.
5. Mutation Signature: Top-3 feature contributors to the Mahalanobis distance.
"""

import os
import logging
import numpy as np
import pandas as pd
from scipy import stats
from scipy import linalg
from features import FEATURE_COLUMNS

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

EPSILON = 1e-5
CHI2_PVAL_THRESHOLD = 0.01
VELOCITY_THRESHOLD = 3.5

class MultivariateMutationEngine:
    def __init__(self, feature_cols=None, epsilon=EPSILON):
        self.feature_cols = feature_cols or FEATURE_COLUMNS
        self.epsilon = epsilon
        self.k = len(self.feature_cols)
        self.user_baselines = {}

    def fit_baseline(self, df: pd.DataFrame):
        """
        Fits baseline mean (mu) and regularized inverse covariance matrix for each user
        using records where is_baseline == True.
        """
        baseline_df = df[df["is_baseline"] == True]
        users = df["user"].unique()

        for user in users:
            u_base = baseline_df[baseline_df["user"] == user]
            if len(u_base) < 2:
                # If baseline is tiny, use entire user data or default identity
                u_base = df[df["user"] == user]

            X = u_base[self.feature_cols].values.astype(float)
            mu = np.mean(X, axis=0)
            
            # Covariance matrix calculation
            cov = np.cov(X, rowvar=False) if len(X) > 1 else np.zeros((self.k, self.k))
            if cov.ndim == 0:
                cov = np.array([[cov]])
            elif cov.shape != (self.k, self.k):
                cov = np.eye(self.k) * 0.01

            # Regularize with epsilon * I
            cov_reg = cov + self.epsilon * np.eye(self.k)
            inv_cov = linalg.pinv(cov_reg)

            self.user_baselines[user] = {
                "mu": mu,
                "cov": cov,
                "inv_cov": inv_cov,
                "baseline_mean_dict": dict(zip(self.feature_cols, mu))
            }
        
        logging.info(f"Fitted baselines for {len(self.user_baselines)} users.")

    def compute_anomaly_metrics(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Computes Mahalanobis distance, Chi-Square p-value, Mutation Velocity (Delta_M_t),
        trigger flag, and Top-3 mutation signature for all sessions in df.
        """
        results = []
        
        # Sort by user and date
        sorted_df = df.sort_values(by=["user", "date"]).copy()

        for user, group in sorted_df.groupby("user"):
            if user not in self.user_baselines:
                continue

            base = self.user_baselines[user]
            mu = base["mu"]
            inv_cov = base["inv_cov"]

            prev_dm = 0.0

            for _, row in group.iterrows():
                x = row[self.feature_cols].values.astype(float)
                diff = x - mu

                # D_M^2 = diff.T * inv_cov * diff
                # Dimension decomposition: contribution_i = diff_i * (inv_cov * diff)_i
                transformed = np.dot(inv_cov, diff)
                contributions = diff * transformed
                dm_sq = float(np.dot(diff, transformed))
                dm = float(np.sqrt(max(0.0, dm_sq)))

                # Chi-square p-value with degrees of freedom k
                # Survival function sf = 1 - cdf
                p_val = float(stats.chi2.sf(dm_sq, df=self.k))

                # Mutation Velocity: Delta_M_t = D_M(X_t) - D_M(X_{t-1})
                delta_m = float(dm - prev_dm)
                prev_dm = dm

                # Top-3 contributing dimensions
                feature_contribs = sorted(
                    zip(self.feature_cols, contributions, x, mu),
                    key=lambda item: item[1],
                    reverse=True
                )
                top_3_dims = [
                    {
                        "feature": item[0],
                        "contribution": float(round(item[1], 4)),
                        "current_val": float(round(item[2], 4)),
                        "baseline_val": float(round(item[3], 4)),
                        "ratio_change": float(round((item[2] / (item[3] + 1e-5)), 2))
                    }
                    for item in feature_contribs[:3]
                ]

                # Trigger Condition: Chi2 p-val < 0.01 OR Delta_M_t spike
                triggered = bool((p_val < CHI2_PVAL_THRESHOLD) or (delta_m >= VELOCITY_THRESHOLD))

                row_dict = row.to_dict()
                row_dict["mahalanobis_dist"] = round(dm, 4)
                row_dict["mutation_velocity"] = round(delta_m, 4)
                row_dict["chi2_pval"] = round(p_val, 6)
                row_dict["is_anomaly_triggered"] = triggered
                row_dict["mutation_signature"] = top_3_dims
                results.append(row_dict)

        res_df = pd.DataFrame(results)
        return res_df

if __name__ == "__main__":
    work_dir = os.path.dirname(os.path.abspath(__file__))
    features_csv = os.path.join(work_dir, "processed_features.csv")
    if not os.path.exists(features_csv):
        from features import process_and_save_features
        features_csv = process_and_save_features(os.path.join(work_dir, "data_cert"), features_csv)
    
    df = pd.read_csv(features_csv)
    engine = MultivariateMutationEngine()
    engine.fit_baseline(df)
    anom_df = engine.compute_anomaly_metrics(df)
    triggered = anom_df[anom_df["is_anomaly_triggered"] == True]
    print(f"Total triggered anomaly sessions: {len(triggered)}")
    print(triggered[["user", "date", "mahalanobis_dist", "mutation_velocity", "chi2_pval"]].head(10))
