/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import {
  Briefcase,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  AlertTriangle,
  Plus,
  Send,
  HelpCircle,
  Video,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  X,
} from "lucide-react";

export const ClientPortalView: React.FC = () => {
  const {
    clients,
    clientPortalId,
    setClientPortalId,
    projects,
    invoices,
    meetings,
    tickets,
    payInvoiceDemo,
    raiseSupportTicket,
    addMeeting,
    settings,
  } = useApp();

  // Active acting client
  const currentClient = useMemo(() => {
    return clients.find((c) => c.id === clientPortalId) || clients[0];
  }, [clients, clientPortalId]);

  // Client specific details
  const clientProjects = useMemo(() => {
    if (!currentClient) return [];
    return projects.filter((p) => p.clientId === currentClient.id);
  }, [projects, currentClient]);

  const clientInvoices = useMemo(() => {
    if (!currentClient) return [];
    return invoices.filter((i) => i.clientId === currentClient.id);
  }, [invoices, currentClient]);

  const clientMeetings = useMemo(() => {
    if (!currentClient) return [];
    // Simple filter: invitee includes client or is designated as client meeting
    return meetings.filter((m) => m.isClientMeeting);
  }, [meetings]);

  const clientTickets = useMemo(() => {
    if (!currentClient) return [];
    return tickets.filter((t) => t.clientId === currentClient.id);
  }, [tickets, currentClient]);

  const currencySymbol = settings.currency.split(" ")[1] || "$";

  // State managers
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState("Credit Card");
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [payReceipt, setPayReceipt] = useState<{ transactionId: string; receiptNumber: string } | null>(null);

  // Ticket Form
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketPriority, setTicketPriority] = useState("Medium");
  const [ticketDesc, setTicketDesc] = useState("");

  // Meetings Form
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [meetTitle, setMeetTitle] = useState("");
  const [meetDate, setMeetDate] = useState("");
  const [meetTime, setMeetTime] = useState("");

  const handlePayInvoice = async (invoiceId: string) => {
    setPayingInvoiceId(invoiceId);
    setPayReceipt(null);
    setIsProcessingPay(true);

    try {
      const res = await payInvoiceDemo(invoiceId, payMethod);
      if (res.success) {
        setPayReceipt({
          transactionId: res.transactionId,
          receiptNumber: res.receiptNumber,
        });
      }
    } catch (err) {
      alert("Simulated transaction failed, try again.");
    } finally {
      setIsProcessingPay(false);
    }
  };

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle || !ticketDesc) return;
    raiseSupportTicket(ticketTitle, ticketDesc, ticketPriority);
    setTicketTitle("");
    setTicketDesc("");
    setShowTicketModal(false);
  };

  const handleBookMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetTitle || !meetDate || !meetTime) return;

    addMeeting({
      title: meetTitle,
      date: meetDate,
      time: meetTime,
      duration: 30,
      invitees: [currentClient?.id || "client-1", "employee-1"],
      agenda: "Scheduled via Client Support Portal sync request.",
      notes: "Auto sync.",
      status: "Scheduled",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      isClientMeeting: true,
    });

    setMeetTitle("");
    setMeetDate("");
    setMeetTime("");
    setShowMeetModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="client-portal-container">
      {/* Client Identity Switcher Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-700 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md shadow-indigo-600/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <span className="px-2.5 py-0.5 bg-white/20 text-white font-mono text-[9px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1 w-fit">
            <Sparkles className="w-3 h-3" /> Client Portal Simulator
          </span>
          <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight">
            Acting Client Profile: <span className="underline decoration-indigo-300 underline-offset-4">{currentClient?.companyName}</span>
          </h1>
          <p className="text-xs text-indigo-100 max-w-md leading-relaxed">
            Review live project deliverables, settle pending bills via simulated payments gateway, and submit developer support tickets.
          </p>
        </div>

        {/* Client Picker Selector */}
        <div className="space-y-1 w-full md:w-auto shrink-0 relative z-10 text-xs">
          <label className="text-[10px] font-mono text-indigo-200 uppercase">Change Client Tenant View</label>
          <select
            value={clientPortalId}
            onChange={(e) => setClientPortalId(e.target.value)}
            className="w-full md:w-56 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold focus:outline-hidden border border-white/20 cursor-pointer"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id} className="text-gray-900">{c.companyName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Projects & Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 space-y-4">
            <h2 className="text-md font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Briefcase className="w-4.5 h-4.5 text-indigo-500" /> Linked Projects & Milestones
            </h2>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {clientProjects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-950/10 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{p.projectName}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">DEADLINE: {p.deadline} | Status: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{p.status}</span></p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      Health: {p.projectHealth}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-gray-500">
                      <span>SPRINT PROGRESS</span>
                      <span>{p.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 dark:bg-indigo-400 h-1.5 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>

                  {/* Milestones list */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800/60">
                    <p className="text-[10px] font-mono text-gray-400 uppercase">Target Milestones</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {p.milestones.map((m) => (
                        <div key={m.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-lg">
                          <CheckCircle className={`w-4 h-4 shrink-0 ${m.completed ? "text-emerald-500" : "text-gray-300"}`} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-gray-900 dark:text-white leading-tight">{m.title}</p>
                            <p className="text-[9px] text-gray-400 font-mono">DUE: {m.dueDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {clientProjects.length === 0 && (
                <p className="text-center py-12 text-gray-400 font-mono">No active software deliverables linked to this account.</p>
              )}
            </div>
          </div>

          {/* Settle Pending Invoices Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 space-y-4">
            <h2 className="text-md font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-4.5 h-4.5 text-indigo-500" /> Billing Ledger & Settle Balances
            </h2>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {clientInvoices.map((inv) => (
                <div key={inv.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 dark:text-white text-sm">{inv.invoiceNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-semibold uppercase ${
                        inv.status === "Paid"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200/40"
                          : "bg-amber-50 text-amber-600 border-amber-200/40 animate-pulse"
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-mono">BILLED ON: {inv.issueDate} | DUE ON: {inv.dueDate}</p>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between shrink-0 font-mono">
                    <div className="text-right">
                      <p className="text-gray-400 text-[10px]">TOTAL AMOUNT</p>
                      <p className="font-bold text-gray-900 dark:text-white text-md">{currencySymbol}{inv.total.toLocaleString()}</p>
                    </div>

                    {inv.status !== "Paid" ? (
                      <button
                        onClick={() => handlePayInvoice(inv.id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer text-xs flex items-center gap-1.5"
                      >
                        <CreditCard className="w-4 h-4" /> Pay Balance
                      </button>
                    ) : (
                      <span className="text-emerald-500 font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Paid</span>
                    )}
                  </div>
                </div>
              ))}

              {clientInvoices.length === 0 && (
                <p className="text-center py-12 text-gray-400 font-mono">No invoices issued to this account.</p>
              )}
            </div>
          </div>
        </div>

        {/* Support Tickets & Scheduled Syncs Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800/80 flex flex-col gap-2">
            <button
              onClick={() => setShowTicketModal(true)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-500/10"
            >
              <Plus className="w-4 h-4" /> Raise Help Ticket
            </button>
            <button
              onClick={() => setShowMeetModal(true)}
              className="w-full py-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Video className="w-4 h-4 text-blue-500" /> Book Review Sync
            </button>
          </div>

          {/* Support Tickets list */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 space-y-4">
            <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md flex items-center gap-1.5">
              <HelpCircle className="w-4.5 h-4.5 text-indigo-500" /> Active Support Tickets
            </h3>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 text-xs">
              {clientTickets.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-950/10 space-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">{t.title}</h4>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                      t.priority === "High" ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20" : "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                    }`}>{t.priority}</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-[11px] line-clamp-2">{t.description}</p>
                  <p className="text-[10px] text-gray-400 font-mono pt-1">Status: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{t.status}</span></p>
                </div>
              ))}

              {clientTickets.length === 0 && (
                <p className="text-center py-6 text-gray-400 font-mono">No open help desk queries.</p>
              )}
            </div>
          </div>

          {/* Scheduled Syncs */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 space-y-4">
            <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md flex items-center gap-1.5">
              <Video className="w-4.5 h-4.5 text-blue-500" /> Scheduled Video Sprints
            </h3>

            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 text-xs">
              {clientMeetings.map((m) => (
                <div key={m.id} className="p-3 rounded-lg border border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20 flex justify-between items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{m.title}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{m.date} @ {m.time}</p>
                  </div>
                  <a
                    href={m.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 shrink-0 border border-indigo-200/20 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}

              {clientMeetings.length === 0 && (
                <p className="text-center py-6 text-gray-400 font-mono">No virtual meetings scheduled.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Processing Dialog */}
      {payingInvoiceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden p-5 space-y-4 text-center">
            {isProcessingPay ? (
              <div className="py-6 space-y-3 flex flex-col items-center">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Connecting to Stripe Gateway...</p>
                <p className="text-xs text-gray-400 max-w-xs">Authorizing secure mock funds transfer, compiling Ledger logs.</p>
              </div>
            ) : payReceipt ? (
              <div className="py-6 space-y-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                <div className="space-y-1">
                  <h3 className="text-md font-display font-bold text-gray-900 dark:text-white">Bill Settled Successfully!</h3>
                  <p className="text-xs text-gray-400">Mock transaction cleared under AgencyOS payment protocols.</p>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-[11px] font-mono text-left w-full space-y-1">
                  <div className="flex justify-between"><span>RECEIPT:</span><span className="font-bold text-gray-900 dark:text-white">{payReceipt.receiptNumber}</span></div>
                  <div className="flex justify-between"><span>TRANSACTION ID:</span><span className="font-bold text-gray-900 dark:text-white">{payReceipt.transactionId}</span></div>
                  <div className="flex justify-between"><span>CLEARING METADATA:</span><span className="font-bold text-emerald-500">SETTLED</span></div>
                </div>

                <button
                  onClick={() => setPayingInvoiceId(null)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md">Configure Transaction</h3>
                
                <div className="space-y-3 text-left py-2">
                  <div className="space-y-1.5 text-xs">
                    <label className="text-[10px] font-mono text-gray-500 uppercase">Gateway Settlement Method</label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value)}
                      className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="Credit Card">Credit Card (Stripe)</option>
                      <option value="UPI / QR Code">UPI QR Code</option>
                      <option value="Bank Direct Ledger">Direct Corporate Wire</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setPayingInvoiceId(null)}
                    className="flex-1 py-2 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePayInvoice(payingInvoiceId)}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Authorize Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ticket form modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md">Raise Help Support Ticket</h3>
              <button onClick={() => setShowTicketModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleRaiseTicket} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Support Topic Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken dynamic links on Sandbox environment"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Priority urgency</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Low">Low (General Inquiry)</option>
                  <option value="Medium">Medium (Regular Issue)</option>
                  <option value="High">High (Blocking Incident)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Description Details</label>
                <textarea
                  required
                  placeholder="Provide logs, error codes, screenshots description..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  rows={3}
                  className="w-full text-sm p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Meet form modal */}
      {showMeetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md">Book Deliverable Review Sync</h3>
              <button onClick={() => setShowMeetModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleBookMeeting} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Review Agenda Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SLA milestone wireframes review"
                  value={meetTitle}
                  onChange={(e) => setMeetTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Target Date</label>
                  <input
                    type="date"
                    required
                    value={meetDate}
                    onChange={(e) => setMeetDate(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Target Time</label>
                  <input
                    type="time"
                    required
                    value={meetTime}
                    onChange={(e) => setMeetTime(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-all shadow-md cursor-pointer"
              >
                Book Sync review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
