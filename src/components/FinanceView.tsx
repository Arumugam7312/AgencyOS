/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Invoice, InvoiceItem } from "../types";
import {
  DollarSign,
  TrendingUp,
  FileText,
  Plus,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  CreditCard,
  Download,
  Percent,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";

export const FinanceView: React.FC = () => {
  const {
    invoices,
    payments,
    clients,
    addInvoice,
    updateInvoice,
    settings,
  } = useApp();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);

  // New Invoice Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [clientId, setClientId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-2026-${1000 + invoices.length + 1}`);
  const [taxRate, setTaxRate] = useState(settings.gstRate);
  const [discountRate, setDiscountRate] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  
  // Dynamic Items Builder for Invoice
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "item-1", description: "Production Deployment Sprint", quantity: 1, unitPrice: 4500, amount: 4500 },
  ]);
  const [newDesc, setNewDesc] = useState("");
  const [newQty, setNewQty] = useState(1);
  const [newPrice, setNewPrice] = useState(0);

  const currencySymbol = settings.currency.split(" ")[1] || "$";

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const client = clients.find((c) => c.id === inv.clientId);
      const matchSearch =
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        (client?.companyName || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, clients, search, statusFilter]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalBilled = invoices.reduce((acc, i) => acc + i.total, 0);
    const totalCollected = payments.filter((p) => p.status === "Success").reduce((acc, p) => acc + p.amount, 0);
    const totalOutstanding = invoices.filter((i) => i.status === "Sent" || i.status === "Overdue").reduce((acc, i) => acc + i.total, 0);
    const totalDrafts = invoices.filter((i) => i.status === "Draft").reduce((acc, i) => acc + i.total, 0);
    return { totalBilled, totalCollected, totalOutstanding, totalDrafts };
  }, [invoices, payments]);

  // Item helpers
  const handleAddItem = () => {
    if (!newDesc || newPrice <= 0) return;
    const itemAmt = newQty * newPrice;
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: newDesc,
        quantity: newQty,
        unitPrice: newPrice,
        amount: itemAmt,
      },
    ]);
    setNewDesc("");
    setNewQty(1);
    setNewPrice(0);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((itm) => itm.id !== id));
  };

  const currentSubtotal = useMemo(() => {
    return items.reduce((acc, itm) => acc + itm.amount, 0);
  }, [items]);

  const currentTotal = useMemo(() => {
    const tax = currentSubtotal * (taxRate / 100);
    const discount = currentSubtotal * (discountRate / 100);
    return Math.round(currentSubtotal + tax - discount);
  }, [currentSubtotal, taxRate, discountRate]);

  // Submit Invoice Creation
  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || items.length === 0) return;

    addInvoice({
      invoiceNumber,
      clientId,
      items,
      taxRate: Number(taxRate),
      discountRate: Number(discountRate),
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Sent",
      notes: notes || "Terms: Net 15 days from issue date.",
    });

    // Reset Form
    setClientId("");
    setInvoiceNumber(`INV-2026-${1000 + invoices.length + 2}`);
    setTaxRate(settings.gstRate);
    setDiscountRate(0);
    setNotes("");
    setItems([{ id: "item-1", description: "Production Deployment Sprint", quantity: 1, unitPrice: 4500, amount: 4500 }]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6" id="finance-view-container">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900 dark:text-white tracking-tight">
            Billing & Invoices
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track customer payments ledger, audit tax streams, and generate corporate invoices.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Generate Invoice
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="billing-stats-row">
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-gray-400 block uppercase">TOTAL BILLED</span>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{currencySymbol}{stats.totalBilled.toLocaleString()}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 flex items-center justify-center"><FileText className="w-5 h-5" /></div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-gray-400 block uppercase">TOTAL COLLECTED</span>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{currencySymbol}{stats.totalCollected.toLocaleString()}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center"><CheckCircle className="w-5 h-5" /></div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-gray-400 block uppercase">OUTSTANDING OUT</span>
            <p className="text-lg font-bold text-amber-500 mt-1">{currencySymbol}{stats.totalOutstanding.toLocaleString()}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center"><Clock className="w-5 h-5" /></div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-gray-400 block uppercase">DRAFTS RETAINED</span>
            <p className="text-lg font-bold text-gray-500 dark:text-gray-400 mt-1">{currencySymbol}{stats.totalDrafts.toLocaleString()}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-950/30 text-gray-400 flex items-center justify-center"><Receipt className="w-5 h-5" /></div>
        </div>
      </div>

      {/* Query Bar */}
      <div className="p-4 rounded-xl glass-panel bg-white/70 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoice numbers or client companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-sm focus:outline-hidden focus:border-indigo-500 text-gray-900 dark:text-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white focus:outline-hidden cursor-pointer font-medium"
        >
          <option value="all">All Invoice Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Sent">Sent</option>
          <option value="Overdue">Overdue</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Main invoices grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800/80 bg-white/50 dark:bg-gray-950/20 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] font-mono text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/40">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  {filteredInvoices.map((inv) => {
                    const client = clients.find((c) => c.id === inv.clientId);
                    
                    const statusStyles = {
                      Paid: "bg-emerald-50 text-emerald-600 border-emerald-200/30 dark:bg-emerald-950/40 dark:text-emerald-400",
                      Sent: "bg-indigo-50 text-indigo-600 border-indigo-200/30 dark:bg-indigo-950/40 dark:text-indigo-400",
                      Overdue: "bg-rose-50 text-rose-600 border-rose-200/30 dark:bg-rose-950/40 dark:text-rose-400",
                      Draft: "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-900 dark:text-gray-400",
                    };

                    return (
                      <tr
                        key={inv.id}
                        onClick={() => setSelectedInv(inv)}
                        className={`hover:bg-gray-50/50 dark:hover:bg-gray-900/20 cursor-pointer transition-all ${
                          selectedInv?.id === inv.id ? "bg-indigo-50/30 dark:bg-indigo-950/10" : ""
                        }`}
                      >
                        <td className="py-4 px-4 font-mono font-bold text-gray-900 dark:text-white">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                          <p className="font-semibold">{client?.companyName || "N/A"}</p>
                          <p className="text-[10px] text-gray-400 font-mono">Contact: {client?.contactPerson}</p>
                        </td>
                        <td className="py-4 px-4 font-mono text-gray-400">
                          {inv.issueDate}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-gray-900 dark:text-white">
                          {currencySymbol}{inv.total.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${statusStyles[inv.status]}`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400 font-mono">
                        No financial logs found matching selected search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected flyout/Invoice detailing drawer */}
        <div className="lg:col-span-1">
          {selectedInv ? (
            <div className="p-5 rounded-2xl border border-indigo-200/40 dark:border-gray-800/80 bg-white/70 dark:bg-gray-900/40 space-y-5 shadow-xs sticky top-4 animate-in slide-in-from-right duration-150 text-xs">
              <div className="flex justify-between items-start pb-3 border-b border-gray-100 dark:border-gray-800/80">
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md">
                    {selectedInv.invoiceNumber}
                  </h3>
                  <p className="text-[10px] font-mono text-gray-400 mt-1">DUEDATE: {selectedInv.dueDate}</p>
                </div>
                <button
                  onClick={() => setSelectedInv(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Company Info */}
              <div className="space-y-1">
                <p className="text-[9px] font-mono text-gray-400 uppercase">BILLED TO</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {clients.find((c) => c.id === selectedInv.clientId)?.companyName}
                </p>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  {clients.find((c) => c.id === selectedInv.clientId)?.address}
                </p>
              </div>

              {/* Items List inside flyout */}
              <div className="space-y-2">
                <p className="text-[9px] font-mono text-gray-400 uppercase">INVOICE LINE ITEMS</p>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {selectedInv.items.map((itm, i) => (
                    <div key={itm.id || i} className="p-2.5 rounded-lg border border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/20 flex justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-gray-900 dark:text-white font-medium">{itm.description}</p>
                        <p className="text-[10px] text-gray-400 font-mono">Qty: {itm.quantity} x {currencySymbol}{itm.unitPrice}</p>
                      </div>
                      <span className="font-mono font-bold text-gray-900 dark:text-white shrink-0 mt-0.5">{currencySymbol}{itm.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtotal calculations */}
              <div className="border-t border-gray-100 dark:border-gray-800/80 pt-3 space-y-1.5 text-[11px] font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>SUBTOTAL</span>
                  <span>{currencySymbol}{selectedInv.subtotal.toLocaleString()}</span>
                </div>
                {selectedInv.taxRate > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>GST ({selectedInv.taxRate}%)</span>
                    <span>+{currencySymbol}{Math.round(selectedInv.subtotal * (selectedInv.taxRate / 100)).toLocaleString()}</span>
                  </div>
                )}
                {selectedInv.discountRate > 0 && (
                  <div className="flex justify-between text-rose-500">
                    <span>DISCOUNT (-{selectedInv.discountRate}%)</span>
                    <span>-{currencySymbol}{Math.round(selectedInv.subtotal * (selectedInv.discountRate / 100)).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-900 dark:text-white font-bold text-sm pt-1.5 border-t border-dashed border-gray-100 dark:border-gray-800">
                  <span>TOTAL DUE</span>
                  <span>{currencySymbol}{selectedInv.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-800/80">
                <button
                  onClick={() => alert("Simulated download of PDF Invoice complete!")}
                  className="flex-1 py-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                {selectedInv.status === "Sent" && (
                  <button
                    onClick={() => alert("Payment links triggered. Client representative notified via SMTP.")}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shadow-indigo-500/15"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Remind Client
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center text-center text-gray-400 space-y-2 animate-pulse">
              <Receipt className="w-8 h-8 text-gray-300" />
              <p className="font-display font-medium text-sm">Select Active Invoice</p>
              <p className="text-xs max-w-[200px]">Click any invoice line inside the ledger grid to flyout line items, tax details, and payments.</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Generator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md">Generate Corporate Invoice</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSubmitInvoice} className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase">Customer Client</label>
                  <select
                    required
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">Select Account...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase">Invoice Identifier</label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase">Payment Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase">GST Rate (%)</label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase">Discount (%)</label>
                    <input
                      type="number"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(Number(e.target.value))}
                      className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Line Items Builder */}
              <div className="space-y-2 border-t border-gray-100 dark:border-gray-800/80 pt-3">
                <label className="text-[10px] font-mono text-gray-500 uppercase block">Line Items Compiler</label>
                
                {/* List current compiled items */}
                <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                  {items.map((itm) => (
                    <div key={itm.id} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-xs flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{itm.description}</p>
                        <p className="text-[10px] font-mono text-gray-400">{itm.quantity} x {currencySymbol}{itm.unitPrice}</p>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="font-bold text-gray-900 dark:text-white">{currencySymbol}{itm.amount}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(itm.id)}
                          className="text-rose-500 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adding Row Form */}
                <div className="p-2.5 rounded-lg border border-dashed border-gray-200 dark:border-gray-800 flex flex-wrap gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Deliverable description..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="flex-1 min-w-[140px] px-2.5 py-1 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-14 px-1 py-1 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Rate ($)"
                    value={newPrice || ""}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-24 px-1 py-1 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-bold rounded cursor-pointer text-gray-800 dark:text-white text-xs"
                  >
                    Add Row
                  </button>
                </div>
              </div>

              {/* Note details */}
              <div className="space-y-1 border-t border-gray-100 dark:border-gray-800/80 pt-3">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Terms & Notes</label>
                <input
                  type="text"
                  placeholder="Terms: Net 15 days from issue date."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              {/* Real-time Subtotal display */}
              <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-lg flex justify-between items-center text-xs border border-gray-100 dark:border-gray-800 font-mono">
                <span className="text-gray-400">ESTIMATED TOTAL (INC TAX/DISCOUNT)</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{currencySymbol}{currentTotal.toLocaleString()}</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-all shadow-md cursor-pointer"
              >
                Assemble & Issue Corporate Invoice
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
