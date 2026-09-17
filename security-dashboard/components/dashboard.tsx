"use client";

import React, { useState } from "react";
import DashboardSidebar from "./dashboard-sidebar";
import DashboardContent from "./dashboard-content";
import { SidebarProvider } from "./ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { LoginView } from "./views/login-view";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-textSecondary tracking-widest uppercase">
            Initializing Sentinel Gateway...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground w-full">
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden w-full">
          <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <DashboardContent activeTab={activeTab} />
        </div>
      </SidebarProvider>
    </div>
  );
}
