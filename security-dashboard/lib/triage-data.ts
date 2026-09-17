export interface FeatureMetrics {
  after_hours_ratio: number;
  usb_connect_count: number;
  removable_file_copies: number;
  resource_cardinality: number;
  recon_variance: number;
}

export interface MutationDimension {
  feature: string;
  name: string;
  contribution: number;
  current_val: number;
  baseline_val: number;
  ratio_change: number;
  unit: string;
}

export interface TelemetryPoint {
  day: number;
  date: string;
  individualDrift: number;
  cohortBaseline: number;
  threshold: number;
}

export interface ToolCall {
  tool: string;
  label: string;
  status: 'found' | 'none' | 'invalid';
  detail: string;
  output: Record<string, any>;
}

export interface LiveTelemetryLog {
  id: string;
  timestamp: string;
  stream: 'LOGON' | 'DEVICE' | 'FILE' | 'HTTP';
  user_id: string;
  details: string;
  severity: 'normal' | 'suspicious' | 'critical';
}

export interface CaseScenario {
  id: string;
  caseNumber: string;
  badgeLabel: string;
  title: string;
  user_id: string;
  name: string;
  role: string;
  department: string;
  date: string;
  storySummary: string;
  employment_status: string;
  resignation_status: string;
  assigned_projects: string[];
  
  // Statistical Drift
  mahalanobis_dist: number;
  mutation_velocity: number;
  chi2_pval: number;
  features: FeatureMetrics;
  feature_baselines: FeatureMetrics;
  mutation_signature: MutationDimension[];
  telemetry_timeline: TelemetryPoint[];

  // Peer Normalization
  dept_mean_drift: number;
  dept_peer_count: number;
  adjusted_risk_score: number;
  peer_context_verdict: string;
  peer_explanation: string;

  // Multi-Agent Debate
  prosecution_brief: string;
  defense_brief: string;
  tool_calls: ToolCall[];
  ruling: {
    verdict: 'ESCALATED_INSIDER_THREAT' | 'SUPPRESSED_LEGITIMATE';
    verdictTitle: string;
    confidence: number;
    justification: string;
    mitigating_evidence_id: string | null;
    action_required: string;
  };
  audit_json: Record<string, any>;
}

