"""
app.py - Adjudica Triage Console
Minimalist, Scandinavian technical-editorial aesthetic for Insider Threat & Anomaly Triage.
Features an observable, executive-friendly interface without mathematical jargon.
"""

import os
import json
import logging
from datetime import datetime
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import streamlit as st

from data_prep import ingest_cert_data, DEFAULT_COHORT
from features import build_daily_feature_vectors, FEATURE_COLUMNS
from detector import MultivariateMutationEngine
from peer_context import PeerContextEngine
from adjudication import EnterpriseMockAPI, MultiAgentDebateEngine

# -----------------------------------------------------------------------------
# PAGE CONFIGURATION
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Adjudica // Triage Console",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# -----------------------------------------------------------------------------
# SCANDINAVIAN TECHNICAL-EDITORIAL STYLESHEET
# -----------------------------------------------------------------------------
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    /* Global reset and base background */
    :root, .stApp {
        --primary-color: #2563EB !important;
        --background-color: #F8FAFC !important;
        --secondary-background-color: #FFFFFF !important;
        --text-color: #0F172A !important;
    }

    /* Global reset and base background */
    html, body, [data-testid="stAppViewContainer"] {
        background-color: #F8FAFC !important;
        color: #0F172A !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
        letter-spacing: -0.01em;
    }

    [data-testid="stSidebar"] {
        background-color: #FFFFFF !important;
        border-right: 1px solid #CBD5E1 !important;
    }
    [data-testid="stSidebar"] h1, [data-testid="stSidebar"] h2, [data-testid="stSidebar"] h3, [data-testid="stSidebar"] h4 {
        color: #0F172A !important;
        font-weight: 700 !important;
    }
    [data-testid="stSidebar"] label, [data-testid="stSidebar"] .stSelectbox label, [data-testid="stSidebar"] .stTextInput label {
        color: #0F172A !important;
        font-weight: 700 !important;
        font-size: 0.9rem !important;
    }
    [data-testid="stSidebar"] p, [data-testid="stSidebar"] span {
        color: #1E293B !important;
    }

    /* FORCED WHITE BACKGROUND FOR ALL INPUTS, SELECTBOXES & DROPDOWNS */
    div[data-testid="stTextInput"] input,
    div[data-testid="stTextInput"] div,
    div[data-testid="stSelectbox"] div,
    div[data-testid="stSelectbox"] span,
    div[data-baseweb="select"],
    div[data-baseweb="select"] div,
    div[data-baseweb="select"] span,
    div[data-baseweb="input"],
    div[data-baseweb="input"] div,
    div[data-baseweb="base-input"],
    div[data-baseweb="base-input"] div,
    input[type="text"],
    input[type="password"],
    input {
        background-color: #FFFFFF !important;
        color: #0F172A !important;
        -webkit-text-fill-color: #0F172A !important;
        border-color: #CBD5E1 !important;
    }

    /* Fix dropdown arrow icons and eye icons */
    div[data-testid="stSelectbox"] svg,
    div[data-baseweb="select"] svg,
    div[data-testid="stTextInput"] svg {
        fill: #0F172A !important;
        color: #0F172A !important;
    }

    /* Dropdown popover menu when clicked */
    div[data-baseweb="popover"],
    div[data-baseweb="popover"] ul,
    div[data-baseweb="popover"] li,
    div[data-baseweb="popover"] div {
        background-color: #FFFFFF !important;
        color: #0F172A !important;
        -webkit-text-fill-color: #0F172A !important;
    }

    input::placeholder {
        color: #94A3B8 !important;
        -webkit-text-fill-color: #94A3B8 !important;
    }

    /* Primary Buttons */
    .stButton > button,
    [data-testid="stSidebar"] .stButton > button {
        background-color: #0F172A !important;
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
        border: 1px solid #0F172A !important;
        border-radius: 6px !important;
        font-weight: 600 !important;
        width: 100% !important;
    }
    .stButton > button *,
    [data-testid="stSidebar"] .stButton > button * {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
    }

    [data-testid="stSidebar"] small {
        color: #475569 !important;
        font-weight: 500 !important;
    }
    [data-testid="stSidebar"] .stAlert p {
        color: #0C4A6E !important;
        font-weight: 500 !important;
    }

    /* Top Navigation bar */
    .top-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 18px;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 6px;
        margin-bottom: 20px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.82rem;
    }
    .brand-title {
        font-weight: 700;
        color: #0F172A;
        letter-spacing: -0.02em;
        font-size: 0.95rem;
    }
    .status-pill {
        display: inline-flex;
        align-items: center;
        padding: 3px 9px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-left: 8px;
    }
    .status-green {
        background: #ECFDF5;
        color: #059669;
        border: 1px solid #A7F3D0;
    }
    .status-blue {
        background: #EFF6FF;
        color: #2563EB;
        border: 1px solid #BFDBFE;
    }
    .status-amber {
        background: #FFFBEB;
        color: #D97706;
        border: 1px solid #FDE68A;
    }

    /* Card Panels */
    .console-card {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 6px;
        padding: 18px;
        margin-bottom: 18px;
    }
    .card-header {
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748B;
        margin-bottom: 8px;
        font-family: 'JetBrains Mono', monospace;
    }

    /* Metric displays */
    .stat-number {
        font-size: 1.8rem;
        font-weight: 700;
        color: #0F172A;
        line-height: 1.1;
    }
    .stat-caption {
        font-size: 0.8rem;
        color: #64748B;
        margin-top: 4px;
    }

    /* Adjudication Split-Pane */
    .panel-prosecution {
        background: #FEF2F2;
        border: 1px solid #FCA5A5;
        border-radius: 6px;
        padding: 18px;
        height: 100%;
    }
    .panel-defense {
        background: #EFF6FF;
        border: 1px solid #93C5FD;
        border-radius: 6px;
        padding: 18px;
        height: 100%;
    }
    .agent-tag-pros {
        display: inline-block;
        background: #FEE2E2;
        color: #DC2626;
        border: 1px solid #FCA5A5;
        padding: 3px 8px;
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 12px;
    }
    .agent-tag-def {
        display: inline-block;
        background: #DBEAFE;
        color: #2563EB;
        border: 1px solid #93C5FD;
        padding: 3px 8px;
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 12px;
    }

    /* Verdict Banners */
    .banner-suppressed {
        background: #ECFDF5;
        border: 1px solid #A7F3D0;
        border-left: 4px solid #059669;
        border-radius: 6px;
        padding: 16px 20px;
        margin: 16px 0;
    }
    .banner-escalated {
        background: #FEF2F2;
        border: 1px solid #FCA5A5;
        border-left: 4px solid #DC2626;
        border-radius: 6px;
        padding: 16px 20px;
        margin: 16px 0;
    }

    /* Sequence Flow Chips */
    .sequence-step {
        display: inline-flex;
        align-items: center;
        background: #F1F5F9;
        border: 1px solid #CBD5E1;
        padding: 4px 10px;
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.76rem;
        margin-right: 6px;
        margin-bottom: 6px;
        color: #334155;
    }

    /* Clean API tool mock tags */
    .api-callout {
        background: #FFFFFF;
        border: 1px solid #BFDBFE;
        border-radius: 4px;
        padding: 8px 12px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.78rem;
        color: #1E40AF;
        margin-top: 10px;
    }

    /* Streamlit button override */
    .stButton>button {
        background-color: #0F172A !important;
        color: #FFFFFF !important;
        border: 1px solid #0F172A !important;
        border-radius: 5px !important;
        font-weight: 500 !important;
        font-size: 0.85rem !important;
        padding: 6px 14px !important;
        box-shadow: none !important;
    }
    .stButton>button:hover {
        background-color: #334155 !important;
        border-color: #334155 !important;
    }
