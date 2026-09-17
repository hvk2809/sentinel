"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, ShieldCheck, Key, UserCheck, HardDrive } from "lucide-react";

export function NotificationsView() {
  const alerts = [
    {
      id: "NOTIF-01",
      title: "Critical Threat Escalation: Malory Sterling",
      detail: "Mass storage write of 35 firmware binaries detected outside business hours (02:15 AM). 0 tickets on file. Resignation active.",
      time: "2 mins ago",
      type: "critical"
    },
    {
      id: "NOTIF-02",
      title: "Credential Extraction Alert: Bob Henderson",
      detail: "Extraction of 20 Active Directory password hash hives on DC-01. Ticket CR-4040 is 15 days expired with self-approval signature.",
      time: "14 mins ago",
      type: "critical"
    },
    {
      id: "NOTIF-03",
      title: "False-Alarm Auto-Suppressed: Alice Vance",
      detail: "Database mirror sync to cloud storage validated against Emergency Change Request CR-8821 approved by SecOps Director.",
      time: "1 hour ago",
      type: "suppressed"
    },
    {
      id: "NOTIF-04",
      title: "Batch Ingestion Finished: CMU-CERT r4.2",
      detail: "Processed 1,840 session vectors across logon, device, file, and http streams in 184ms with 0 errors.",
      time: "3 hours ago",
      type: "info"
    }
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-foreground" />
            Live Security Notifications & Incident Alerts
          </h2>
          <p className="text-xs text-textSecondary mt-0.5">
            Real-time feed of autonomous triage rulings and SIEM alert dispatches
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((a) => (
          <Card key={a.id} className="bg-cardBg border-border p-4 hover:bg-cardHoverBg transition-colors shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-inputBg border border-border text-foreground shrink-0 mt-0.5">
                  {a.type === "critical" ? (
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                  ) : a.type === "suppressed" ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Bell className="h-4 w-4 text-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{a.title}</h3>
                  <p className="text-xs text-[#3D3833] dark:text-slate-300 mt-1 leading-relaxed">{a.detail}</p>
                  <span className="text-[11px] text-textSecondary font-mono mt-1.5 block">{a.time}</span>
                </div>
              </div>
              <Badge
                className={a.type === "critical" ? "bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-none font-mono text-[10px]" : "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-none font-mono text-[10px]"}
              >
                {a.type.toUpperCase()}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