export const SCENARIOS: CaseScenario[] = [
  {
    id: "case-01",
    caseNumber: "CASE 01",
    badgeLabel: "Intellectual Property Exfiltration",
    title: "Malory Sterling (Firmware)",
    user_id: "USER_INSIDER_MALORY",
    name: "Malory Sterling",
    role: "Senior Embedded Firmware Engineer",
    department: "Firmware & Hardware Eng",
    date: "2024-03-20",
    storySummary: "Logged in at 02:15 AM, plugged in an external USB drive, and copied 35 proprietary firmware binaries with an active resignation notice on file and 0 tickets.",
    employment_status: "Pending Departure (Resigned)",
    resignation_status: "Resignation Active (Departs in 4 Days)",
    assigned_projects: ["Legacy Bootloader v4"],

    mahalanobis_dist: 14.82,
    mutation_velocity: 8.65,
    chi2_pval: 0.000004,
    features: {
      after_hours_ratio: 0.94,
      usb_connect_count: 4.0,
      removable_file_copies: 35.0,
      resource_cardinality: 14.0,
      recon_variance: 18.0
    },
    feature_baselines: {
      after_hours_ratio: 0.08,
      usb_connect_count: 0.1,
      removable_file_copies: 0.0,
      resource_cardinality: 4.2,
      recon_variance: 2.1
    },
    mutation_signature: [
      {
        feature: "removable_file_copies",
        name: "Removable File Transfers",
        contribution: 0.442,
        current_val: 35.0,
        baseline_val: 0.0,
        ratio_change: 350.0,
        unit: "binaries"
      },
      {
        feature: "usb_connect_count",
        name: "USB Peripheral Mounts",
        contribution: 0.285,
        current_val: 4.0,
        baseline_val: 0.1,
        ratio_change: 40.0,
        unit: "mounts"
      },
      {
        feature: "after_hours_ratio",
        name: "Off-Hours Activity",
        contribution: 0.187,
        current_val: 0.94,
        baseline_val: 0.08,
        ratio_change: 11.75,
        unit: "session %"
      }
    ],
    telemetry_timeline: [
      { day: 1, date: "Mar 01", individualDrift: 1.12, cohortBaseline: 1.05, threshold: 3.5 },
      { day: 5, date: "Mar 05", individualDrift: 1.25, cohortBaseline: 1.10, threshold: 3.5 },
      { day: 10, date: "Mar 10", individualDrift: 1.84, cohortBaseline: 1.15, threshold: 3.5 },
      { day: 14, date: "Mar 14", individualDrift: 2.10, cohortBaseline: 1.18, threshold: 3.5 },
      { day: 16, date: "Mar 16", individualDrift: 3.42, cohortBaseline: 1.22, threshold: 3.5 },
      { day: 18, date: "Mar 18", individualDrift: 6.17, cohortBaseline: 1.25, threshold: 3.5 },
      { day: 20, date: "Mar 20", individualDrift: 14.82, cohortBaseline: 1.31, threshold: 3.5 }
    ],

    dept_mean_drift: 1.31,
    dept_peer_count: 14,
    adjusted_risk_score: 18.52,
    peer_context_verdict: "Isolated Individual Anomaly",
    peer_explanation: "User drift (14.82) is severely isolated while team peers in Firmware remain normal (1.31 baseline). Risk multiplier amplified by 1.25x.",

    prosecution_brief: "At 02:15 AM outside normal business hours, Malory Sterling initiated an unapproved endpoint session on PC-MAL-01. Within 12 minutes, an external USB storage drive was mounted, followed by 35 proprietary firmware binaries copied directly to removable media. Combined with an active resignation notice on file and 0 maintenance tickets, this represents textbook departure-phase intellectual property theft.",
    defense_brief: "Context retrieval cross-checked enterprise HR records and IT change requests. Tool `get_hr_status` confirmed active resignation status with final departure date in 4 days. Tool `get_tickets` returned 0 approved change requests or emergency windows for data migration. Defense finds no operational justification for 35 external file transfers.",
    tool_calls: [
      {
        tool: "get_hr_status",
        label: "Workday HR Profile",
        status: "invalid",
        detail: "Status: Resignation Active (Departs 2024-03-24)",
        output: {
          employment_status: "PENDING_TERMINATION",
          resignation_date: "2024-03-10",
          effective_departure_date: "2024-03-24"
        }
      },
      {
        tool: "get_tickets",
        label: "ServiceNow Change Management",
        status: "none",
        detail: "0 Approved Tickets Found for 2024-03-20",
        output: {
          tickets_found: 0,
          active_emergency_window: false
        }
      }
    ],
    ruling: {
      verdict: "ESCALATED_INSIDER_THREAT",
      verdictTitle: "CONFIRMED INSIDER THREAT | ESCALATED TO SOC",
      confidence: 0.965,
      justification: "Mass proprietary binary extraction (35 files) to external USB storage during off-hours (02:15 AM) by an employee under active resignation with zero authorized change tickets. High-confidence malicious data exfiltration.",
      mitigating_evidence_id: null,
      action_required: "Revoke Domain Credentials • Isolate Workstation PC-MAL-01 • Escalate to CISO Triage"
    },
    audit_json: {
      incident_id: "INC-20240320-MAL-9921",
      timestamp: "2024-03-20T02:35:12Z",
      subject: "USER_INSIDER_MALORY",
      verdict: "ESCALATED_INSIDER_THREAT",
      confidence: 0.965,
      mitigating_ticket: null,
      indicators: {
        off_hours_login: "02:15 AM",
        usb_mounted: "E:\\ (Kingston DataTraveler)",
        files_extracted: 35,
        hr_status: "RESIGNED_TWO_WEEKS_NOTICE"
      },
      triage_latency_ms: 142
    }
  },
  {
    id: "case-02",
    caseNumber: "CASE 02",
    badgeLabel: "False Alarm Auto-Suppressed",
    title: "Alice Vance (Database)",
    user_id: "USER_BENIGN_ALICE",
    name: "Alice Vance",
    role: "Lead Data Infrastructure Engineer",
    department: "Data Platform",
    date: "2024-03-20",
    storySummary: "Logged in at 01:12 AM and transferred 25 database replica tables. Verified against emergency ticket CR-8821 approved by Director.",
    employment_status: "Active Employee",
    resignation_status: "None (Standard Full-Time)",
    assigned_projects: ["Project Horizon", "Warehouse DB Migration"],

    mahalanobis_dist: 11.45,
    mutation_velocity: 7.12,
    chi2_pval: 0.000018,
    features: {
      after_hours_ratio: 0.88,
      usb_connect_count: 0.0,
      removable_file_copies: 0.0,
      resource_cardinality: 28.0,
      recon_variance: 25.0
    },
    feature_baselines: {
      after_hours_ratio: 0.05,
      usb_connect_count: 0.0,
      removable_file_copies: 0.0,
      resource_cardinality: 6.5,
      recon_variance: 3.2
    },
    mutation_signature: [
      {
        feature: "recon_variance",
        name: "Database Shard Queries",
        contribution: 0.412,
        current_val: 25.0,
        baseline_val: 3.2,
        ratio_change: 7.81,
        unit: "tables"
      },
      {
        feature: "resource_cardinality",
        name: "Cloud Sync Endpoints",
        contribution: 0.354,
        current_val: 28.0,
        baseline_val: 6.5,
        ratio_change: 4.31,
        unit: "endpoints"
      },
      {
        feature: "after_hours_ratio",
        name: "Overnight Sync Window",
        contribution: 0.234,
        current_val: 0.88,
        baseline_val: 0.05,
        ratio_change: 17.6,
        unit: "session %"
      }
    ],
    telemetry_timeline: [
      { day: 1, date: "Mar 01", individualDrift: 0.98, cohortBaseline: 1.02, threshold: 3.5 },
      { day: 5, date: "Mar 05", individualDrift: 1.05, cohortBaseline: 1.04, threshold: 3.5 },
      { day: 10, date: "Mar 10", individualDrift: 1.15, cohortBaseline: 1.12, threshold: 3.5 },
      { day: 14, date: "Mar 14", individualDrift: 1.20, cohortBaseline: 1.15, threshold: 3.5 },
      { day: 18, date: "Mar 18", individualDrift: 2.10, cohortBaseline: 1.45, threshold: 3.5 },
      { day: 19, date: "Mar 19", individualDrift: 4.80, cohortBaseline: 3.65, threshold: 3.5 },
      { day: 20, date: "Mar 20", individualDrift: 11.45, cohortBaseline: 5.20, threshold: 3.5 }
    ],

    dept_mean_drift: 5.20,
    dept_peer_count: 18,
    adjusted_risk_score: 6.74,
    peer_context_verdict: "Team-Wide Coordinated Migration",
    peer_explanation: "Entire Data Platform team exhibited elevated baseline (5.20) due to scheduled cloud migration. Risk score dampened by 0.58x factor.",

    prosecution_brief: "Overnight security sensors flagged high-volume off-hours transfers between 01:12 AM and 05:45 AM. The session synced 25 database replica tables to cloud endpoints, creating an 11.45 statistical drift that would trigger standard SIEM alarms.",
    defense_brief: "Context retriever discovered active Emergency Change Request CR-8821 ('Authorized emergency database migration and large-scale off-hours mirror sync') valid 00:00 to 06:00, authorized by SecOps Director. Alice Vance is the lead engineer on Warehouse DB Migration. The activity is 100% legitimate maintenance.",
    tool_calls: [
      {
        tool: "get_tickets",
        label: "ServiceNow Change Request",
        status: "found",
        detail: "Ticket CR-8821: APPROVED by SecOps Director",
        output: {
          ticket_id: "CR-8821",
          request_type: "EMERGENCY_CHANGE_REQUEST",
          valid_window: "2024-03-20 00:00 - 06:00",
          status: "APPROVED"
        }
      },
      {
        tool: "get_hr_status",
        label: "Workday HR Profile",
        status: "found",
        detail: "Role: Lead Data Infrastructure Engineer (Project Horizon)",
        output: {
          employment_status: "ACTIVE",
          assigned_projects: ["Warehouse DB Migration"]
        }
      }
    ],
    ruling: {
      verdict: "SUPPRESSED_LEGITIMATE",
      verdictTitle: "LEGITIMATE MAINTENANCE | AUTO-SUPPRESSED",
      confidence: 0.982,
      justification: "Behavioral spike was caused by authorized database migration matching Emergency Ticket CR-8821 approved by SecOps Director. Cohort baseline confirms team-wide execution. SIEM alert successfully neutralized.",
      mitigating_evidence_id: "CR-8821",
      action_required: "Auto-Close Alert • Log Authorization to Audit Trail • Zero SOC Analyst Interruption"
    },
    audit_json: {
      incident_id: "INC-20240320-ALC-4102",
      timestamp: "2024-03-20T05:50:00Z",
      subject: "USER_BENIGN_ALICE",
      verdict: "SUPPRESSED_LEGITIMATE",
      confidence: 0.982,
      mitigating_ticket: "CR-8821",
      indicators: {
        off_hours_login: "01:12 AM",
        db_replicas_synced: 25,
        approved_by: "secops_director@corp.local",
        change_window_active: true
      },
      triage_latency_ms: 118
    }
  },
  {
    id: "case-03",
    caseNumber: "CASE 03",
    badgeLabel: "Privilege Misuse & Forgery",
    title: "Bob Henderson (SysAdmin)",
    user_id: "USER_INSIDER_BOB",
    name: "Bob Henderson",
    role: "Systems Administrator",
    department: "IT Operations",
    date: "2024-03-20",
    storySummary: "Harvested Active Directory password hashes (20 NTDS hives) using an expired ticket (CR-4040) with forged self-approval.",
    employment_status: "Active Employee",
    resignation_status: "None",
    assigned_projects: ["Quarterly Patching", "Active Directory Cleanup"],

    mahalanobis_dist: 16.35,
    mutation_velocity: 11.20,
    chi2_pval: 0.000001,
    features: {
      after_hours_ratio: 0.96,
      usb_connect_count: 2.0,
      removable_file_copies: 20.0,
      resource_cardinality: 8.0,
      recon_variance: 22.0
    },
    feature_baselines: {
      after_hours_ratio: 0.12,
      usb_connect_count: 0.2,
      removable_file_copies: 0.0,
      resource_cardinality: 4.1,
      recon_variance: 3.0
    },
    mutation_signature: [
      {
        feature: "removable_file_copies",
        name: "AD Password Hash Hives",
        contribution: 0.485,
        current_val: 20.0,
        baseline_val: 0.0,
        ratio_change: 200.0,
        unit: "NTDS hives"
      },
      {
        feature: "recon_variance",
        name: "Domain Controller Probing",
        contribution: 0.295,
        current_val: 22.0,
        baseline_val: 3.0,
        ratio_change: 7.33,
        unit: "partitions"
      },
      {
        feature: "after_hours_ratio",
        name: "Off-Shift Execution",
        contribution: 0.220,
        current_val: 0.96,
        baseline_val: 0.12,
        ratio_change: 8.0,
        unit: "session %"
      }
    ],
    telemetry_timeline: [
      { day: 1, date: "Mar 01", individualDrift: 1.05, cohortBaseline: 1.08, threshold: 3.5 },
      { day: 5, date: "Mar 05", individualDrift: 1.15, cohortBaseline: 1.10, threshold: 3.5 },
      { day: 10, date: "Mar 10", individualDrift: 1.30, cohortBaseline: 1.14, threshold: 3.5 },
      { day: 14, date: "Mar 14", individualDrift: 1.45, cohortBaseline: 1.16, threshold: 3.5 },
      { day: 17, date: "Mar 17", individualDrift: 2.80, cohortBaseline: 1.20, threshold: 3.5 },
      { day: 19, date: "Mar 19", individualDrift: 5.10, cohortBaseline: 1.25, threshold: 3.5 },
      { day: 20, date: "Mar 20", individualDrift: 16.35, cohortBaseline: 1.28, threshold: 3.5 }
    ],

    dept_mean_drift: 1.28,
    dept_peer_count: 12,
    adjusted_risk_score: 20.44,
    peer_context_verdict: "Isolated Admin Breach",
    peer_explanation: "User drift (16.35) is isolated to administrative workstation PC-BOB-01. Other IT peers exhibit standard baseline activity.",

    prosecution_brief: "At 01:45 AM, Bob Henderson logged into workstation PC-BOB-01 and extracted 20 Active Directory password hash hives (NTDS.dit) to an external volume. Dumping domain credentials outside maintenance hours without supervision poses critical credential theft risk.",
    defense_brief: "Defense verified ticket CR-4040 cited in operational logs. Cryptographic audit uncovered that CR-4040 expired 15 days ago (scheduled for March 5). Additionally, the approval signature was self-signed ('self_signed_admin') with no manager approval. Ticket is fraudulent.",
    tool_calls: [
      {
        tool: "get_tickets",
        label: "Ticket Validity Audit",
        status: "invalid",
        detail: "Ticket CR-4040: EXPIRED 15 Days Ago (Forged Self-Approval)",
        output: {
          ticket_id: "CR-4040",
          validity_flag: false,
          discrepancy: "15 Days Expired & Forged Self-Approval"
        }
      },
      {
        tool: "get_hr_status",
        label: "Workday HR Profile",
        status: "found",
        detail: "Role: Systems Administrator (IT Operations)",
        output: {
          employment_status: "ACTIVE",
          department: "IT Operations"
        }
      }
    ],
    ruling: {
      verdict: "ESCALATED_INSIDER_THREAT",
      verdictTitle: "CRITICAL CREDENTIAL HARVESTING | IMMEDIATE ISOLATION",
      confidence: 0.978,
      justification: "Extraction of 20 Active Directory password hash hives during off-hours using an expired ticket with forged self-approval. Severe administrative privilege abuse confirmed.",
      mitigating_evidence_id: null,
      action_required: "Lock Domain Admin Accounts • Invalidate Kerberos TGT Keys • Isolate PC-BOB-01"
    },
    audit_json: {
      incident_id: "INC-20240320-BOB-7719",
      timestamp: "2024-03-20T01:52:44Z",
      subject: "USER_INSIDER_BOB",
      verdict: "ESCALATED_INSIDER_THREAT",
      confidence: 0.978,
      mitigating_ticket: null,
      indicators: {
        ad_hashes_dumped: 20,
        ticket_forgery: "CR-4040 (Expired & Self-Signed)",
        domain_impact: "HIGH_RISK_CREDENTIAL_COMPROMISE"
      },
      triage_latency_ms: 135
    }
  }
];

