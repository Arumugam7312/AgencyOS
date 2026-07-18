/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";
import {
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Activity,
  Send,
  Building,
  CheckCircle,
  FileText,
  Sparkles,
} from "lucide-react";

export const OwnerDashboard: React.FC = () => {
  const {
    clients,
    projects,
    tasks,
    invoices,
    payments,
    revenue,
    settings,
    addClient,
    addNotification,
    setActiveTab,
  } = useApp();

  const [showAddLead, setShowAddLead] = useState(false);
  const [leadCompanyName, setLeadCompanyName] = useState("");
  const [leadContactPerson, setLeadContactPerson] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadIndustry, setLeadIndustry] = useState("Software");

  const currencySymbol = settings.currency.split(" ")[1] || "$";

  // Financial calculations
  const totalPaid = useMemo(() => {
    return payments
      .filter((p) => p.status === "Success")
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const outstanding = useMemo(() => {
    return invoices
      .filter((inv) => inv.status === "Sent" || inv.status === "Overdue")
      .reduce((sum, inv) => sum + inv.total, 0);
  }, [invoices]);

  const totalMonthlyIncome = useMemo(() => {
    // Take revenue from last month point
    const lastPoint = revenue[revenue.length - 1];
    return lastPoint ? lastPoint.revenue : totalPaid * 0.15;
  }, [revenue, totalPaid]);

  const profitMargin = useMemo(() => {
    const lastPoint = revenue[revenue.length - 1];
    if (!lastPoint || lastPoint.revenue === 0) return 32.5;
    return Math.round(((lastPoint.revenue - lastPoint.expenses) / lastPoint.revenue) * 100);
  }, [revenue]);

  const activeClientsCount = useMemo(() => {
    return clients.filter((c) => c.status === "Active").length;
  }, [clients]);

  const leadClientsCount = useMemo(() => {
    return clients.filter((c) => c.status === "Lead").length;
  }, [clients]);

  // Format currency helper
  const formatCurrency = (val: number) => {
    return `${currencySymbol}${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const formatCurrencyShort = (val: number) => {
    if (val >= 1000000) return `${currencySymbol}${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${currencySymbol}${(val / 1000).toFixed(1)}k`;
    return `${currencySymbol}${val}`;
  };

  // SVG Chart values
  const chartPoints = useMemo(() => revenue.slice(-8), [revenue]);
  const maxVal = useMemo(() => Math.max(...chartPoints.map((p) => p.revenue), 10000), [chartPoints]);
  const minVal = useMemo(() => Math.min(...chartPoints.map((p) => p.expenses), 0), [chartPoints]);
  const range = maxVal - minVal;

  const width = 600;
  const height = 180;
  const padding = 20;

  const getCoords = (index: number, value: number) => {
    const x = padding + (index / (chartPoints.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - minVal) / (range || 1)) * (height - padding * 2);
    return `${x},${y}`;
  };

  const revenuePointsStr = useMemo(() => {
    return chartPoints.map((p, i) => getCoords(i, p.revenue)).join(" ");
  }, [chartPoints, minVal, range]);

  const expensePointsStr = useMemo(() => {
    return chartPoints.map((p, i) => getCoords(i, p.expenses)).join(" ");
  }, [chartPoints, minVal, range]);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadCompanyName || !leadEmail) return;

    addClient({
      companyName: leadCompanyName,
      logo: "from-amber-500 to-orange-600",
      industry: leadIndustry,
      website: `https://www.${leadCompanyName.toLowerCase().replace(/\s+/g, "")}.com`,
      gstNumber: "27AAACZ1092A2Z0",
      address: "Corporate Tech Park, Mumbai",
      contactPerson: leadContactPerson || "Account Rep",
      phone: "+91 99887 76655",
      email: leadEmail,
      status: "Lead",
      notes: "Acquired via Executive Lead Add Dashboard module.",
      tags: ["Direct-Lead", "Dashboard-Quick-Add"],
    });

    setLeadCompanyName("");
    setLeadContactPerson("");
    setLeadEmail("");
    setShowAddLead(false);
  };

  const handleSendReminder = (invoiceId: string, companyName: string, amount: number) => {
    addNotification(
      "Financial Dispatch Sentinel",
      `Payment reminder and outstanding ledger statement dispatched successfully to ${companyName} (${formatCurrency(amount)})`,
      "invoice"
    );
  };

  return (
    <div className="space-y-6" id="owner-dashboard-root">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="owner-kpi-grid">
        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Lifetime Revenue</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-gray-900 dark:text-white">
              {formatCurrencyShort(totalPaid)}
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12.4% vs prev cycle
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Monthly Runrate</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-gray-900 dark:text-white">
              {formatCurrencyShort(totalMonthlyIncome)}
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> Stability high
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Total Receivables</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-rose-500 dark:text-rose-400">
              {formatCurrencyShort(outstanding)}
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-amber-500">
              <AlertTriangle className="w-3 h-3 mr-0.5 animate-pulse" /> Pending collection
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Profit Margin</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-gray-900 dark:text-white">
              {profitMargin}%
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-3 h-3 mr-0.5" /> High Margin Model
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Row: Finance Chart & Leads Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cashflow Chart */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-500" /> Revenue vs Expense Analytics
              </h2>
              <p className="text-[11px] text-gray-400">Strategic review of fiscal year operational cashflow metrics</p>
            </div>
            
            <div className="flex gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Cash Inflow
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Operating Costs
              </span>
            </div>
          </div>

          <div className="relative pt-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible drop-shadow-xs">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = padding + ratio * (height - padding * 2);
                return (
                  <line
                    key={idx}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity={0.05}
                    strokeDasharray="4,4"
                    className="text-gray-400 dark:text-gray-600"
                  />
                );
              })}

              <defs>
                <linearGradient id="ownerRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="ownerExpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path
                d={`M ${padding},${height - padding} L ${revenuePointsStr} L ${width - padding},${height - padding} Z`}
                fill="url(#ownerRevGrad)"
              />
              <path
                d={`M ${padding},${height - padding} L ${expensePointsStr} L ${width - padding},${height - padding} Z`}
                fill="url(#ownerExpGrad)"
              />

              <polyline
                fill="none"
                stroke="#4F46E5"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={revenuePointsStr}
              />

              <polyline
                fill="none"
                stroke="#F43F5E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1,1"
                points={expensePointsStr}
              />

              {chartPoints.map((pt, idx) => {
                const [rx, ry] = getCoords(idx, pt.revenue).split(",").map(Number);
                const [ex, ey] = getCoords(idx, pt.expenses).split(",").map(Number);
                return (
                  <g key={idx}>
                    <circle cx={rx} cy={ry} r="4" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="1.5" />
                    <circle cx={ex} cy={ey} r="3.5" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="1.5" />
                  </g>
                );
              })}
            </svg>

            <div className="flex justify-between items-center text-[9px] font-mono text-gray-400 pt-1.5 px-4">
              {chartPoints.map((p, idx) => (
                <span key={idx}>{p.month.split(" ")[0]}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Client Leads Funnel Widget */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 flex flex-col justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-500" /> Executive Client Pipeline
            </h2>
            <p className="text-[11px] text-gray-400">Corporate client onboarding statuses & deals</p>
          </div>

          {/* Funnel design */}
          <div className="space-y-3 py-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-gray-400">
                <span>NEW LEADS (POTENTIAL)</span>
                <span className="font-bold text-amber-500">{leadClientsCount} Leads</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800/80 h-4 rounded-lg overflow-hidden relative">
                <div className="bg-amber-500 h-full rounded-lg transition-all" style={{ width: `${Math.min(100, (leadClientsCount / 15) * 100)}%` }} />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white uppercase tracking-wider">Prospecting Pool</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-gray-400">
                <span>ACTIVE CLIENT ACCOUNTS</span>
                <span className="font-bold text-emerald-500">{activeClientsCount} Retainers</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800/80 h-4 rounded-lg overflow-hidden relative">
                <div className="bg-emerald-500 h-full rounded-lg transition-all" style={{ width: `${Math.min(100, (activeClientsCount / 40) * 100)}%` }} />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white uppercase tracking-wider">Core Portfolio</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-gray-400">
                <span>MARKET PENETRATION</span>
                <span className="font-bold text-indigo-500">92% Target</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800/80 h-4 rounded-lg overflow-hidden relative">
                <div className="bg-indigo-600 h-full rounded-lg transition-all animate-pulse" style={{ width: "92%" }} />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white uppercase tracking-wider">High Velocity Capture</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800/60">
            <button
              onClick={() => setShowAddLead(true)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" /> Register New Corporate Lead
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Outstanding Bills Ledger & Lead Addition Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ledger Panel */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-500" /> High-Value Outstanding Invoices Ledger
              </h2>
              <p className="text-[11px] text-gray-400">Unsettled receivables requiring immediate client response</p>
            </div>
            <button
              onClick={() => setActiveTab("Finance")}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
            >
              Billing Portal
            </button>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {invoices
              .filter((i) => i.status === "Sent" || i.status === "Overdue")
              .slice(0, 4)
              .map((inv) => {
                const associatedClient = clients.find((c) => c.id === inv.clientId);
                return (
                  <div
                    key={inv.id}
                    className="p-3 rounded-xl border border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-950/10 flex justify-between items-center gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-gray-900 dark:text-white">{inv.invoiceNumber}</span>
                        <span className="px-1.5 py-0.2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-[9px] rounded font-bold font-mono uppercase">
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-[10px] font-mono leading-none">
                        CLIENT: <span className="font-semibold">{associatedClient?.companyName || "Corporate Account"}</span>
                      </p>
                    </div>

                    <div className="text-right flex items-center gap-3 shrink-0">
                      <div className="font-mono">
                        <p className="text-[10px] text-gray-400 leading-none">AMOUNT</p>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{formatCurrency(inv.total)}</p>
                      </div>
                      <button
                        onClick={() => handleSendReminder(inv.id, associatedClient?.companyName || "Corporate Account", inv.total)}
                        className="px-3 py-1.5 border border-indigo-100 dark:border-indigo-950 bg-indigo-50/40 hover:bg-indigo-50 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg cursor-pointer transition-all"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}

            {invoices.filter((i) => i.status === "Sent" || i.status === "Overdue").length === 0 && (
              <p className="text-center py-8 text-gray-400 font-mono">Ledger clear! No outstanding balances registered.</p>
            )}
          </div>
        </div>

        {/* Operational Timeline Feed */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 space-y-4">
          <div>
            <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-500" /> Agency Operational Sentinel
            </h2>
            <p className="text-[11px] text-gray-400">Real-time dispatches from administrative systems</p>
          </div>

          <div className="relative border-l border-gray-100 dark:border-gray-800 pl-4 ml-2 space-y-4 max-h-[220px] overflow-y-auto">
            <div className="relative text-xs">
              <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-gray-900" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-gray-400 block uppercase">Real-Time Access</span>
                <p className="font-semibold text-gray-900 dark:text-white">Active Owner token synchronized</p>
                <p className="text-gray-400 text-[10px]">Administrative console decrypted successfully.</p>
              </div>
            </div>

            <div className="relative text-xs">
              <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-gray-900" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-gray-400 block uppercase">Billing Feed</span>
                <p className="font-semibold text-gray-900 dark:text-white">Ledger audit verified</p>
                <p className="text-gray-400 text-[10px]">Outstanding balance ratios calculated within normal metrics.</p>
              </div>
            </div>

            <div className="relative text-xs">
              <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-gray-900" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-gray-400 block uppercase">CRM Module</span>
                <p className="font-semibold text-gray-900 dark:text-white">Pipeline status cached</p>
                <p className="text-gray-400 text-[10px]">{clients.length} accounts indexed across software domains.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Lead Quick Slider */}
      {showAddLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md flex items-center gap-1.5">
                <Building className="w-4 h-4 text-indigo-500" /> Register Corporate Lead
              </h3>
              <button
                onClick={() => setShowAddLead(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer text-xs font-mono"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Corporate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neo-Synthetics Ltd"
                  value={leadCompanyName}
                  onChange={(e) => setLeadCompanyName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Contact Representative</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Julian Wright"
                  value={leadContactPerson}
                  onChange={(e) => setLeadContactPerson(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">E-mail Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. biz@synthetics.io"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Industry Domain</label>
                  <select
                    value={leadIndustry}
                    onChange={(e) => setLeadIndustry(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Software">Software/SaaS</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Edtech">Edtech</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-xs mt-2"
              >
                Register Corporate Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
