"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserX, UserCheck, Shield, Activity, HardDrive } from "lucide-react";

export function UsersView() {
  const usersList = [
    {
      user_id: "USER_INSIDER_MALORY",
      name: "Malory Sterling",
      department: "Firmware & Hardware Eng",
      role: "Senior Embedded Firmware Engineer",
      hr_status: "RESIGNED_TWO_WEEKS_NOTICE",
      drift: "14.82 D_M",
      peer_norm: "1.25x Amplified",
      ruling: "ESCALATED_INSIDER_THREAT",
      action: "Revoke Credentials"
    },
    {
      user_id: "USER_INSIDER_BOB",
      name: "Bob Henderson",
      department: "IT Operations",
      role: "Systems Administrator",
      hr_status: "ACTIVE",
      drift: "16.35 D_M",
      peer_norm: "1.25x Amplified",
      ruling: "ESCALATED_INSIDER_THREAT",
      action: "Lock Domain Admin"
    },
    {
      user_id: "USER_BENIGN_ALICE",
      name: "Alice Vance",
      department: "Data Platform",
      role: "Lead Data Infrastructure Engineer",
      hr_status: "ACTIVE",
      drift: "11.45 D_M",
      peer_norm: "0.58x Dampened",
      ruling: "SUPPRESSED_LEGITIMATE",
      action: "Verified (CR-8821)"
    },
    {
      user_id: "USER_PEER_CHARLIE",
      name: "Charlie Ray",
      department: "Data Platform",
      role: "Data Engineer",
      hr_status: "ACTIVE",
      drift: "4.85 D_M",
      peer_norm: "0.62x Dampened",
      ruling: "SUPPRESSED_LEGITIMATE",
      action: "Verified (SR-1092)"
    },
    {
      user_id: "USER_PEER_DIANA",
      name: "Diana Ross",
      department: "Firmware & Hardware Eng",
      role: "Firmware QA Engineer",
      hr_status: "ACTIVE",
      drift: "1.28 D_M",
      peer_norm: "1.00x Baseline",
      ruling: "SUPPRESSED_LEGITIMATE",
      action: "Normal Baseline"
    },
    {
      user_id: "USER_PEER_EDWARD",
      name: "Edward Norton",
      department: "IT Operations",
      role: "IT Support Specialist",
      hr_status: "ACTIVE",
      drift: "1.15 D_M",
      peer_norm: "1.00x Baseline",
      ruling: "SUPPRESSED_LEGITIMATE",
      action: "Normal Baseline"
    }
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            User Entity Directory & Peer Cohort Risk Index
          </h2>
          <p className="text-xs text-textSecondary mt-0.5">
            Real-time baseline profiles, Workday HR records, and peer normalization multipliers
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge className="bg-inputBg border border-border text-foreground">6 Ingested Cohort Profiles</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-cardBg border-border p-4 shadow-sm">
          <span className="text-xs font-mono text-textSecondary uppercase">Active Departure Notices</span>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">1 Employee</div>
          <span className="text-xs text-rose-600 dark:text-rose-400 font-mono mt-1 block">Malory Sterling (Resigned)</span>
        </Card>
        <Card className="bg-cardBg border-border p-4 shadow-sm">
          <span className="text-xs font-mono text-textSecondary uppercase">High-Privilege Admins</span>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">2 Accounts</div>
          <span className="text-xs text-textSecondary font-mono mt-1 block">IT Operations & DBA Root</span>
        </Card>
        <Card className="bg-cardBg border-border p-4 shadow-sm">
          <span className="text-xs font-mono text-textSecondary uppercase">Fleet Auto-Suppression</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">4 of 6 Safe</div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">95% False-Positive Reduction</span>
        </Card>
      </div>

      <Card className="bg-cardBg border-border shadow-sm">
        <CardHeader className="p-4 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">
            Monitored Enterprise Personnel & Behavioral Baselines
          </CardTitle>
          <CardDescription className="text-xs text-textSecondary">
            Cross-referenced with Workday HR profiles and ServiceNow change tickets
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-inputBg">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs font-mono text-textSecondary">User ID & Name</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Department & Role</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">HR Employment Status</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Drift (D_M)</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Peer Factor</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">EMAD Ruling</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersList.map((u) => {
                  const isThreat = u.ruling === "ESCALATED_INSIDER_THREAT";
                  return (
                    <TableRow key={u.user_id} className="border-border hover:bg-cardHoverBg text-xs font-mono">
                      <TableCell>
                        <div className="font-semibold text-foreground">{u.name}</div>
                        <div className="text-[11px] text-textSecondary">{u.user_id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-foreground">{u.role}</div>
                        <div className="text-[11px] text-textSecondary">{u.department}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] border-none font-mono",
                            u.hr_status.includes("RESIGNED") ? "bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400" : "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                          )}
                        >
                          {u.hr_status}
                        </Badge>
                      </TableCell>
                      <TableCell className={isThreat ? "text-rose-600 dark:text-rose-400 font-bold" : "text-foreground font-semibold"}>
                        {u.drift}
                      </TableCell>
                      <TableCell className="text-textSecondary">{u.peer_norm}</TableCell>
                      <TableCell>
                        <Badge
                          className={isThreat ? "bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-none" : "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-none"}
                        >
                          {isThreat ? "ESCALATED THREAT" : "SUPPRESSED"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