export const LIVE_STREAM_LOGS: LiveTelemetryLog[] = [
  {
    id: "LOG-4910",
    timestamp: "19:18:42",
    stream: "LOGON",
    user_id: "USER_BENIGN_ALICE",
    details: "Authenticating to db-prod-replica-01 via SSO (Port 5432)",
    severity: "normal"
  },
  {
    id: "LOG-4911",
    timestamp: "19:18:43",
    stream: "FILE",
    user_id: "USER_BENIGN_ALICE",
    details: "Read operation on table_analytics_shard_04.sql (Mirror Sync CR-8821)",
    severity: "normal"
  },
  {
    id: "LOG-4912",
    timestamp: "19:18:45",
    stream: "DEVICE",
    user_id: "USER_INSIDER_MALORY",
    details: "Hardware USB mount: Kingston DataTraveler 64GB mounted at E:\\",
    severity: "critical"
  },
  {
    id: "LOG-4913",
    timestamp: "19:18:46",
    stream: "FILE",
    user_id: "USER_INSIDER_MALORY",
    details: "Bulk copy: 35 .bin objects targeting E:\\firmware_dump_v4\\",
    severity: "critical"
  },
  {
    id: "LOG-4914",
    timestamp: "19:18:47",
    stream: "HTTP",
    user_id: "USER_PEER_CHARLIE",
    details: "GET /api/v2/metrics to internal ETL gateway (10.0.4.12)",
    severity: "normal"
  },
  {
    id: "LOG-4915",
    timestamp: "19:18:49",
    stream: "LOGON",
    user_id: "USER_INSIDER_BOB",
    details: "Administrative elevation on Domain Controller DC-01 (NTDS access)",
    severity: "suspicious"
  },
  {
    id: "LOG-4916",
    timestamp: "19:18:51",
    stream: "FILE",
    user_id: "USER_INSIDER_BOB",
    details: "Dumping NTDS.dit password hash hive to D:\\temp_backup\\",
    severity: "critical"
  },
  {
    id: "LOG-4917",
    timestamp: "19:18:52",
    stream: "DEVICE",
    user_id: "USER_PEER_DIANA",
    details: "Authorized USB test jig unmounted cleanly on PC-DIA-02",
    severity: "normal"
  }
];

export const SYSTEM_STATS = {
  active_events_per_sec: "2,480",
  total_analyzed_today: "148,920",
  false_positives_neutralized: "95.2%",
  active_threats_isolated: "2",
  autonomous_triage_latency: "142 ms"
};
