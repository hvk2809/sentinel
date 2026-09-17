"use client";

import React, { useState } from "react";
import { StatsCard } from "./widgets/stats-card";
import { LineChartWidget } from "./widgets/line-chart-widget";
import { BarChartWidget } from "./widgets/bar-chart-widget";
import { StackedBarChartWidget } from "./widgets/stacked-bar-chart-widget";
import { PieChartWidget } from "./widgets/pie-chart-widget";
import { MultiLineChartWidget } from "./widgets/multi-line-chart-widget";
import { DoughnutChartWidget } from "./widgets/doughnut-chart-widget";
import { GaugeChartWidget } from "./widgets/gauge-chart-widget";
import { RecentActivityWidget } from "./widgets/recent-activity-widget";
import { SecurityEventsTable } from "./widgets/security-events-table";
import { CaseScenario, SCENARIOS } from "@/lib/triage-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Activity,
  AlertTriangle,
  Scale,
  Terminal,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardWidgets() {
  const [selectedCase, setSelectedCase] = useState<CaseScenario>(SCENARIOS[0]);
  const [showCaseChamber, setShowCaseChamber] = useState(true);
  const [showAuditJson, setShowAuditJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const isThreat = selectedCase.ruling.verdict === "ESCALATED_INSIDER_THREAT";

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedCase.audit_json, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* 1-Click Forensic Scenario Switcher for Judges & Security Personnel */}
      <Card className="bg-[#0C0C0C] hover:bg-[#121212] transition-colors border-[#1C1C1E]">
        <CardHeader className="p-4 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#1C1C1E]/60">
          <div className="flex items-center gap-2.5">
            <Shield className="h-4 w-4 text-white" />
            <CardTitle className="text-sm font-bold text-white">
              Active Scenarios
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCaseChamber(!showCaseChamber)}
              className="h-7 text-xs border-[#2C2C2E] bg-[#050505] hover:bg-[#1C1C1E] text-[#8E8E93] hover:text-white"
            >
              {showCaseChamber ? "Collapse Chamber" : "Expand Chamber"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SCENARIOS.map((sc) => {
              const isSelected = selectedCase.id === sc.id;
              const scThreat = sc.ruling.verdict === "ESCALATED_INSIDER_THREAT";

              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    setSelectedCase(sc);
                    setShowCaseChamber(true);
                  }}
                  className={cn(
                    "text-left p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between",
                    isSelected
                      ? "border-white/80 bg-[#161618] ring-1 ring-white/40 shadow-md"
                      : "border-[#1C1C1E] bg-[#080808] hover:bg-[#121212] hover:border-[#2C2C2E]"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white font-mono">{sc.caseNumber}</span>
                        <span className="text-xs font-semibold text-white truncate max-w-[130px]">{sc.name}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 py-0 border-none font-mono font-semibold",
                          scThreat ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
                        )}
                      >
                        {scThreat ? "Escalated" : "Suppressed"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#8E8E93] line-clamp-2 leading-relaxed">
                      {sc.storySummary}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#1C1C1E] flex items-center justify-between text-[11px] font-mono text-[#8E8E93]">
                    <span>Drift: <strong className="text-white">{sc.mahalanobis_dist} D_M</strong></span>
                    <span className={isSelected ? "text-white font-bold" : "text-[#8E8E93]"}>
                      {isSelected ? "Active Incident" : "Inspect →"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expanded Multi-Agent Chamber & Verdict for Selected Case */}
          {showCaseChamber && (
            <div className="mt-4 pt-4 border-t border-[#1C1C1E] space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Prosecution Brief */}
                <div className="bg-[#050505] p-4 rounded-lg border border-[#1C1C1E]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-rose-400 font-mono flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      PROSECUTION AUDIT BRIEF | THE AUDITOR
                    </span>
                    <Badge variant="outline" className="text-[10px] border-rose-500/30 text-rose-400 font-mono">
                      Layer 1 Vector Jump
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedCase.prosecution_brief}
                  </p>
                </div>

                {/* Defense Brief */}
                <div className="bg-[#050505] p-4 rounded-lg border border-[#1C1C1E]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                      DEFENSE CONTEXT BRIEF | THE CONTEXT RETRIEVER
                    </span>
                    <Badge variant="outline" className="text-[10px] border-white/20 text-slate-300 font-mono">
                      HR & Ticket Validation
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                    {selectedCase.defense_brief}
                  </p>
                  <div className="space-y-1.5">
                    {selectedCase.tool_calls.map((tc, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] font-mono text-[#8E8E93] bg-[#0C0C0C] p-2 rounded border border-[#1C1C1E]">
                        <span className="text-white font-medium">{tc.label}:</span>
                        <span className={tc.status === "found" ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                          {tc.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verdict Banner */}
              <div
                className={cn(
                  "p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
                  isThreat
                    ? "border-rose-500/50 bg-rose-950/20"
                    : "border-emerald-500/50 bg-emerald-950/20"
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-xs px-2.5 py-0.5 font-mono uppercase font-bold border-none",
                        isThreat ? "bg-rose-500 text-white" : "bg-emerald-600 text-white"
                      )}
                    >
                      {selectedCase.ruling.verdictTitle.replace("//", "|")}
                    </Badge>
                    <span className="text-xs font-mono text-[#8E8E93]">
                      Confidence: <strong className="text-white">{(selectedCase.ruling.confidence * 100).toFixed(1)}%</strong>
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedCase.ruling.justification}
                  </p>
                  <div className="text-[11px] font-mono text-[#8E8E93] pt-0.5">
                    <span className="text-white font-semibold">Directive: </span>
                    <span className={isThreat ? "text-rose-400 font-semibold" : "text-emerald-400 font-semibold"}>
                      {selectedCase.ruling.action_required.replace("//", "|")}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAuditJson(!showAuditJson)}
                    className="h-8 text-xs font-mono border-[#2C2C2E] bg-[#050505] hover:bg-[#1C1C1E] text-[#8E8E93] hover:text-white gap-1"
                  >
                    <Terminal className="h-3.5 w-3.5 text-white" />
                    <span>{showAuditJson ? "Hide JSON" : "SIEM Audit JSON"}</span>
                    {showAuditJson ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>

              {/* SIEM Audit JSON Log */}
              {showAuditJson && (
                <div className="p-3.5 bg-[#050505] rounded-lg border border-[#1C1C1E]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[#8E8E93] font-semibold">
                      SIEM_AUDIT_TRAIL | RFC-5424_COMPLIANT
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyJson}
                      className="h-6 text-xs font-mono text-[#8E8E93] hover:text-white gap-1"
                    >
                      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copied ? "Copied" : "Copy Payload"}</span>
                    </Button>
                  </div>
                  <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-[160px] leading-relaxed">
                    {JSON.stringify(selectedCase.audit_json, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Row 1: 4 Top Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Alerts"
          value="1,284"
          change="+12.5%"
          trend="up"
          description="Last 30 days"
          icon="alert"
        />
        <StatsCard
          title="Critical Threats"
          value="24"
          change="-8.3%"
          trend="down"
          description="Last 30 days"
          icon="critical"
        />
        <StatsCard
          title="Protected Devices"
          value="342"
          change="+5.2%"
          trend="up"
          description="Last 30 days"
          icon="device"
        />
        <StatsCard
          title="Vulnerabilities"
          value="86"
          change="+3.7%"
          trend="up"
          description="Last 30 days"
          icon="vulnerability"
        />
      </div>

      {/* Row 2: Threat Trends & Daily Attack Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LineChartWidget />
        <BarChartWidget />
      </div>

      {/* Row 3: Stacked Bar, Pie, Doughnut, Multi-Line, Gauge & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StackedBarChartWidget />
        <PieChartWidget />
        <DoughnutChartWidget />
        <MultiLineChartWidget />
        <GaugeChartWidget />
        <RecentActivityWidget />
      </div>

      {/* Row 4: Security Events Table */}
      <div className="w-full">
        <SecurityEventsTable />
      </div>
    </div>
  );
}
