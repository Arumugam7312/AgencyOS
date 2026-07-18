/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { UserRole } from "./types";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  DollarSign,
  Calendar,
  Folder,
  Settings,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  Building,
  User,
  Workflow,
  Sparkles,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Views
import { DashboardView } from "./components/DashboardView";
import { CrmView } from "./components/CrmView";
import { ProjectsView } from "./components/ProjectsView";
import { KanbanView } from "./components/KanbanView";
import { TeamView } from "./components/TeamView";
import { FinanceView } from "./components/FinanceView";
import { MeetingsView } from "./components/MeetingsView";
import { FilesView } from "./components/FilesView";
import { ClientPortalView } from "./components/ClientPortalView";
import { SettingsView } from "./components/SettingsView";
import { LandingView } from "./components/LandingView";
import { LoginView } from "./components/LoginView";
import { useNavigation } from "./hooks/useNavigation";

const AgencyOSApp: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    activeTab,
    setActiveTab,
    notifications,
    markNotifRead,
    markAllNotifsRead,
    clearAllNotifs,
    settings,
    theme,
    toggleTheme,
  } = useApp();

  const { filteredNav, currentNavItem, handleNavigate } = useNavigation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [screen, setScreen] = useState<"landing" | "login" | "app">("landing");

  const unreadNotifs = notifications.filter((n) => !n.read);

  if (screen === "landing") {
    return <LandingView onEnterApp={() => setScreen("app")} onShowLogin={() => setScreen("login")} />;
  }

  if (screen === "login") {
    return <LoginView onBackToLanding={() => setScreen("landing")} onEnterApp={() => setScreen("app")} />;
  }

  // Render Active view component
  const renderActiveView = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardView />;
      case "CRM":
        return <CrmView />;
      case "Projects":
        return <ProjectsView />;
      case "Kanban":
        return <KanbanView />;
      case "Team":
        return <TeamView />;
      case "Finance":
        return <FinanceView />;
      case "Meetings":
        return <MeetingsView />;
      case "Files":
        return <FilesView />;
      case "ClientPortal":
        return <ClientPortalView />;
      case "Settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030014] text-gray-900 dark:text-gray-100 flex transition-colors duration-300">
      
      {/* SIDEBAR NAVIGATION - DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-white/[0.04] bg-white dark:bg-[#07041a] shrink-0">
        {/* Top Header Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/[0.04] gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-bold text-gray-900 dark:text-white text-md tracking-tight">AgencyOS</span>
            <span className="text-[9px] font-mono text-indigo-400 block font-semibold leading-none">CORE SYSTEM</span>
          </div>
        </div>

        {/* Navigation Tabs list */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-[#8257e5] text-white shadow-md shadow-indigo-500/10"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === "ClientPortal" && (
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider ${
                    isSelected ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  }`}>
                    PORTAL
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Small Tagline Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-white/[0.04] text-center">
          <p className="text-[10px] font-mono text-gray-400">AgencyOS v1.4.0</p>
          <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide">Secure Sandboxed Tenant</p>
        </div>
      </aside>

      {/* MAIN VIEW AREA CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* APP TOP BAR */}
        <header className="sticky top-0 z-30 h-16 border-b border-gray-200 dark:border-white/[0.04] bg-white dark:bg-[#07041a] flex items-center justify-between px-4 md:px-6">
          
          {/* Mobile menu toggle & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
              <span className="text-[10px] font-mono text-indigo-500 font-semibold uppercase">{settings.companyName}</span>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {currentNavItem?.label || "Workspace"}
              </h2>
            </div>
          </div>

          {/* Interactive controls (Picker, Notifications, Profile, Theme) */}
          <div className="flex items-center gap-3">
            
            {/* Interactive ROLE SWITCHER - Super key for client review! */}
            <div className="relative flex items-center gap-1.5 text-xs">
              <span className="hidden lg:inline font-mono text-[10px] text-gray-400">ROLE ACTING:</span>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as UserRole)}
                className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white font-semibold cursor-pointer text-xs"
              >
                <option value={UserRole.OWNER}>Agency Owner</option>
                <option value={UserRole.MANAGER}>Project Manager</option>
                <option value={UserRole.DEVELOPER}>Software Engineer</option>
                <option value={UserRole.CLIENT}>Client Representative</option>
              </select>
            </div>



            {/* NOTIFICATIONS BOX */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-[#07041a]" />
                )}
              </button>

              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#07041a] shadow-xl overflow-hidden text-xs z-50"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800/80 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Workspace Dispatches</h4>
                      {unreadNotifs.length > 0 && (
                        <button
                          onClick={markAllNotifsRead}
                          className="text-[10px] text-indigo-500 hover:underline font-semibold cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[260px] overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800/60 scrollbar-thin">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotifRead(notif.id)}
                          className={`p-3.5 transition-all cursor-pointer flex gap-2 items-start ${
                            notif.read ? "opacity-65" : "bg-indigo-50/10 dark:bg-indigo-950/10"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            notif.type === "alert" ? "bg-red-500" : notif.type === "success" ? "bg-emerald-500" : "bg-blue-500"
                          }`} />
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <p className="font-semibold text-gray-900 dark:text-white leading-tight">{notif.title}</p>
                            <p className="text-gray-400 text-[11px] leading-relaxed">{notif.message}</p>
                            <p className="text-[9px] text-gray-400 font-mono">{notif.timestamp}</p>
                          </div>
                        </div>
                      ))}

                      {notifications.length === 0 && (
                        <p className="text-center py-8 text-gray-400 font-mono">No alerts logged.</p>
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-100 dark:border-gray-800/80 text-center bg-gray-50/50 dark:bg-gray-900/20">
                        <button
                          onClick={clearAllNotifs}
                          className="text-[10px] text-rose-500 hover:underline font-bold cursor-pointer"
                        >
                          Clear all notifications
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PROFILE MENU DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotifDropdownOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer shrink-0"
              >
                <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
                  {activeRole.charAt(0)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:inline" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#07041a] shadow-xl overflow-hidden text-xs z-50 text-gray-700 dark:text-gray-300"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/20">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">Administrator</p>
                      <p className="text-[10px] font-mono text-gray-400 mt-0.5 truncate">amarjun4444@gmail.com</p>
                    </div>
                    <div className="p-2 space-y-0.5">
                      <button
                        onClick={() => { setActiveTab("Settings"); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/60 text-left font-medium cursor-pointer"
                      >
                        <User className="w-4 h-4 text-gray-400" /> Account Profile
                      </button>
                      <button
                        onClick={() => { setActiveTab("Settings"); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/60 text-left font-medium cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-gray-400" /> System Settings
                      </button>
                      <button
                        onClick={() => {
                          setScreen("login");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 text-left font-medium cursor-pointer border-t border-gray-100 dark:border-gray-800/80 mt-1 pt-2"
                      >
                        <X className="w-4 h-4 text-rose-500" /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* COMPONENT BODY / VIEWS CONTROLLER */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6" id="applet-main-body-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* MOBILE COMPACT SLIDE-IN DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Sidebar menu panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-[#07041a] border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                      <Workflow className="w-4.5 h-4.5" />
                    </div>
                    <span className="font-display font-bold text-gray-900 dark:text-white">AgencyOS</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {filteredNav.map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleNavigate(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#8257e5] text-white"
                            : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-gray-400"}`} />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-2 border-t border-gray-100 dark:border-gray-800 text-center text-[10px] font-mono text-gray-400">
                AgencyOS Mobile Operating Frame
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AgencyOSApp />
    </AppProvider>
  );
}
