"use client";

import React, { useState } from "react";
import DashboardSidebar from "./dashboard-sidebar";
import DashboardContent from "./dashboard-content";
import { SidebarProvider } from "./ui/sidebar";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

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
