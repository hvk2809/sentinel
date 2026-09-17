'use client';

import React from 'react';
import {
  BarChart3,
  Bell,
  Home,
  Lock,
  Settings,
  Shield,
  Users,
  Wifi,
  Radio,
  Activity,
  Layers,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const { logout } = useAuth();

  const commonButtonClass =
    'hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-[#8E8E93] text-xs font-medium py-2 rounded-md';

  const activeClass =
    'bg-white/10 text-white font-semibold border-l-2 border-white rounded-r-md rounded-l-none';

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="bg-[#050505] border-r border-[#1C1C1E]">
      {/* Brand Header */}
      <SidebarHeader className="flex items-center justify-center py-7 px-3 border-b border-[#1C1C1E]/60 bg-[#050505]">
        <div
          className={cn(
            'flex items-center justify-center transition-all w-full',
            state === 'collapsed' ? 'px-0' : 'px-2'
          )}
        >
          {/* Prominent High-Contrast Solid White Logo */}
          <img
            src="/logo.png"
            alt="Sentinel"
            className={cn(
              "object-contain transition-all",
              state === 'collapsed' ? "h-9 w-9" : "w-full max-w-[185px] h-auto max-h-24"
            )}
          />
        </div>
      </SidebarHeader>

      {/* Navigation Items */}
      <SidebarContent className="mt-3 px-2">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(commonButtonClass, activeTab === 'dashboard' && activeClass)}
              onClick={() => onTabChange('dashboard')}
            >
              <button type="button" className="w-full flex items-center gap-2.5 px-3">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(commonButtonClass, activeTab === 'threats' && activeClass)}
              onClick={() => onTabChange('threats')}
            >
              <button type="button" className="w-full flex items-center gap-2.5 px-3">
                <Shield className="h-4 w-4" />
                <span>Threats</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(commonButtonClass, activeTab === 'vulnerabilities' && activeClass)}
              onClick={() => onTabChange('vulnerabilities')}
            >
              <button type="button" className="w-full flex items-center gap-2.5 px-3">
                <Lock className="h-4 w-4" />
                <span>Vulnerabilities</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(commonButtonClass, activeTab === 'network' && activeClass)}
              onClick={() => onTabChange('network')}
            >
              <button type="button" className="w-full flex items-center gap-2.5 px-3">
                <Wifi className="h-4 w-4" />
                <span>Network</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(commonButtonClass, activeTab === 'reports' && activeClass)}
              onClick={() => onTabChange('reports')}
            >
              <button type="button" className="w-full flex items-center gap-2.5 px-3">
                <BarChart3 className="h-4 w-4" />
                <span>Reports</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Footer Settings & Fixed User Profile */}
      <SidebarFooter className="mt-auto px-2 pb-3 border-t border-[#1C1C1E]/60 pt-2">
        <SidebarMenu className="space-y-1 mb-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(commonButtonClass, activeTab === 'notifications' && activeClass)}
              onClick={() => onTabChange('notifications')}
            >
              <button type="button" className="w-full flex items-center gap-2.5 px-3">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(commonButtonClass, activeTab === 'settings' && activeClass)}
              onClick={() => onTabChange('settings')}
            >
              <button type="button" className="w-full flex items-center gap-2.5 px-3">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Clean, Fixed Bottom-Left User Profile */}
        <div
          className={cn(
            'flex items-center gap-2 p-2 rounded-md bg-[#0C0C0C] border border-[#1C1C1E] transition-all',
            state === 'collapsed' ? 'justify-center p-1.5' : 'justify-between'
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-7 w-7 border border-white/20 shrink-0">
              <AvatarImage src="/user-avatar.jpg" alt="Vijay Eswaran S" className="object-cover" />
              <AvatarFallback className="bg-white/10 text-white font-mono font-bold text-[11px]">
                VE
              </AvatarFallback>
            </Avatar>
            {state === 'expanded' && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-white truncate">
                  Vijay Eswaran S
                </span>
                <span className="text-[10px] text-[#8E8E93] font-mono truncate">
                  Security Administrator
                </span>
              </div>
            )}
          </div>
          {state === 'expanded' && (
            <button
              type="button"
              onClick={logout}
              title="Sign Out / Lock Console"
              className="p-1 rounded text-[#8E8E93] hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
