/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types";
import { Workflow, Sparkles, ArrowRight, User, Shield, Briefcase, Code2, Palette, Megaphone, Building2, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";

interface LoginViewProps {
  onBackToLanding: () => void;
  onEnterApp: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBackToLanding, onEnterApp }) => {
  const { setActiveRole, setActiveTab, setClientPortalId } = useApp();
  const [email, setEmail] = useState("owner@agencyos.co");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState("aarav");

  // Demo personas mapping
  const personas = [
    {
      id: "aarav",
      name: "Aarav Kapoor",
      role: UserRole.OWNER,
      email: "owner@agencyos.co",
      roleLabel: "Owner",
      color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      icon: Shield,
    },
    {
      id: "priya",
      name: "Priya Mehta",
      role: UserRole.MANAGER,
      email: "manager@agencyos.co",
      roleLabel: "Manager",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: Briefcase,
    },
    {
      id: "kai",
      name: "Kai Chen",
      role: UserRole.DEVELOPER,
      email: "developer@agencyos.co",
      roleLabel: "Developer",
      color: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      icon: Code2,
    },
    {
      id: "nora",
      name: "Nora Silva",
      role: UserRole.DESIGNER,
      email: "designer@agencyos.co",
      roleLabel: "Designer",
      color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      icon: Palette,
    },
    {
      id: "leo",
      name: "Leo Rossi",
      role: UserRole.MARKETING,
      email: "marketing@agencyos.co",
      roleLabel: "Marketing",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: Megaphone,
    },
    {
      id: "zoe",
      name: "Zoe Adams",
      role: UserRole.CLIENT,
      email: "client@agencyos.co",
      roleLabel: "Client",
      color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      icon: Building2,
    },
  ];

  const handlePersonaSelect = (persona: typeof personas[0]) => {
    setSelectedPersonaId(persona.id);
    setEmail(persona.email);
    setPassword("••••••••");
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find matching persona or fall back to selected
    const activePersona = personas.find(p => p.email.toLowerCase() === email.toLowerCase()) || personas.find(p => p.id === selectedPersonaId) || personas[0];
    
    setActiveRole(activePersona.role);
    if (activePersona.role === UserRole.CLIENT) {
      setClientPortalId("client-1"); // default demo client
      setActiveTab("ClientPortal");
    } else {
      setActiveTab("Dashboard");
    }
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col md:flex-row font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* LEFT COLUMN: LAVENDER BRANDING SIDEBAR */}
      <div className="w-full md:w-[45%] bg-[#8257e5] p-8 md:p-12 lg:p-16 flex flex-col justify-between text-[#030014] relative overflow-hidden shrink-0">
        
        {/* Ambient graphic flares for the left side */}
        <div className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Header Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none relative z-10" onClick={onBackToLanding}>
          <div className="w-10 h-10 rounded-xl bg-[#030014] flex items-center justify-center text-white shadow-lg shadow-black/15">
            <Workflow className="w-5 h-5 text-[#8257e5]" />
          </div>
          <div>
            <span className="font-display font-extrabold text-[#030014] text-md tracking-tight leading-none block">AgencyOS</span>
            <span className="text-[9px] font-mono text-[#030014]/60 block font-bold tracking-widest mt-0.5">BY ZELQUENT</span>
          </div>
        </div>

        {/* Hero content */}
        <div className="my-16 md:my-0 max-w-md relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold text-[#030014] bg-white/20 border border-white/10 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live demo</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-[#030014] leading-[1.1]">
            Your entire agency, <br />
            beautifully organized.
          </h2>

          <p className="text-[#030014]/75 text-sm mt-6 leading-relaxed max-w-sm font-medium">
            Sign in with a demo persona to explore the full workspace — no data required.
          </p>
        </div>

        {/* Footer quote */}
        <div className="border-t border-[#030014]/10 pt-6 relative z-10 max-w-sm">
          <p className="text-xs sm:text-sm font-semibold text-[#030014] italic leading-relaxed">
            "We replaced five tools with AgencyOS in the first month."
          </p>
          <p className="text-[11px] text-[#030014]/70 font-mono mt-2 font-bold tracking-wide">
            — Priya M., Studio Director
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: DARK SIGN-IN PANEL */}
      <div className="flex-1 bg-[#030014] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
        {/* Subtle decorative lights behind */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(145,110,255,0.06)_0%,rgba(3,0,20,0)_70%)] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,rgba(3,0,20,0)_70%)] pointer-events-none" />

        <div className="w-full max-w-lg mx-auto relative z-10 space-y-8">
          
          {/* Header titles */}
          <div className="text-left space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              Sign in to your AgencyOS workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Work email input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Work email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@company.com"
                className="w-full bg-[#0c0822]/80 border border-white/[0.08] text-white rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#8257e5]/60 focus:ring-1 focus:ring-[#8257e5]/20 transition-all font-mono"
              />
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[#a78bfa] hover:text-[#8257e5] text-xs font-semibold hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0c0822]/80 border border-white/[0.08] text-white rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#8257e5]/60 focus:ring-1 focus:ring-[#8257e5]/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign-in Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#8257e5] to-[#a78bfa] hover:from-[#7146d4] hover:to-[#967bf5] text-white font-semibold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all cursor-pointer mt-6"
            >
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest flex items-center gap-3 w-full my-6 before:content-[''] before:flex-1 before:h-[1px] before:bg-white/[0.06] after:content-[''] after:flex-1 after:h-[1px] after:bg-white/[0.06] select-none">
            Or continue as demo persona
          </div>

          {/* Interactive Persona Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            {personas.map((persona) => {
              const IconComponent = persona.icon;
              const isSelected = selectedPersonaId === persona.id;
              
              return (
                <div
                  key={persona.id}
                  onClick={() => handlePersonaSelect(persona)}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#0f0a2d] border-[#8257e5]/50 ring-1 ring-[#8257e5]/30 shadow-md shadow-[#8257e5]/5"
                      : "bg-[#07041a]/60 border-white/[0.04] hover:bg-[#0c0828] hover:border-white/[0.1]"
                  }`}
                >
                  {/* Subtle avatar with corresponding role-colored gradient/icon */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${persona.color}`}>
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white text-xs truncate">{persona.name}</h4>
                    <p className="text-gray-500 text-[10px] font-mono tracking-wide mt-0.5">{persona.roleLabel}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom links */}
          <div className="text-xs text-gray-500 text-center select-none pt-4">
            <span>New here? </span>
            <button
              onClick={() => {
                // Instantly select a default persona and log in as high-fidelity preview
                const aarav = personas[0];
                handlePersonaSelect(aarav);
              }}
              className="text-[#a78bfa] hover:text-[#8257e5] font-bold hover:underline transition-colors cursor-pointer"
            >
              Create an account
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
