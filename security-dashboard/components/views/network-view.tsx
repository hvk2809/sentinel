"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wifi, Globe, Activity, ShieldAlert, ArrowUpRight, HardDrive } from "lucide-react";

export function NetworkView() {
  const flows = [
    {
      id: "FLOW-8810",
      timestamp: "2024-03-20 02:15:10",
      source: "PC-MAL-01 (10.0.12.44)",
      destination: "E:\\ (Mass Storage USB)",
      protocol: "USB-BOT (Bulk-Only)",
      bytes: "1.42 GB",
      threat: "Intellectual Property Exfiltration",
      status: "ESCALATED"
    },
    {
      id: "FLOW-8809",
      timestamp: "2024-03-20 01:12:44",
      source: "db-prod-replica-01 (10.0.4.11)",
      destination: "s3.us-east-1.amazonaws.com (Warehouse Cloud)",
      protocol: "HTTPS / TLS 1.3 (Port 443)",
      bytes: "18.4 GB",
      threat: "Authorized Database Migration (CR-8821)",
      status: "SUPPRESSED"
    },
    {
      id: "FLOW-8808",
      timestamp: "2024-03-20 01:45:22",
      source: "PC-BOB-01 (10.0.1.15)",
      destination: "DC-01 (10.0.1.2:389)",
      protocol: "LDAP / SMB (NTDS.dit Dump)",
      bytes: "480 MB",
      threat: "AD Password Hash Extraction (CR-4040 Expired)",
      status: "ESCALATED"
    },
    {
      id: "FLOW-8807",
      timestamp: "2024-03-20 03:00:15",
      source: "PC-CHA-01 (10.0.4.12)",
      destination: "etl-pipeline-s3.corp.local",
      protocol: "HTTPS (Port 443)",
      bytes: "2.1 GB",
      threat: "Routine ETL Batch (SR-1092)",
      status: "SUPPRESSED"
    }
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Wifi className="h-5 w-5 text-accent" />
            Network Topology & Outbound Exfiltration Telemetry
          </h2>
          <p className="text-xs text-textSecondary mt-0.5">
            Ingested from CMU-CERT http.csv, device mounts, and lateral authentication flows
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-none">10.0.0.0/16 Enterprise Subnet</Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-none">Zero Cloud Ingress</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-cardBg border-border p-4">
          <span className="text-xs font-mono text-textSecondary uppercase">External Domains Touched</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">28 Unique Hosts</div>
          <span className="text-xs text-textSecondary font-mono mt-1 block">Resource Cardinality Metric</span>
        </Card>
        <Card className="bg-cardBg border-border p-4">
          <span className="text-xs font-mono text-textSecondary uppercase">Outbound USB Volume</span>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">1.42 GB</div>
          <span className="text-xs text-rose-400 font-mono mt-1 block">35 Firmware Binaries (Malory)</span>
        </Card>
        <Card className="bg-cardBg border-border p-4">
          <span className="text-xs font-mono text-textSecondary uppercase">Cloud Sync Throughput</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">18.4 GB</div>
          <span className="text-xs text-emerald-400 font-mono mt-1 block">Authorized CR-8821 Mirror</span>
        </Card>
      </div>

      <Card className="bg-cardBg border-border">
        <CardHeader className="p-4 pb-3">
          <CardTitle className="text-sm font-bold text-white">
            Monitored Data Transfer Flows & Endpoint Channels
          </CardTitle>
          <CardDescription className="text-xs text-textSecondary">
            Real-time packet inspection correlated with user behavioral drift baselines
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-inputBg">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs font-mono text-textSecondary">Flow ID</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Timestamp</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Source Endpoint</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Destination / Target</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Protocol / Channel</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Payload Size</TableHead>
                  <TableHead className="text-xs font-mono text-textSecondary">Triage Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flows.map((f) => (
                  <TableRow key={f.id} className="border-border hover:bg-cardHoverBg text-xs font-mono">
                    <TableCell className="font-semibold text-accent">{f.id}</TableCell>
                    <TableCell className="text-textSecondary">{f.timestamp}</TableCell>
                    <TableCell className="text-white font-medium">{f.source}</TableCell>
                    <TableCell className="text-white">{f.destination}</TableCell>
                    <TableCell className="text-textSecondary">{f.protocol}</TableCell>
                    <TableCell className="text-white font-bold">{f.bytes}</TableCell>
                    <TableCell>
                      <Badge
                        className={f.status === "ESCALATED" ? "bg-rose-500/20 text-rose-400 border-none" : "bg-emerald-500/20 text-emerald-400 border-none"}
                      >
                        {f.status}
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
