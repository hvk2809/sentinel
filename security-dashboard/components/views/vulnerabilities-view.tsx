"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lock, ShieldCheck, AlertTriangle, Cpu, Terminal } from "lucide-react";

export function VulnerabilitiesView() {
  const vulnerabilities = [
    {
      cve: "CVE-2024-38077",
      title: "Windows Remote Desktop Licensing Service RCE",
      target: "dc-prod-auth-01 (Active Directory)",
      severity: "critical",
      score: "9.8",
      status: "Patch Scheduled (CR-9102)",
      insiderRisk: "High (Domain Admin Access)"
    },
    {
      cve: "CVE-2024-21410",
      title: "Microsoft Exchange Server Elevation of Privilege",
      target: "mail-gateway-02",
      severity: "high",
      score: "8.8",
      status: "Mitigated via NTLM Block",
      insiderRisk: "Medium"
    },
    {
      cve: "CVE-2023-48795",
      title: "Terrapin Attack: SSH Protocol Prefix Truncation",
      target: "bastion-ssh-cluster",
      severity: "medium",
      score: "5.9",
      status: "Ciphers Restricted",
      insiderRisk: "Low"
    },
    {
      cve: "POL-2024-USB-01",
      title: "Mass Storage Peripheral Auto-Mount Policy Bypass",
      target: "PC-MAL-01 (Firmware Workstation)",
      severity: "critical",
      score: "9.2",
      status: "Violated (35 Binaries Written)",
      insiderRisk: "Active Threat (Malory Sterling)"
    }
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent" />
            Vulnerability Management & Host Exposure
          </h2>
          <p className="text-xs text-textSecondary mt-0.5">
            Endpoint CVE posture and enterprise policy compliance across fleet workstations
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge className="bg-rose-500/15 text-rose-600 dark:bg-red-500/20 dark:text-red-400 border-none">2 Critical CVEs</Badge>
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:bg-green-500/20 dark:text-green-400 border-none">94% Fleet Patched</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-cardBg border-border p-4 shadow-sm">
          <span className="text-xs font-mono text-textSecondary uppercase">Total Known CVEs</span>
          <div className="text-2xl font-bold font-mono text-foreground mt-1">86</div>
          <span className="text-xs text-emerald-600 dark:text-green-400 font-mono mt-1 block">82 Mitigated</span>
        </Card>
        <Card className="bg-cardBg border-border p-4 shadow-sm">
          <span className="text-xs font-mono text-textSecondary uppercase">Policy Exceptions</span>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">1 Critical</div>
          <span className="text-xs text-rose-600 dark:text-rose-400 font-mono mt-1 block">Unapproved USB Mount</span>
        </Card>
        <Card className="bg-cardBg border-border p-4 shadow-sm">
          <span className="text-xs font-mono text-textSecondary uppercase">Mean Time to Remediate</span>
          <div className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-1">4.2 Hours</div>
          <span className="text-xs text-textSecondary font-mono mt-1 block">Sub-10s SIEM Triage</span>
        </Card>
      </div>

      <Card className="bg-cardBg border-border shadow-sm">
        <CardHeader className="p-4 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">
            Active Endpoint Vulnerabilities & Policy Violations
          </CardTitle>
          <CardDescription className="text-xs text-textSecondary">
            Cross-referenced with CMU-CERT session anomalies and user privilege levels
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-inputBg">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs font-mono text-textSecondary">Vulnerability / CVE</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Description</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Target Asset</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">CVSS</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Insider Correlation</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vulnerabilities.map((v) => (
                  <TableRow key={v.cve} className="border-border hover:bg-cardHoverBg text-xs font-mono">
                    <TableCell className="font-semibold text-accent">{v.cve}</TableCell>
                    <TableCell className="text-foreground">{v.title}</TableCell>
                    <TableCell className="text-textSecondary">{v.target}</TableCell>
                    <TableCell className={Number(v.score) > 9 ? "text-rose-600 dark:text-rose-400 font-bold" : "text-amber-600 dark:text-amber-400"}>
                      {v.score}
                    </TableCell>
                    <TableCell className={v.insiderRisk.includes("Active") ? "text-rose-600 dark:text-rose-400 font-bold" : "text-textSecondary"}>
                      {v.insiderRisk}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border bg-inputBg text-[11px] text-[#4A453E] dark:text-slate-300">
                        {v.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