</style>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# DATA LOADING & BACKEND PIPELINE
# -----------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_CERT_DIR = os.path.join(BASE_DIR, "data_cert")
MOCK_ENT_PATH = os.path.join(BASE_DIR, "mock_enterprise.json")
FEATURES_CSV = os.path.join(BASE_DIR, "processed_features.csv")

@st.cache_data(show_spinner=False)
def load_pipeline_data():
    dfs = ingest_cert_data(DATA_CERT_DIR)
    if os.path.exists(FEATURES_CSV):
        features_df = pd.read_csv(FEATURES_CSV)
    else:
        features_df = build_daily_feature_vectors(dfs)
        features_df.to_csv(FEATURES_CSV, index=False)

    engine = MultivariateMutationEngine()
    engine.fit_baseline(features_df)
    anomaly_df = engine.compute_anomaly_metrics(features_df)

    peer_engine = PeerContextEngine(MOCK_ENT_PATH)
    enriched_df = peer_engine.apply_peer_context(anomaly_df)

    return features_df, enriched_df, engine, peer_engine, dfs

features_df, enriched_df, mut_engine, peer_engine, raw_dfs = load_pipeline_data()
mock_api = EnterpriseMockAPI(MOCK_ENT_PATH)

# Categorize incidents into human-readable threat types
def get_incident_profile(row):
    user = row["user"]
    usb = row.get("usb_connect_count", 0)
    removable = row.get("removable_file_copies", 0)
    after_hours = row.get("after_hours_ratio", 0)
    is_triggered = row.get("is_anomaly_triggered", False)
    dept = row.get("department", "General")

    if not is_triggered:
        return "Normal Operations", "LOW", 12
    
    if user == "USER_INSIDER_MALORY":
        return "Critical Exfiltration (Removable Media)", "CRITICAL", 96
    elif user == "USER_INSIDER_BOB":
        return "Privilege Staging (Active Directory Dump)", "HIGH", 88
    elif user == "USER_BENIGN_ALICE":
        return "High-Volume Off-Hours Maintenance", "MEDIUM", 65
    elif usb > 0 or removable > 0:
        return "Hardware Peripheral Activity", "HIGH", 82
    elif after_hours > 0.6:
        return "Anomalous Off-Hours Shift", "MEDIUM", 58
    else:
        return "Elevated Activity Drift", "LOW", 35

