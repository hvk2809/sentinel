"""
test_pipeline.py - Automated End-to-End Test Suite for Adjudica (mhash)
"""

import os
import unittest
import pandas as pd
import numpy as np

from data_prep import ingest_cert_data, DEFAULT_COHORT
from features import build_daily_feature_vectors, FEATURE_COLUMNS
from detector import MultivariateMutationEngine
from peer_context import PeerContextEngine
from adjudication import EnterpriseMockAPI, MultiAgentDebateEngine

class TestAdjudicaPipeline(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.base_dir = os.path.dirname(os.path.abspath(__file__))
        cls.cert_dir = os.path.join(cls.base_dir, "data_cert")
        cls.mock_ent_path = os.path.join(cls.base_dir, "mock_enterprise.json")
        
        # 1. Ingestion
        cls.dfs = ingest_cert_data(cls.cert_dir)
        # 2. Features
        cls.features_df = build_daily_feature_vectors(cls.dfs)
        # 3. Layer I Engine
        cls.engine = MultivariateMutationEngine()
        cls.engine.fit_baseline(cls.features_df)
        cls.anom_df = cls.engine.compute_anomaly_metrics(cls.features_df)
        # 4. Layer II Peer Context
        cls.peer_engine = PeerContextEngine(cls.mock_ent_path)
        cls.enriched_df = cls.peer_engine.apply_peer_context(cls.anom_df)
        # 5. Layer III Multi-Agent Debate
        cls.mock_api = EnterpriseMockAPI(cls.mock_ent_path)
        cls.debate_engine = MultiAgentDebateEngine(cls.mock_api)

    def test_feature_extraction(self):
        self.assertFalse(self.features_df.empty, "Feature DataFrame should not be empty")
        for col in FEATURE_COLUMNS:
            self.assertIn(col, self.features_df.columns, f"Feature column {col} missing")
            self.assertTrue(pd.api.types.is_numeric_dtype(self.features_df[col]))

    def test_detector_metrics(self):
        self.assertIn("mahalanobis_dist", self.anom_df.columns)
        self.assertIn("mutation_velocity", self.anom_df.columns)
        self.assertIn("chi2_pval", self.anom_df.columns)
        self.assertIn("mutation_signature", self.anom_df.columns)

        # Ensure no NaNs in Mahalanobis distance
        self.assertFalse(self.anom_df["mahalanobis_dist"].isna().any())

    def test_case_1_benign_suppressed(self):
        # Alice Vance on day 2024-03-20
        alice_rec = self.enriched_df[(self.enriched_df["user"] == "USER_BENIGN_ALICE") & (self.enriched_df["date"] == "2024-03-20")].iloc[0].to_dict()
        result = self.debate_engine.run_adjudication_chamber(alice_rec)
        ruling = result["ruling"]

        self.assertEqual(ruling["verdict"], "SUPPRESSED_LEGITIMATE")
        self.assertEqual(ruling["mitigating_evidence_id"], "CR-8821")
        self.assertGreater(ruling["confidence"], 0.90)

    def test_case_2_insider_threat_escalated(self):
        # Malory Sterling on day 2024-03-20
        malory_rec = self.enriched_df[(self.enriched_df["user"] == "USER_INSIDER_MALORY") & (self.enriched_df["date"] == "2024-03-20")].iloc[0].to_dict()
        result = self.debate_engine.run_adjudication_chamber(malory_rec)
        ruling = result["ruling"]

        self.assertEqual(ruling["verdict"], "ESCALATED_INSIDER_THREAT")
        self.assertIsNone(ruling["mitigating_evidence_id"])
        self.assertGreater(ruling["confidence"], 0.90)

    def test_case_3_spoofed_ticket_escalated(self):
        # Bob Henderson on day 2024-03-20
        bob_rec = self.enriched_df[(self.enriched_df["user"] == "USER_INSIDER_BOB") & (self.enriched_df["date"] == "2024-03-20")].iloc[0].to_dict()
        result = self.debate_engine.run_adjudication_chamber(bob_rec)
        ruling = result["ruling"]

        self.assertEqual(ruling["verdict"], "ESCALATED_INSIDER_THREAT")
        self.assertIsNone(ruling["mitigating_evidence_id"])
        self.assertIn("CR-4040", ruling["justification"])

if __name__ == "__main__":
    unittest.main()
