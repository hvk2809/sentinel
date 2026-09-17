"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, AlertTriangle, HardDrive, Key, UserX, Activity, ArrowUpRight } from "lucide-react";
import { SCENARIOS } from "@/lib/triage-data";

export function ThreatsView() {
  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-500" />
            Threat Intelligence & Anomaly Vectors
          </h2>
          <p className="text-xs text-textSecondary mt-0.5">
            Active multivariate behavioral mutations flagged by Sentinel's Layer 1 & 2 engines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-rose-500/20 text-rose-400 border-none font-mono text-xs">
            2 Critical Insider Threats Active
          </Badge>
        </div>
      </div>

      {/* Active Threat Spotlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Threat 1 */}
        <Card className="bg-cardBg border-rose-500/40 p-5 relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 font-mono font-bold text-sm">
                MS
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Malory Sterling</h3>
                <p className="text-xs font-mono text-textSecondary">USER_INSIDER_MALORY • Firmware & Hardware Eng</p>
              </div>
            </div>
            <Badge className="bg-rose-500 text-white font-mono text-[10px] uppercase">
              Confirmed Exfiltration
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-inputBg p-3 rounded border border-border">
              <span className="font-semibold text-rose-400 block mb-1">Observed Attack Vector:</span>
              <p className="text-slate-300 leading-relaxed">
                Off-hours login at 02:15 AM on PC-MAL-01. External USB storage mounted (Kingston 64GB) with 35 firmware source binaries copied. Resignation active (4 days to departure).
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1">
              <div className="bg-inputBg p-2 rounded border border-border">
                <span className="text-textSecondary block text-[10px]">MAHALANOBIS</span>
                <span className="text-white font-bold">14.82 D_M</span>
              </div>
              <div className="bg-inputBg p-2 rounded border border-border">
                <span className="text-textSecondary block text-[10px]">VELOCITY</span>
                <span className="text-amber-400 font-bold">+8.65</span>
              </div>
              <div className="bg-inputBg p-2 rounded border border-border">
                <span className="text-textSecondary block text-[10px]">PEER ISOLATION</span>
                <span className="text-rose-400 font-bold">1.25x Multiplier</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Threat 2 */}
        <Card className="bg-cardBg border-rose-500/40 p-5 relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 font-mono font-bold text-sm">
                BH
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Bob Henderson</h3>
                <p className="text-xs font-mono text-textSecondary">USER_INSIDER_BOB • IT Operations</p>
              </div>
            </div>
            <Badge className="bg-rose-500 text-white font-mono text-[10px] uppercase">
              Credential Harvest
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-inputBg p-3 rounded border border-border">
              <span className="font-semibold text-rose-400 block mb-1">Observed Attack Vector:</span>
              <p className="text-slate-300 leading-relaxed">
                Administrative session on DC-01 at 01:45 AM. Harvested 20 Active Directory password hash hives (NTDS.dit) using an expired ticket (CR-4040) with forged self-approval.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1">
              <div className="bg-inputBg p-2 rounded border border-border">
                <span className="text-textSecondary block text-[10px]">MAHALANOBIS</span>
                <span className="text-white font-bold">16.35 D_M</span>
              </div>
              <div className="bg-inputBg p-2 rounded border border-border">
                <span className="text-textSecondary block text-[10px]">VELOCITY</span>
                <span className="text-amber-400 font-bold">+11.20</span>
              </div>
              <div className="bg-inputBg p-2 rounded border border-border">
                <span className="text-textSecondary block text-[10px]">FRAUD DETECTED</span>
                <span className="text-rose-400 font-bold">CR-4040 (+15d)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Threat Signatures Matrix */}
      <Card className="bg-cardBg border-border">
        <CardHeader className="p-4 pb-3">
          <CardTitle className="text-sm font-bold text-white">
            Behavioral Mutation Signatures (CMU-CERT r4.2 Stream)
          </CardTitle>
          <CardDescription className="text-xs text-textSecondary">
            Top feature contributors responsible for statistical anomaly triggers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-inputBg">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs font-mono text-textSecondary">Feature Vector</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Observed Peak</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Fleet Baseline</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Deviation Multiplier</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Risk Classification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border hover:bg-cardHoverBg text-xs font-mono">
                  <TableCell className="font-semibold text-white">removable_file_copies</TableCell>
                  <TableCell className="text-rose-400 font-bold">35 files</TableCell>
                  <TableCell className="text-textSecondary">0.0 ops</TableCell>
                  <TableCell className="text-rose-400 font-bold">+350x</TableCell>
                  <TableCell><Badge className="bg-rose-500/20 text-rose-400 border-none">CRITICAL_EXFILTRATION</Badge></TableCell>
                </TableRow>
                <TableRow className="border-border hover:bg-cardHoverBg text-xs font-mono">
                  <TableCell className="font-semibold text-white">usb_connect_count</TableCell>
                  <TableCell className="text-rose-400 font-bold">4 connects</TableCell>
                  <TableCell className="text-textSecondary">0.1 events</TableCell>
                  <TableCell className="text-rose-400 font-bold">+40x</TableCell>
                  <TableCell><Badge className="bg-rose-500/20 text-rose-400 border-none">UNAUTHORIZED_PERIPHERAL</Badge></TableCell>
                </TableRow>
                <TableRow className="border-border hover:bg-cardHoverBg text-xs font-mono">
                  <TableCell className="font-semibold text-white">after_hours_ratio</TableCell>
                  <TableCell className="text-amber-400 font-bold">96% session</TableCell>
                  <TableCell className="text-textSecondary">8% baseline</TableCell>
                  <TableCell className="text-amber-400 font-bold">+12x</TableCell>
                  <TableCell><Badge className="bg-amber-500/20 text-amber-400 border-none">OFF_HOURS_EXECUTION</Badge></TableCell>
                </TableRow>
                <TableRow className="border-border hover:bg-cardHoverBg text-xs font-mono">
                  <TableCell className="font-semibold text-white">recon_variance</TableCell>
                  <TableCell className="text-white font-bold">25 dirs</TableCell>
                  <TableCell className="text-textSecondary">3.2 dirs</TableCell>
                  <TableCell className="text-slate-300">+7.8x</TableCell>
                  <TableCell><Badge className="bg-blue-500/20 text-blue-400 border-none">DIRECTORY_PROBING</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