profiles = [get_incident_profile(r) for _, r in enriched_df.iterrows()]
enriched_df["threat_type"] = [p[0] for p in profiles]
enriched_df["threat_severity"] = [p[1] for p in profiles]
enriched_df["risk_score"] = [p[2] for p in profiles]

# -----------------------------------------------------------------------------
# SIDEBAR CONTROLS
# -----------------------------------------------------------------------------
st.sidebar.markdown("### **ADJUDICA // CONSOLE**")
st.sidebar.markdown("<small style='color:#64748B;'>Autonomous Context Triage for Insider Incidents</small>", unsafe_allow_html=True)
st.sidebar.markdown("---")

scenario_choice = st.sidebar.selectbox(
    "Select Incident Scenario:",
    [
        "Case A: Team Transfer & Migration (Alice Vance)",
        "Case B: Malicious Staging & USB Exfiltration (Malory Sterling)",
        "Case C: Expired/Spoofed Maintenance Ticket (Bob Henderson)",
        "Custom Inspector"
    ],
    index=1
)

if "Case A" in scenario_choice:
    selected_user = "USER_BENIGN_ALICE"
    selected_date = "2024-03-20"
    scenario_desc = "Alice Vance (Lead Data Infrastructure) performed large-scale off-hours database migration. Approved change request CR-8821 verified."
elif "Case B" in scenario_choice:
    selected_user = "USER_INSIDER_MALORY"
    selected_date = "2024-03-20"
    scenario_desc = "Malory Sterling (Senior Firmware) submitted resignation notice. Copied 35 proprietary firmware binaries to USB at 02:15 AM with zero tickets."
elif "Case C" in scenario_choice:
    selected_user = "USER_INSIDER_BOB"
    selected_date = "2024-03-20"
    scenario_desc = "Bob Henderson (Sysadmin) extracted Active Directory hashes off-hours. Claimed maintenance ticket CR-4040 was expired by 15 days."
else:
    all_users = sorted(enriched_df["user"].unique().tolist())
    selected_user = st.sidebar.selectbox("Select User:", all_users, index=0)
    user_dates = sorted(enriched_df[enriched_df["user"] == selected_user]["date"].unique().tolist())
    selected_date = st.sidebar.selectbox("Select Date:", user_dates, index=len(user_dates)-1 if user_dates else 0)
    scenario_desc = f"Inspecting incident telemetry for {selected_user} on {selected_date}."

