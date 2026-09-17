"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardWidgets } from "./dashboard-widgets";
import { ThreatsView } from "./views/threats-view";
import { VulnerabilitiesView } from "./views/vulnerabilities-view";
import { NetworkView } from "./views/network-view";
import { UsersView } from "./views/users-view";
import { ReportsView } from "./views/reports-view";
import { NotificationsView } from "./views/notifications-view";
import { SettingsView } from "./views/settings-view";
import { Badge } from "@/components/ui/badge";

const tabToTitle: Record<string, string> = {
  dashboard: "Dashboard",
  threats: "Threats",
  vulnerabilities: "Vulnerabilities",
  network: "Network",
  users: "Users",
  reports: "Reports",
  notifications: "Notifications",
  settings: "Settings",
};

interface DashboardContentProps {
  activeTab: string;
}

export default function DashboardContent({ activeTab }: DashboardContentProps) {
  const pageTitle = tabToTitle[activeTab] || "Dashboard";

  const renderTabContent = () => {
    switch (activeTab) {
      case "threats":
        return <ThreatsView />;
      case "vulnerabilities":
        return <VulnerabilitiesView />;
      case "network":
        return <NetworkView />;
      case "users":
        return <UsersView />;
      case "reports":
        return <ReportsView />;
      case "notifications":
        return <NotificationsView />;
      case "settings":
        return <SettingsView />;
      case "dashboard":
      default:
        return <DashboardWidgets />;
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden w-full bg-[#000000]">
      {/* Top Header */}
      <header className="flex h-16 items-center justify-between border-b border-[#1C1C1E] px-4 md:px-6 shrink-0 bg-[#050505]">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-xl font-bold tracking-tight text-white">{pageTitle}</h1>
        </div>

        {/* Right: Organization & User Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold text-white tracking-wide">Vijay Eswaran S</span>
            <span className="text-[10px] text-[#8E8E93] font-mono">
              Security Administrator | Microsoft
            </span>
          </div>

          <div className="relative">
            <Avatar className="h-9 w-9 border border-[#2C2C2E] shadow-sm">
              <AvatarImage src="/user-avatar.jpg" alt="Vijay Eswaran S" className="object-cover" />
              <AvatarFallback className="bg-white/10 text-white font-mono font-bold text-xs tracking-wider">
                VE
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#050505]" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#000000] w-full">
        {renderTabContent()}
      </main>
    </div>
  );
}
