"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Cpu, Key, Database, Sliders, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5 text-foreground" />
            Sentinel Engine Configuration & Telemetry Parameters
          </h2>
          <p className="text-xs text-textSecondary mt-0.5">
            Configure Mahalanobis regularization constants, Chi-square thresholds, and local EMAD engine parameters
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            className={cn(
              "font-mono text-xs gap-1.5 transition-all shadow-sm font-semibold cursor-pointer",
              saved
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black active:scale-95"
            )}
          >
            {saved ? <Check className="h-3.5 w-3.5 text-white" /> : <Sliders className="h-3.5 w-3.5" />}
            <span>{saved ? "Settings Saved" : "Save Parameters"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Layer 1 Engine Config */}
        <Card className="bg-cardBg border-border p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-xs font-bold text-foreground uppercase font-mono">
              Layer 1: Multivariate Mutation Parameters
            </span>
            <Badge variant="outline" className="border-border text-[10px] text-textSecondary">
              Statistical Drift
            </Badge>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <label className="text-textSecondary block mb-1">Regularization Epsilon (ε * I):</label>
              <Input defaultValue="0.00001" className="h-8 bg-inputBg border-border text-foreground text-xs font-mono" />
            </div>
            <div>
              <label className="text-textSecondary block mb-1">Chi-Square Trigger Threshold (p-val):</label>
              <Input defaultValue="0.01" className="h-8 bg-inputBg border-border text-foreground text-xs font-mono" />
            </div>
            <div>
              <label className="text-textSecondary block mb-1">Mutation Velocity Threshold (ΔM_t):</label>
              <Input defaultValue="3.50" className="h-8 bg-inputBg border-border text-foreground text-xs font-mono" />
            </div>
          </div>
        </Card>

        {/* Layer 2 Peer Config */}
        <Card className="bg-cardBg border-border p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-xs font-bold text-foreground uppercase font-mono">
              Layer 2: Peer Normalization Multipliers
            </span>
            <Badge variant="outline" className="border-border text-[10px] text-textSecondary">
              Cohort Context
            </Badge>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <label className="text-textSecondary block mb-1">Isolation Multiplier (Max 2.0x):</label>
              <Input defaultValue="1.25" className="h-8 bg-inputBg border-border text-foreground text-xs font-mono" />
            </div>
            <div>
              <label className="text-textSecondary block mb-1">Cohort Dampening Factor:</label>
              <Input defaultValue="0.40" className="h-8 bg-inputBg border-border text-foreground text-xs font-mono" />
            </div>
            <div>
              <label className="text-textSecondary block mb-1">Department Baseline Window (Days):</label>
              <Input defaultValue="14" className="h-8 bg-inputBg border-border text-foreground text-xs font-mono" />
            </div>
          </div>
        </Card>
      </div>

      {/* Layer 3 EMAD Chamber Settings */}
      <Card className="bg-cardBg border-border p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <span className="text-xs font-bold text-foreground uppercase font-mono">
            Layer 3: Neuro-Symbolic EMAD Multi-Agent Engine
          </span>
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-none font-mono text-[10px]">
            Deterministic Local Fallback Ready
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div>
            <label className="text-textSecondary block mb-1">Optional LLM API Key (OpenAI / Gemini):</label>
            <Input
              type="password"
              placeholder="sk-... or AIza... (Optional - local chamber active by default)"
              className="h-8 bg-inputBg border-border text-foreground text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-textSecondary block mb-1">CMU-CERT Ingestion Directory:</label>
            <Input defaultValue="/home/nurphy/Desktop/M_Hash_2026/sentinel/data_cert" className="h-8 bg-inputBg border-border text-foreground text-xs font-mono" />
          </div>
        </div>
      </Card>
    </div>
  );
}
