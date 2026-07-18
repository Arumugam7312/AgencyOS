/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Workflow,
  Shield,
  BriefcaseIcon,
  UserCheck,
  Code2,
  Building,
  CheckCircle2,
  Lock,
  CreditCard,
  Bot,
  Calendar,
  BarChart3,
  LayoutDashboard,
  FileText,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LandingViewProps {
  onEnterApp: () => void;
  onShowLogin: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp, onShowLogin }) => {
  const { setActiveRole, setActiveTab, setClientPortalId } = useApp();
  const setShowRoleModal = (val: boolean) => {
    if (val) {
      onShowLogin();
    }
  };

  // Quick enter helper with role selection
  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    if (role === UserRole.CLIENT) {
      setClientPortalId("client-1"); // default demo client
      setActiveTab("ClientPortal");
    } else {
      setActiveTab("Dashboard");
    }
    setShowRoleModal(false);
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white relative font-sans overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background Radial Flare Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12)_0%,rgba(168,85,247,0.08)_30%,rgba(3,0,20,0)_70%)] pointer-events-none z-0" />
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,rgba(3,0,20,0)_70%)] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.05)_0%,rgba(3,0,20,0)_70%)] pointer-events-none z-0" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0 opacity-40" />

      {/* HEADER NAVBAR */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/[0.04]">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-extrabold text-white text-md tracking-tight leading-none block">AgencyOS</span>
            <span className="text-[9px] font-mono text-gray-500 block font-bold tracking-widest mt-0.5">BY ZELQUENT</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <button onClick={() => setShowRoleModal(true)} className="hover:text-white transition-colors cursor-pointer">Features</button>
          <button onClick={() => setShowRoleModal(true)} className="hover:text-white transition-colors cursor-pointer">Modules</button>
          <button onClick={() => setShowRoleModal(true)} className="hover:text-white transition-colors cursor-pointer">Pricing</button>
        </nav>

        {/* Right Side: Sign In / CTA Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowRoleModal(true)}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer px-4 py-2"
          >
            Sign in
          </button>
          <button
            onClick={() => setShowRoleModal(true)}
            className="relative group overflow-hidden bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-1">
              Try demo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-12 text-center flex flex-col items-center">
        
        {/* Sparkling badge at the top */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] md:text-xs font-mono font-medium text-[#c084fc] bg-[#1e1548]/30 border border-[#c084fc]/20 rounded-full mb-8 shadow-inner shadow-[#c084fc]/5"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#c084fc]" />
          <span>New — AI Workspace is live</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl"
        >
          Run your entire <br />
          agency <br />
          from <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] via-[#a78bfa] to-[#c084fc]">one dashboard</span>.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mt-8 leading-relaxed font-normal"
        >
          AgencyOS unifies clients, projects, invoices, payments, meetings, files and AI tools into a single, beautifully designed workspace built for modern studios.
        </motion.p>

        {/* CTA Button Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full sm:w-auto"
        >
          <button
            onClick={() => setShowRoleModal(true)}
            className="w-full sm:w-auto group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-750 text-white font-semibold text-sm py-3.5 px-7 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer"
          >
            Explore live demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setShowRoleModal(true)}
            className="w-full sm:w-auto text-white bg-[#090514]/80 hover:bg-[#0f0a22] border border-gray-800 hover:border-gray-700 font-semibold text-sm py-3.5 px-7 rounded-xl transition-all cursor-pointer flex items-center justify-center"
          >
            See features
          </button>
        </motion.div>

        {/* Notice line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-500 text-[10px] md:text-xs mt-6 font-mono tracking-wide"
        >
          No credit card. No signup. Instantly loaded with 24 months of realistic demo data.
        </motion.p>
      </section>

      {/* PREVIEW BROWSER CONTAINER */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring", damping: 20 }}
          className="relative rounded-2xl border border-white/[0.08] bg-[#070319]/40 backdrop-blur-xl shadow-2xl overflow-hidden p-1.5"
          style={{ boxShadow: "0 0 50px -12px rgba(99, 102, 241, 0.2)" }}
        >
          {/* Simulated Browser Head */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d0a22]/80 border-b border-white/[0.04]">
            {/* Red, Yellow, Green Mac-style indicators */}
            <div className="flex items-center gap-2 select-none">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#10b981]/80 inline-block" />
            </div>

            {/* URL Input Box */}
            <div className="flex-1 max-w-sm mx-auto bg-[#030014]/60 border border-white/[0.06] rounded-lg px-4 py-1 text-center text-[10px] font-mono text-gray-400 tracking-wide select-all">
              app.agencyos.co/dashboard
            </div>

            {/* Empty space to balance */}
            <div className="w-16" />
          </div>

          {/* Interactive Mockup Dashboard Body */}
          <div
            onClick={() => setShowRoleModal(true)}
            className="bg-[#0b0724]/90 p-6 md:p-8 space-y-6 cursor-pointer group/mockup relative"
          >
            {/* Hover Indicator overlay */}
            <div className="absolute inset-0 bg-indigo-500/[0.01] group-hover/mockup:bg-indigo-500/[0.03] transition-colors duration-300 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/mockup:opacity-100 transition-opacity duration-300 bg-indigo-600 text-white font-semibold text-xs px-4 py-2.5 rounded-full shadow-lg shadow-indigo-500/20 z-10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-white" />
              <span>Launch Live System Simulator</span>
            </div>

            {/* KPIs Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-white/[0.04] bg-[#120a2e]/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Monthly Revenue</p>
                  <h3 className="text-lg md:text-xl font-display font-semibold text-white mt-1">₹9.2L</h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.04] bg-[#120a2e]/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Clients</p>
                  <h3 className="text-lg md:text-xl font-display font-semibold text-white mt-1">50</h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.04] bg-[#120a2e]/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Projects</p>
                  <h3 className="text-lg md:text-xl font-display font-semibold text-white mt-1">120</h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.04] bg-[#120a2e]/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Outstanding</p>
                  <h3 className="text-lg md:text-xl font-display font-semibold text-rose-400 mt-1">₹3.4L</h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Dashboard Sub-layouts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Analytics Chart Simulation */}
              <div className="p-5 rounded-xl border border-white/[0.04] bg-[#120a2e]/60 md:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-semibold">Operational Cashflow Analytics</h4>
                    <p className="text-[9px] text-gray-400 font-mono">24 Months Historical Financial Record</p>
                  </div>
                  <span className="text-[9px] font-mono text-indigo-400">Stable Runrate</span>
                </div>

                {/* Drawn SVG Waves resembling Chart */}
                <div className="h-32 w-full pt-4">
                  <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="mockChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.02)" strokeDasharray="4,4" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.02)" strokeDasharray="4,4" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.02)" strokeDasharray="4,4" />
                    
                    {/* Shadow Area */}
                    <path d="M0,120 Q50,40 100,60 T200,30 T300,50 T400,20 T500,40 L500,120 L0,120 Z" fill="url(#mockChartGrad)" />
                    {/* Wave Line */}
                    <path d="M0,120 Q50,40 100,60 T200,30 T300,50 T400,20 T500,40" fill="none" stroke="#6366f1" strokeWidth="3" />
                  </svg>
                </div>
              </div>

              {/* Right Column: Sprint Pipeline Simulation */}
              <div className="p-5 rounded-xl border border-white/[0.04] bg-[#120a2e]/60 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold">Active Client Deliveries</h4>
                  <p className="text-[9px] text-gray-400 font-mono">Agency Milestone Funnel</p>
                </div>

                <div className="space-y-3 py-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                      <span>STAGING RELEASES</span>
                      <span>85% Completed</span>
                    </div>
                    <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                      <span>CUSTOMER SUCCESS SLA</span>
                      <span>96% Compliance</span>
                    </div>
                    <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-teal-400 h-full rounded-full" style={{ width: "96%" }} />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[9px] text-gray-400 font-mono">
                  <span>9 Open Backlogs</span>
                  <span className="text-indigo-400 font-bold">Manage Space →</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 1: ONE PLATFORM, EVERY WORKFLOW */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.04]">
        <div className="flex flex-col items-start text-left mb-14 space-y-4">
          <span className="px-3 py-1 text-[10px] font-bold text-white bg-white/[0.04] border border-white/[0.08] rounded-full uppercase tracking-wider font-mono">
            Platform
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
            One platform. Every workflow.
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Everything a modern agency needs — from first pitch to final invoice — beautifully connected.
          </p>
        </div>

        {/* 3x2 Grid of features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Client CRM */}
          <div className="p-8 rounded-2xl border border-white/[0.04] bg-[#07041a]/60 hover:bg-[#0c0828]/80 hover:border-[#8257e5]/40 transition-all duration-350 flex flex-col space-y-6 group cursor-pointer" onClick={() => setShowRoleModal(true)}>
            <div className="w-11 h-11 bg-indigo-500/10 text-[#a78bfa] rounded-xl flex items-center justify-center border border-[#a78bfa]/20 shadow-md shadow-[#8257e5]/5 group-hover:bg-[#8257e5] group-hover:text-white group-hover:scale-105 transition-all">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-display font-semibold text-white group-hover:text-indigo-200 transition-colors">Client CRM</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                One source of truth for every account, contact, contract and interaction.
              </p>
            </div>
          </div>

          {/* Card 2: Project Command Center */}
          <div className="p-8 rounded-2xl border border-white/[0.04] bg-[#07041a]/60 hover:bg-[#0c0828]/80 hover:border-[#8257e5]/40 transition-all duration-350 flex flex-col space-y-6 group cursor-pointer" onClick={() => setShowRoleModal(true)}>
            <div className="w-11 h-11 bg-indigo-500/10 text-[#a78bfa] rounded-xl flex items-center justify-center border border-[#a78bfa]/20 shadow-md shadow-[#8257e5]/5 group-hover:bg-[#8257e5] group-hover:text-white group-hover:scale-105 transition-all">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-display font-semibold text-white group-hover:text-indigo-200 transition-colors">Project Command Center</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Track scope, budget, hours and health with beautiful pipelines.
              </p>
            </div>
          </div>

          {/* Card 3: Invoicing & Payments */}
          <div className="p-8 rounded-2xl border border-white/[0.04] bg-[#07041a]/60 hover:bg-[#0c0828]/80 hover:border-[#8257e5]/40 transition-all duration-350 flex flex-col space-y-6 group cursor-pointer" onClick={() => setShowRoleModal(true)}>
            <div className="w-11 h-11 bg-indigo-500/10 text-[#a78bfa] rounded-xl flex items-center justify-center border border-[#a78bfa]/20 shadow-md shadow-[#8257e5]/5 group-hover:bg-[#8257e5] group-hover:text-white group-hover:scale-105 transition-all">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-display font-semibold text-white group-hover:text-indigo-200 transition-colors">Invoicing & Payments</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Send branded invoices and accept payments with a click.
              </p>
            </div>
          </div>

          {/* Card 4: AI Assistant */}
          <div className="p-8 rounded-2xl border border-white/[0.04] bg-[#07041a]/60 hover:bg-[#0c0828]/80 hover:border-[#8257e5]/40 transition-all duration-350 flex flex-col space-y-6 group cursor-pointer" onClick={() => setShowRoleModal(true)}>
            <div className="w-11 h-11 bg-indigo-500/10 text-[#a78bfa] rounded-xl flex items-center justify-center border border-[#a78bfa]/20 shadow-md shadow-[#8257e5]/5 group-hover:bg-[#8257e5] group-hover:text-white group-hover:scale-105 transition-all">
              <Bot className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-display font-semibold text-white group-hover:text-indigo-200 transition-colors">AI Assistant</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Draft proposals, scopes, follow-ups and reports in seconds.
              </p>
            </div>
          </div>

          {/* Card 5: Calendar & Meetings */}
          <div className="p-8 rounded-2xl border border-white/[0.04] bg-[#07041a]/60 hover:bg-[#0c0828]/80 hover:border-[#8257e5]/40 transition-all duration-350 flex flex-col space-y-6 group cursor-pointer" onClick={() => setShowRoleModal(true)}>
            <div className="w-11 h-11 bg-indigo-500/10 text-[#a78bfa] rounded-xl flex items-center justify-center border border-[#a78bfa]/20 shadow-md shadow-[#8257e5]/5 group-hover:bg-[#8257e5] group-hover:text-white group-hover:scale-105 transition-all">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-display font-semibold text-white group-hover:text-indigo-200 transition-colors">Calendar & Meetings</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Unified calendar for tasks, deadlines and client calls.
              </p>
            </div>
          </div>

          {/* Card 6: Reports & Insights */}
          <div className="p-8 rounded-2xl border border-white/[0.04] bg-[#07041a]/60 hover:bg-[#0c0828]/80 hover:border-[#8257e5]/40 transition-all duration-350 flex flex-col space-y-6 group cursor-pointer" onClick={() => setShowRoleModal(true)}>
            <div className="w-11 h-11 bg-indigo-500/10 text-[#a78bfa] rounded-xl flex items-center justify-center border border-[#a78bfa]/20 shadow-md shadow-[#8257e5]/5 group-hover:bg-[#8257e5] group-hover:text-white group-hover:scale-105 transition-all">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-display font-semibold text-white group-hover:text-indigo-200 transition-colors">Reports & Insights</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Executive dashboards for revenue, cash flow and team output.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 18+ MODULES WORKING AS ONE */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.04]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Content & Bullets */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-4">
              <span className="px-3 py-1 text-[10px] font-bold text-white bg-white/[0.04] border border-white/[0.08] rounded-full uppercase tracking-wider font-mono">
                Modules
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                18+ modules <br />working as one.
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Kanban, tasks, invoices, payments, contracts, files, calendar, reports, AI — stitched together with a consistent design language.
              </p>
            </div>

            {/* Bullets grid */}
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-xs sm:text-sm font-medium text-gray-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a78bfa] shrink-0" />
                <span>Client CRM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a78bfa] shrink-0" />
                <span>Kanban</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a78bfa] shrink-0" />
                <span>Invoices</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a78bfa] shrink-0" />
                <span>Payments</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a78bfa] shrink-0" />
                <span>Contracts</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a78bfa] shrink-0" />
                <span>File Manager</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a78bfa] shrink-0" />
                <span>Reports</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a78bfa] shrink-0" />
                <span>AI Workspace</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a78bfa] shrink-0" />
                <span>Calendar</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a78bfa] shrink-0" />
                <span>Client Portal</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowRoleModal(true)}
                className="group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-750 text-white font-semibold text-sm py-3.5 px-7 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer w-full sm:w-auto"
              >
                Enter the demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Side: Glowing Modules Mockup container */}
          <div className="lg:col-span-7">
            <div
              className="relative rounded-2xl border border-white/[0.08] bg-[#070319]/40 backdrop-blur-xl p-6 sm:p-8 overflow-hidden"
              style={{ boxShadow: "0 0 40px -10px rgba(129, 140, 248, 0.15)" }}
              onClick={() => setShowRoleModal(true)}
            >
              {/* Modules Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Dashboard */}
                <div className="p-4 rounded-xl border border-white/[0.04] bg-[#0c0822]/80 flex items-center gap-3.5 hover:border-[#8257e5]/35 hover:bg-[#120e32]/90 transition-all group cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-[#8257e5] group-hover:text-white transition-all">
                    <LayoutDashboard className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white">Dashboard</span>
                </div>

                {/* 2. Clients */}
                <div className="p-4 rounded-xl border border-white/[0.04] bg-[#0c0822]/80 flex items-center gap-3.5 hover:border-[#8257e5]/35 hover:bg-[#120e32]/90 transition-all group cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-[#8257e5] group-hover:text-white transition-all">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white">Clients</span>
                </div>

                {/* 3. Projects */}
                <div className="p-4 rounded-xl border border-white/[0.04] bg-[#0c0822]/80 flex items-center gap-3.5 hover:border-[#8257e5]/35 hover:bg-[#120e32]/90 transition-all group cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-[#8257e5] group-hover:text-white transition-all">
                    <Briefcase className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white">Projects</span>
                </div>

                {/* 4. Payments */}
                <div className="p-4 rounded-xl border border-white/[0.04] bg-[#0c0822]/80 flex items-center gap-3.5 hover:border-[#8257e5]/35 hover:bg-[#120e32]/90 transition-all group cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-[#8257e5] group-hover:text-white transition-all">
                    <CreditCard className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white">Payments</span>
                </div>

                {/* 5. Contracts */}
                <div className="p-4 rounded-xl border border-white/[0.04] bg-[#0c0822]/80 flex items-center gap-3.5 hover:border-[#8257e5]/35 hover:bg-[#120e32]/90 transition-all group cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-[#8257e5] group-hover:text-white transition-all">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white">Contracts</span>
                </div>

                {/* 6. Reports */}
                <div className="p-4 rounded-xl border border-white/[0.04] bg-[#0c0822]/80 flex items-center gap-3.5 hover:border-[#8257e5]/35 hover:bg-[#120e32]/90 transition-all group cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-[#8257e5] group-hover:text-white transition-all">
                    <BarChart3 className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white">Reports</span>
                </div>

                {/* 7. AI */}
                <div className="p-4 rounded-xl border border-white/[0.04] bg-[#0c0822]/80 flex items-center gap-3.5 hover:border-[#8257e5]/35 hover:bg-[#120e32]/90 transition-all group cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-[#8257e5] group-hover:text-white transition-all">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white">AI</span>
                </div>

                {/* 8. Automations */}
                <div className="p-4 rounded-xl border border-white/[0.04] bg-[#0c0822]/80 flex items-center gap-3.5 hover:border-[#8257e5]/35 hover:bg-[#120e32]/90 transition-all group cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-[#8257e5] group-hover:text-white transition-all">
                    <Zap className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white">Automations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 bg-[#02000c]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow shadow-indigo-500/10">
              <Workflow className="w-3.5 h-3.5" />
            </div>
            <span>© 2026 AgencyOS · a Zelquent Tech product</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setShowRoleModal(true)} className="hover:text-white transition-colors cursor-pointer">Privacy</button>
            <button onClick={() => setShowRoleModal(true)} className="hover:text-white transition-colors cursor-pointer">Terms</button>
            <button onClick={() => setShowRoleModal(true)} className="hover:text-white transition-colors cursor-pointer">Status</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
