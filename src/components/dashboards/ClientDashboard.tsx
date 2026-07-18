/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import {
  Briefcase,
  DollarSign,
  Calendar,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  CreditCard,
  PlusCircle,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const ClientDashboard: React.FC = () => {
  const {
    projects,
    invoices,
    meetings,
    tickets,
    clientPortalId,
    clients,
    payInvoiceDemo,
    raiseSupportTicket,
    addNotification,
  } = useApp();

  // Find corresponding client company
  const clientCompany = useMemo(() => {
    return clients.find((c) => c.id === clientPortalId);
  }, [clients, clientPortalId]);

  // Filter project, invoices, tickets, and meetings for the active client
  const myProjects = useMemo(() => {
    return projects.filter((p) => p.clientId === clientPortalId);
  }, [projects, clientPortalId]);

  const myInvoices = useMemo(() => {
    return invoices.filter((inv) => inv.clientId === clientPortalId);
  }, [invoices, clientPortalId]);

  const pendingInvoices = useMemo(() => {
    return myInvoices.filter((inv) => inv.status === "Sent" || inv.status === "Overdue");
  }, [myInvoices]);

  const outstandingBalance = useMemo(() => {
    return pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);
  }, [pendingInvoices]);

  const myTickets = useMemo(() => {
    return tickets.filter((t) => t.clientId === clientPortalId);
  }, [tickets, clientPortalId]);

  const openTicketsCount = useMemo(() => {
    return myTickets.filter((t) => t.status === "Open").length;
  }, [myTickets]);

  const averageProjectProgress = useMemo(() => {
    if (myProjects.length === 0) return 0;
    const total = myProjects.reduce((sum, p) => sum + p.progress, 0);
    return Math.round(total / myProjects.length);
  }, [myProjects]);

  const myUpcomingMeetings = useMemo(() => {
    return meetings.filter((m) => m.clientId === clientPortalId).slice(0, 3);
  }, [meetings, clientPortalId]);

  // Support ticket form states
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [ticketPriority, setTicketPriority] = useState("High");
  const [showRaiseTicket, setShowRaiseTicket] = useState(false);

  // Invoice payment states
  const [payingInvoiceId, setPayingInvoiceId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Stripe Credit Card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<{ transactionId: string; receiptNumber: string } | null>(null);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle || !ticketDesc) return;

    raiseSupportTicket(ticketTitle, ticketDesc, ticketPriority);
    setTicketTitle("");
    setTicketDesc("");
    setShowRaiseTicket(false);
  };

  const handlePayInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoiceId) return;

    setIsProcessingPayment(true);
    setPaymentReceipt(null);

    const result = await payInvoiceDemo(payingInvoiceId, paymentMethod);
    setIsProcessingPayment(false);

    if (result.success) {
      setPaymentReceipt({
        transactionId: result.transactionId,
        receiptNumber: result.receiptNumber,
      });
      setPayingInvoiceId("");
    }
  };

  return (
    <div className="space-y-6" id="client-dashboard-root">
      {/* Account Context Banner */}
      <div className="p-4 rounded-2xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/20 dark:bg-indigo-950/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {clientCompany?.companyName ? clientCompany.companyName[0] : "C"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-xs">Logged as Client: {clientCompany?.companyName || "Representative Portal"}</h3>
            <p className="text-[10px] text-gray-400">Review project roadmap status, settle billing logs, and triage engineering tickets</p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-wider">
          Secured Sandbox Connection
        </span>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="client-kpi-grid">
        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">My Projects Deliveries</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-gray-900 dark:text-white">
              {myProjects.length} <span className="text-xs text-gray-500 font-normal">Active</span>
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-indigo-500">
              <TrendingUp className="w-3 h-3 mr-0.5" /> High progress index
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Project roadmap Progress</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-emerald-500">
              {averageProjectProgress}%
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3 mr-0.5" /> Release sprint on track
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Ledger Settlement</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-rose-500 dark:text-rose-400">
              ${outstandingBalance.toLocaleString()}
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-amber-500">
              <Clock className="w-3 h-3 mr-0.5" /> {pendingInvoices.length} Bills outstanding
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Help Desk Requests</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-gray-900 dark:text-white">
              {openTicketsCount} <span className="text-xs text-gray-500 font-normal">Open</span>
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-gray-400">
              <HelpCircle className="w-3 h-3 mr-0.5" /> Fast SLAs active
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Row: Project Roadmap and Settle Balance Portal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Horizontal roadmap tracker */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-indigo-500" /> Software Deliverables Roadmap
            </h2>
            <p className="text-[11px] text-gray-400">Review release timeline tracking, sprint milestones, and agile status maps</p>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {myProjects.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-850 bg-gray-50/30 dark:bg-gray-950/10 space-y-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-xs">{p.projectName}</h4>
                    <p className="text-[9px] text-gray-400 font-mono mt-0.5">DEADLINE TARGET: {p.deadline} | RISK RATE: {p.priority}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 font-mono text-[8px] font-bold">
                    HEALTH: {p.projectHealth}
                  </span>
                </div>

                {/* Milestone Roadmap Stepper */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px]">
                  {p.milestones.map((m, idx) => (
                    <div
                      key={m.id}
                      className={`p-2 rounded-lg border flex flex-col justify-between ${
                        m.completed
                          ? "bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-gray-100/40 dark:bg-gray-900/20 border-gray-100 dark:border-gray-850 text-gray-400"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[9px] font-bold">0{idx + 1}</span>
                        {m.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </div>
                      <p className="font-semibold truncate mt-1 text-[9px] uppercase leading-tight">{m.title}</p>
                      <span className="text-[8px] font-mono block mt-0.5">{m.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {myProjects.length === 0 && (
              <p className="text-center py-12 text-gray-400 font-mono">No active projects registered under this account.</p>
            )}
          </div>
        </div>

        {/* Ledger Payment settlement widget */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-rose-500" /> Settle Corporate Ledger
            </h2>
            <p className="text-[11px] text-gray-400">Authorize payments instantly via our sandbox processing link</p>
          </div>

          {pendingInvoices.length > 0 ? (
            <form onSubmit={handlePayInvoice} className="space-y-3 text-xs text-left">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-400 uppercase">Select Pending Invoice</label>
                <select
                  required
                  value={payingInvoiceId}
                  onChange={(e) => setPayingInvoiceId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select bill...</option>
                  {pendingInvoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} (${inv.total.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-400 uppercase">Gateway Selector</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Stripe Credit Card">Stripe Credit Card (Demo)</option>
                  <option value="NetBanking">Direct Bank Wire (Demo)</option>
                  <option value="UPI">Google Pay / UPI (Demo)</option>
                </select>
              </div>

              {paymentReceipt && (
                <div className="p-2.5 rounded-lg bg-emerald-50/20 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 space-y-0.5">
                  <p className="font-bold">✓ PAYMENT AUTHORIZED</p>
                  <p>TXN: {paymentReceipt.transactionId}</p>
                  <p>RECEIPT: {paymentReceipt.receiptNumber}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 text-white font-semibold rounded-lg text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                    Connecting to Gateway...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5" /> Settle Selected Balance
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-10 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-mono text-[10px] text-gray-400 uppercase">Ledger Clear!</p>
              <p className="text-xs text-gray-500">Your account representative has settled all billing statements.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Support Tickets and Upcoming Syncs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Help Desk Tickets List */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-500" /> SLA Support Tickets Tracking
              </h2>
              <p className="text-[11px] text-gray-400">Track and manage active issues submitted to our development pipeline</p>
            </div>
            
            <button
              onClick={() => setShowRaiseTicket(!showRaiseTicket)}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Raise Support Ticket
            </button>
          </div>

          {showRaiseTicket ? (
            <form onSubmit={handleCreateTicket} className="p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-400 uppercase">Incident Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Redirect loop on Checkout component under mobile safari"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-gray-400 uppercase">Detailed Description</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Provide console logs or replication steps..."
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-gray-400 uppercase">Priority Rating</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Severity (SLA)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg cursor-pointer">
                  Submit SLA Ticket
                </button>
                <button type="button" onClick={() => setShowRaiseTicket(false)} className="px-3 py-2 bg-gray-150 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {myTickets.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/10 flex justify-between items-center text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 dark:text-white">{t.title}</span>
                      <span className={`px-1.5 py-0.2 rounded font-mono text-[8px] font-bold uppercase ${
                        t.status === "Open" ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-[10px] leading-tight line-clamp-1">{t.description}</p>
                    <p className="text-[9px] font-mono text-gray-400 uppercase">SUBMITTED: {t.date} | REVERSED FOR: {t.priority}</p>
                  </div>

                  <span className="text-[10px] font-mono text-gray-400 font-bold shrink-0">#{t.id}</span>
                </div>
              ))}

              {myTickets.length === 0 && (
                <p className="text-center py-8 text-gray-400 font-mono">No incident reports logged on your SLA account.</p>
              )}
            </div>
          )}
        </div>

        {/* Calendar Sync Widget */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 flex flex-col justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-500" /> Virtual Sprint Syncs
            </h2>
            <p className="text-[11px] text-gray-400">Scheduled progress checkins and milestone workshops</p>
          </div>

          <div className="space-y-3 py-4 max-h-[220px] overflow-y-auto">
            {myUpcomingMeetings.map((meet) => (
              <div
                key={meet.id}
                className="p-3 rounded-xl border border-gray-100 dark:border-gray-850 bg-gray-50/40 dark:bg-gray-950/20 text-xs space-y-1"
              >
                <div className="flex justify-between font-mono text-[10px] text-gray-400">
                  <span>{meet.date} • {meet.time} ({meet.duration} mins)</span>
                  <a href={meet.meetingLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Join</a>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{meet.title}</h4>
                <p className="text-gray-400 text-[10px] line-clamp-1">{meet.agenda}</p>
              </div>
            ))}

            {myUpcomingMeetings.length === 0 && (
              <p className="text-center py-8 text-gray-400 font-mono">No virtual syncs scheduled.</p>
            )}
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800/60">
            <a
              href="https://meet.google.com"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs text-center"
            >
              Open Google Meet Workspace
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