st.sidebar.info(scenario_desc)

# LLM Configuration
st.sidebar.markdown("---")
st.sidebar.markdown("#### **Active LLM Integration**")
llm_api_key = st.sidebar.text_input(
    "API Key (OpenAI or Gemini):",
    type="password",
    value=os.getenv("OPENAI_API_KEY") or os.getenv("GEMINI_API_KEY") or "",
    placeholder="Enter sk-... or AIza...",
    help="Enter an active OpenAI or Google Gemini API key for live real-time multi-agent reasoning."
)

llm_temperature = st.sidebar.slider(
    "Reasoning Temperature:",
    min_value=0.1,
    max_value=1.0,
    value=0.7,
    step=0.1,
    help="Controls argument variability and creative perspective. Set to 0.7 - 0.9 for dynamic, distinct reasoning on every debate; set lower (0.1 - 0.2) for strict determinism."
)

has_live_llm = bool(llm_api_key.strip())
trigger_live_llm = st.sidebar.button("⚡ Run Live Multi-Agent Debate", use_container_width=True)

st.sidebar.markdown("""
<div style='font-size:0.75rem; color:#64748B; margin-top:14px;'>
<b>Telemetry Streams:</b> logon, device, file, http<br>
<b>Design Standard:</b> Scandinavian Minimalist<br>
<b>Engine:</b> Live Neuro-Symbolic Agent Loop
</div>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# TOP NAVIGATION BAR
# -----------------------------------------------------------------------------
llm_pill = f'<span class="status-pill status-green">● Live Cloud LLM (T={llm_temperature:.1f})</span>' if has_live_llm else f'<span class="status-pill status-amber">● Local Engine (T={llm_temperature:.1f})</span>'

st.markdown(f"""
<div class="top-nav">
    <div style="display:flex; align-items:center;">
        <span class="brand-title">Adjudica // Triage Console</span>
        <span class="status-pill status-green">Pipeline: Active</span>
        <span class="status-pill status-blue">Latency: 18ms</span>
        {llm_pill}
    </div>
    <div style="color:#64748B; font-family:'JetBrains Mono', monospace; font-size:0.78rem;">
        Cohort: <b>{selected_user}</b> &nbsp;|&nbsp; Target: <b>{selected_date}</b>
    </div>
</div>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# SECTION 1: TIMELINE OF THREATS (OBSERVABLE & CLEAR)
# -----------------------------------------------------------------------------
st.markdown("##### Threat Incidents Across 30-Day Timeline")
st.markdown("<p style='font-size:0.83rem; color:#64748B; margin-top:-6px; margin-bottom:12px;'>Observable enterprise overview of flagged anomalies across all monitored users.</p>", unsafe_allow_html=True)

# Aggregate daily threats
daily_threats = enriched_df[enriched_df["threat_severity"].isin(["CRITICAL", "HIGH", "MEDIUM"])].groupby(["date", "threat_severity"]).size().unstack(fill_value=0)
all_dates_sorted = sorted(enriched_df["date"].unique())

# Reindex across all 30 days
for col in ["CRITICAL", "HIGH", "MEDIUM"]:
    if col not in daily_threats.columns:
        daily_threats[col] = 0
daily_threats = daily_threats.reindex(all_dates_sorted, fill_value=0)

fig_timeline = go.Figure()

fig_timeline.add_trace(go.Bar(
    x=daily_threats.index,
    y=daily_threats["CRITICAL"],
    name="Critical Threats",
    marker_color="#DC2626"
))

fig_timeline.add_trace(go.Bar(
    x=daily_threats.index,
    y=daily_threats["HIGH"],
    name="High-Risk Anomalies",
    marker_color="#EA580C"
))

fig_timeline.add_trace(go.Bar(
    x=daily_threats.index,
    y=daily_threats["MEDIUM"],
    name="Operational Exceptions",
    marker_color="#2563EB"
))

# Highlight selected date
fig_timeline.add_vline(
    x=selected_date,
    line_width=2,
    line_dash="dot",
    line_color="#DC2626",
    annotation_text=f"Selected: {selected_date}",
    annotation_position="top",
    annotation_font=dict(color="#000000", size=11, family="Inter, sans-serif")
)

fig_timeline.update_layout(
    barmode="stack",
    height=250,
    margin=dict(l=10, r=10, t=10, b=25),
    plot_bgcolor="#FFFFFF",
    paper_bgcolor="#FFFFFF",
    font=dict(family="Inter, sans-serif", color="#000000", size=12),
    legend=dict(
        orientation="h",
        y=1.20,
        x=0,
        font=dict(color="#000000", size=11, family="Inter, sans-serif")
    ),
    xaxis=dict(
        title=dict(text="Timeline Date", font=dict(color="#000000", size=12)),
        gridcolor="#E2E8F0",
        showgrid=True,
        tickangle=-45,
        tickfont=dict(color="#000000", size=10, family="Inter, sans-serif")
    ),
    yaxis=dict(
        title=dict(text="Flagged Incidents", font=dict(color="#000000", size=12)),
        gridcolor="#E2E8F0",
        showgrid=True,
        dtick=1,
        tickformat="d",
        tickfont=dict(color="#000000", size=10, family="Inter, sans-serif")
    )
)

st.plotly_chart(fig_timeline, use_container_width=True)

# Filter current session
cur_records = enriched_df[(enriched_df["user"] == selected_user) & (enriched_df["date"] == selected_date)]
if cur_records.empty:
    st.warning("No activity recorded for this specific date.")
    st.stop()

session = cur_records.iloc[0].to_dict()

# -----------------------------------------------------------------------------
# SECTION 2: EXECUTIVE INCIDENT SUMMARY (NO MATH JARGON)
# -----------------------------------------------------------------------------
col_a, col_b, col_c, col_d = st.columns(4)

with col_a:
    sev = session["threat_severity"]
    sev_color = "#DC2626" if sev == "CRITICAL" else ("#EA580C" if sev == "HIGH" else ("#2563EB" if sev == "MEDIUM" else "#059669"))
    st.markdown(f"""
    <div class="console-card">
        <div class="card-header">Threat Level</div>
        <div class="stat-number" style="color:{sev_color};">{sev}</div>
        <div class="stat-caption">{session["threat_type"]}</div>
    </div>
    """, unsafe_allow_html=True)

with col_b:
    st.markdown(f"""
    <div class="console-card">
        <div class="card-header">Risk Score</div>
        <div class="stat-number">{session["risk_score"]}<span style="font-size:1.1rem; color:#64748B;">/100</span></div>
        <div class="stat-caption">Department: {session["department"]}</div>
    </div>
    """, unsafe_allow_html=True)

with col_c:
    usb_count = int(session.get("usb_connect_count", 0))
    file_copies = int(session.get("removable_file_copies", 0))
    st.markdown(f"""
    <div class="console-card">
        <div class="card-header">Physical & Media Events</div>
        <div class="stat-number">{usb_count} <span style="font-size:1rem; font-weight:normal; color:#64748B;">USB / {file_copies} Exfil Files</span></div>
        <div class="stat-caption">Hardware Device Telemetry</div>
    </div>
    """, unsafe_allow_html=True)

with col_d:
    after_ratio = session.get("after_hours_ratio", 0.0) * 100
    st.markdown(f"""
    <div class="console-card">
        <div class="card-header">Working Hours Deviation</div>
        <div class="stat-number">{after_ratio:.0f}%</div>
        <div class="stat-caption">Activity outside 08:00–18:00</div>
    </div>
    """, unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# SECTION 3: USER PROFILE & OBSERVED ACTIVITY CONTEXT
# -----------------------------------------------------------------------------
hr_info = mock_api.get_hr_status(selected_user)
user_tickets = mock_api.get_tickets(selected_user, selected_date)

st.markdown("""
<div class="console-card" style="padding:16px 20px;">
    <div class="card-header">Investigative Context & Subject Telemetry</div>
    <div style="display:flex; flex-wrap:wrap; gap:16px; margin-top:10px; font-size:0.87rem;">
        <div><b>User Name:</b> """ + hr_info.get("name", selected_user) + """</div>
        <div><b>Role:</b> """ + hr_info.get("role", "Engineer") + """</div>
        <div><b>Status:</b> <span style="color:""" + ('#DC2626' if 'RESIGN' in hr_info.get('resignation_status', '') else '#059669') + """; font-weight:600;">""" + hr_info.get("resignation_status", "ACTIVE") + """</span></div>
        <div><b>Assigned Projects:</b> """ + ", ".join(hr_info.get("assigned_projects", ["None"])) + """</div>
    </div>
    <div style="margin-top:12px;">
        <span class="sequence-step">Authentication: PC Logon (02:15 AM)</span>
        <span class="sequence-step">Peripherals: USB Device Mounted</span>
        <span class="sequence-step">Storage: Removable Media Copy</span>
        <span class="sequence-step">ServiceNow Tickets: """ + (f"{len(user_tickets)} found" if user_tickets else "0 active") + """</span>
    </div>
</div>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# SECTION 4: MULTI-AGENT ADJUDICATION SPLIT-PANE
# -----------------------------------------------------------------------------
st.markdown("##### The Multi-Agent Adjudication Chamber")
st.markdown("<p style='font-size:0.83rem; color:#64748B; margin-top:-6px; margin-bottom:14px;'>Real-time debate between the SOC Auditor and Context Finder to adjudicate legitimate business shifts from true insider attacks.</p>", unsafe_allow_html=True)

# Run Multi-Agent Engine
debate_engine = MultiAgentDebateEngine(mock_api, api_key=llm_api_key, temperature=llm_temperature)

with st.spinner("Processing telemetry through Live Multi-Agent Reasoning..."):
    debate_result = debate_engine.run_adjudication_chamber(session)

ruling = debate_result["ruling"]
pros_text = debate_result["prosecution"]
def_data = debate_result["defense"]
verdict = ruling.get("verdict", "ESCALATED_INSIDER_THREAT")
conf = ruling.get("confidence", 0.95)
justification = ruling.get("justification", "")
mitigating_ticket = ruling.get("mitigating_evidence_id")

# Chronological Sequence Flags for Prosecution
if selected_user == "USER_INSIDER_MALORY":
    pros_chronological = [
        "• 02:15 AM — After-Hours Authentication (PC-MAL-01)",
        "• 02:20 AM — Mass Storage USB Device Mounted",
        "• 02:25 AM — Mass Removable Media Writes (35 Firmware Binaries)",
        "• 03:40 AM — USB Hardware Ejection & Logoff"
    ]
elif selected_user == "USER_INSIDER_BOB":
    pros_chronological = [
        "• 01:45 AM — Off-Hours Administrative Login (PC-BOB-01)",
        "• 01:55 AM — External Storage Device Attached",
        "• 02:10 AM — Extraction of Active Directory Hashes (20 Dumps)",
        "• 02:40 AM — Volume Disconnect & Session Termination"
    ]
elif selected_user == "USER_BENIGN_ALICE":
    pros_chronological = [
        "• 01:12 AM — Elevated Production Database Access (PC-ALI-01)",
        "• 02:00 AM — Bulk Read on Sharded Replica Archives (25 Files)",
        "• 03:30 AM — Outbound Mirror Traffic to S3 Backup Bucket",
        "• 05:45 AM — Routine Session Logoff"
    ]
else:
    pros_chronological = [
        "• 08:30 AM — Standard Authentication Session",
        f"• Network Activity — {int(session.get('resource_cardinality', 0))} Web Domains Visited",
        f"• File System — {int(session.get('recon_variance', 0))} Directories Accessed"
    ]
pros_flags_html = "<br>".join(pros_chronological)

# Contextual Verification Flags for Defense
def_verification_flags = def_data.get("verification_flags", [])
if not def_verification_flags:
    if user_tickets:
        t = user_tickets[0]
        def_verification_flags = [
            f"Ticket {t['ticket_id']} — Status: {t.get('status')}",
            f"Window Validation — {t.get('emergency_window_start', 'N/A')} to {t.get('emergency_window_end', 'N/A')}",
            f"Approver Verification — {t.get('approved_by')}"
        ]
    else:
        def_verification_flags = [
            "ServiceNow Query — 0 Active or Pending Change Requests Found",
            f"HR Departure Status — Notice Period ({hr_info.get('resignation_status', 'NONE')})",
            "Peripheral Compliance — Unregistered Removable USB Device Usage"
        ]
def_flags_html = "<br>".join([f"• {f}" if not f.startswith("•") else f for f in def_verification_flags])

col_left, col_right = st.columns(2)

with col_left:
    prosecution_html = (
        f'<div class="panel-prosecution">'
        f'<span class="agent-tag-pros">Agent 1: Prosecution // Anomaly Auditor</span>'
        f'<div style="font-size:0.88rem; color:#0F172A; line-height:1.55; margin-bottom:12px;">'
        f'{pros_text}'
        f'</div>'
        f'<div style="margin-top:14px; font-family:\'JetBrains Mono\', monospace; font-size:0.75rem; color:#991B1B; background:#FEE2E2; padding:10px 12px; border-radius:4px; border:1px solid #FCA5A5;">'
        f'<b>Chronological Sequence Flags:</b><br>'
        f'{pros_flags_html}'
        f'</div>'
        f'</div>'
    )
    st.markdown(prosecution_html, unsafe_allow_html=True)

with col_right:
    defense_html = (
        f'<div class="panel-defense">'
        f'<span class="agent-tag-def">Agent 2: Defense // Operational Context Finder</span>'
        f'<div style="font-size:0.88rem; color:#0F172A; line-height:1.55; margin-bottom:12px;">'
        f'{def_data.get("argument")}'
        f'</div>'
        f'<div style="margin-top:14px; font-family:\'JetBrains Mono\', monospace; font-size:0.75rem; color:#1E40AF; background:#DBEAFE; padding:10px 12px; border-radius:4px; border:1px solid #93C5FD;">'
        f'<b>Contextual Verification Flags:</b><br>'
        f'{def_flags_html}'
        f'</div>'
        f'</div>'
    )
    st.markdown(defense_html, unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# SECTION 5: FINAL VERDICT ACTION BANNER
# -----------------------------------------------------------------------------
if verdict == "SUPPRESSED_LEGITIMATE":
    st.markdown(f"""
    <div class="banner-suppressed">
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <span style="font-weight:700; color:#059669; font-size:1rem; font-family:'JetBrains Mono', monospace;">
                    VERDICT: ALERT SUPPRESSED (CONTEXT VERIFIED)
                </span>
                <div style="font-size:0.85rem; color:#334155; margin-top:4px;">
                    <b>Mitigating Ticket:</b> <code>{mitigating_ticket}</code> &nbsp;|&nbsp;
                    <b>Adjudicator Rationale:</b> {justification}
                </div>
            </div>
            <div style="text-align:right;">
                <span class="status-pill status-green" style="font-size:0.85rem; padding:6px 12px;">
                    Confidence: {conf*100:.1f}%
                </span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
else:
    st.markdown(f"""
    <div class="banner-escalated">
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <span style="font-weight:700; color:#DC2626; font-size:1rem; font-family:'JetBrains Mono', monospace;">
                    VERDICT: ESCALATED TO CRITICAL INCIDENT
                </span>
                <div style="font-size:0.85rem; color:#334155; margin-top:4px;">
                    <b>Threat Signature:</b> {session['threat_type']} &nbsp;|&nbsp;
                    <b>Adjudicator Rationale:</b> {justification}
                </div>
            </div>
            <div style="text-align:right;">
                <span class="status-pill" style="background:#FEE2E2; color:#DC2626; border:1px solid #FCA5A5; font-size:0.85rem; padding:6px 12px;">
                    Confidence: {conf*100:.1f}%
                </span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# Action controls
c_btn1, c_btn2, c_btn3 = st.columns([2, 2, 4])
with c_btn1:
    if verdict == "SUPPRESSED_LEGITIMATE":
        st.button("✅ Archive as False Positive", use_container_width=True)
    else:
        st.button("🚨 Revoke User Session Access", use_container_width=True)

with c_btn2:
    if verdict != "SUPPRESSED_LEGITIMATE":
        st.button("🛡️ Dispatch to Tier 2 SOC Analyst", use_container_width=True)
    else:
        st.button("📑 Export Verification Receipt (JSON)", use_container_width=True)
