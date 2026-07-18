/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Client } from "../types";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Globe,
  Building,
  Tag,
  FileText,
  DollarSign,
  ChevronRight,
  Folder,
  ArrowRight,
  Edit2,
  X,
  PlusCircle,
  HelpCircle,
} from "lucide-react";

export const CrmView: React.FC = () => {
  const {
    clients,
    projects,
    invoices,
    payments,
    contracts,
    files,
    addClient,
    updateClient,
    settings,
  } = useApp();

  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [detailTab, setDetailTab] = useState<"projects" | "billing" | "contracts" | "notes">("projects");

  // Edit / Add Client forms
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({
    companyName: "",
    industry: "Software",
    website: "",
    gstNumber: "",
    address: "",
    contactPerson: "",
    phone: "",
    email: "",
    status: "Lead",
    notes: "",
    tags: [],
  });

  const currencySymbol = settings.currency.split(" ")[1] || "$";

  // Client filtering
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        c.companyName.toLowerCase().includes(search.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchIndustry = industryFilter === "all" || c.industry === industryFilter;
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchIndustry && matchStatus;
    });
  }, [clients, search, industryFilter, statusFilter]);

  // Pagination (8 items per page)
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(start, start + itemsPerPage);
  }, [filteredClients, currentPage]);

  const uniqueIndustries = useMemo(() => {
    return Array.from(new Set(clients.map((c) => c.industry)));
  }, [clients]);

  // Selected client detail summaries
  const clientProjects = useMemo(() => {
    if (!selectedClient) return [];
    return projects.filter((p) => p.clientId === selectedClient.id);
  }, [projects, selectedClient]);

  const clientInvoices = useMemo(() => {
    if (!selectedClient) return [];
    return invoices.filter((i) => i.clientId === selectedClient.id);
  }, [invoices, selectedClient]);

  const clientPayments = useMemo(() => {
    if (!selectedClient) return [];
    return payments.filter((p) => p.clientId === selectedClient.id);
  }, [payments, selectedClient]);

  const clientFiles = useMemo(() => {
    if (!selectedClient) return [];
    // Filter folders or files matching client metadata or project references
    const linkedProjIds = clientProjects.map((p) => p.id);
    return files.filter(
      (f) => f.name.toLowerCase().includes(selectedClient.companyName.split(" ")[0].toLowerCase())
    );
  }, [files, selectedClient, clientProjects]);

  // Submit handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient({
      companyName: formData.companyName || "New Enterprise",
      logo: "from-blue-500 to-indigo-600",
      industry: formData.industry || "Software",
      website: formData.website || "https://www.example.com",
      gstNumber: formData.gstNumber || "27AAACZ0000A1Z1",
      address: formData.address || "Main Corporate Tech Road",
      contactPerson: formData.contactPerson || "Lead Manager",
      phone: formData.phone || "+91 99999 00000",
      email: formData.email || "hello@example.com",
      status: formData.status as any || "Lead",
      notes: formData.notes || "",
      tags: formData.tags || ["New-Client"],
    });
    setFormData({
      companyName: "",
      industry: "Software",
      website: "",
      gstNumber: "",
      address: "",
      contactPerson: "",
      phone: "",
      email: "",
      status: "Lead",
      notes: "",
      tags: [],
    });
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient) {
      const updated: Client = {
        ...selectedClient,
        companyName: formData.companyName || selectedClient.companyName,
        industry: formData.industry || selectedClient.industry,
        website: formData.website || selectedClient.website,
        gstNumber: formData.gstNumber || selectedClient.gstNumber,
        address: formData.address || selectedClient.address,
        contactPerson: formData.contactPerson || selectedClient.contactPerson,
        phone: formData.phone || selectedClient.phone,
        email: formData.email || selectedClient.email,
        status: (formData.status as any) || selectedClient.status,
        notes: formData.notes || selectedClient.notes,
      };
      updateClient(updated);
      setSelectedClient(updated);
      setShowEditModal(false);
    }
  };

  const openEdit = (client: Client) => {
    setFormData({
      companyName: client.companyName,
      industry: client.industry,
      website: client.website,
      gstNumber: client.gstNumber,
      address: client.address,
      contactPerson: client.contactPerson,
      phone: client.phone,
      email: client.email,
      status: client.status,
      notes: client.notes,
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6" id="crm-view-container">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900 dark:text-white tracking-tight">
            Client Relations (CRM)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Browse and query {clients.length} registered accounts, track invoices, and map deliverable progress.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Register Client
        </button>
      </div>

      {/* Query Bar */}
      <div className="p-4 rounded-xl glass-panel bg-white/70 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search company, contact person or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-sm focus:outline-hidden focus:border-indigo-500 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Industry filter */}
          <select
            value={industryFilter}
            onChange={(e) => {
              setIndustryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Industries</option>
            {uniqueIndustries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Lead">Lead</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Grid / Splitted Detailed Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core clients list table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800/80 bg-white/50 dark:bg-gray-950/20 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] font-mono text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/40">
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Primary Contact</th>
                    <th className="py-3 px-4">Industry</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  {paginatedClients.map((client) => {
                    const statusColors = {
                      Active: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/30",
                      Lead: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/30",
                      Inactive: "bg-gray-100 text-gray-600 dark:bg-gray-900/60 dark:text-gray-400 border-gray-200/20",
                    };

                    return (
                      <tr
                        key={client.id}
                        onClick={() => {
                          setSelectedClient(client);
                          setDetailTab("projects");
                          setTimeout(() => {
                            const element = document.getElementById("client-detail-sidebar");
                            if (element && window.innerWidth < 1024) {
                              element.scrollIntoView({ behavior: "smooth", block: "start" });
                            }
                          }, 100);
                        }}
                        className={`hover:bg-gray-50/50 dark:hover:bg-gray-900/20 cursor-pointer transition-all ${
                          selectedClient?.id === client.id ? "bg-indigo-50/30 dark:bg-indigo-950/10" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 font-medium text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${client.logo} flex items-center justify-center text-white text-xs font-semibold uppercase font-display shrink-0`}>
                              {client.companyName.charAt(0)}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white truncate">{client.companyName}</p>
                              <p className="text-[10px] font-mono text-gray-400 truncate">{client.website}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400">
                          <p className="font-semibold">{client.contactPerson}</p>
                          <p className="text-[10px] font-mono text-gray-400">{client.email}</p>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">{client.industry}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${statusColors[client.status]}`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClient(client);
                              openEdit(client);
                            }}
                            className="p-1 rounded-md text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {paginatedClients.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-500 font-mono">
                        No client profiles found matching selected query criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center text-xs font-mono text-gray-500">
              <span>Showing Page {currentPage} of {totalPages} ({filteredClients.length} clients)</span>
              <div className="flex gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-800 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-800 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detailed flyout information sidebar (Active selection) */}
        <div className="lg:col-span-1" id="client-detail-sidebar">
          {selectedClient ? (
            <div className="p-5 rounded-xl border border-indigo-200/40 dark:border-gray-800/80 bg-white/70 dark:bg-gray-900/40 space-y-5 shadow-xs sticky top-4 animate-in fade-in duration-150">
              {/* Client Profile Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${selectedClient.logo} flex items-center justify-center text-white font-display font-bold text-lg`}>
                    {selectedClient.companyName.charAt(0)}
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md leading-tight">
                      {selectedClient.companyName}
                    </h3>
                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">GST ID: {selectedClient.gstNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* CRM Client stats pills */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 bg-gray-50 dark:bg-gray-950/40 rounded-lg border border-gray-100 dark:border-gray-800/80">
                  <span className="text-[10px] text-gray-400 block font-mono">LINKED PROJECTS</span>
                  <span className="font-bold text-gray-900 dark:text-white text-md">{clientProjects.length} Sprints</span>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-950/40 rounded-lg border border-gray-100 dark:border-gray-800/80">
                  <span className="text-[10px] text-gray-400 block font-mono">TOTAL BILLING</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-md">
                    {currencySymbol}{Math.round(clientInvoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.total, 0) / 1000)}k
                  </span>
                </div>
              </div>

              {/* Sub tabs in detail panel */}
              <div className="flex border-b border-gray-100 dark:border-gray-800 text-[11px] font-mono">
                {(["projects", "billing", "contracts", "notes"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab)}
                    className={`flex-1 pb-2 font-bold uppercase transition-all capitalize border-b-2 cursor-pointer ${
                      detailTab === tab
                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                        : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Outputs */}
              <div className="max-h-[300px] overflow-y-auto pr-1 text-xs text-gray-600 dark:text-gray-400 space-y-3">
                {detailTab === "projects" && (
                  <div className="space-y-2">
                    {clientProjects.map((proj) => (
                      <div key={proj.id} className="p-2.5 rounded-lg border border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-950/10">
                        <div className="flex justify-between items-center font-semibold text-gray-900 dark:text-white">
                          <p className="truncate pr-2">{proj.projectName}</p>
                          <span className="font-mono text-[10px]">{proj.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-800 h-1 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-indigo-600 dark:bg-indigo-400 h-1 rounded-full" style={{ width: `${proj.progress}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono mt-1">Health: <span className="text-emerald-500 font-bold">{proj.projectHealth}</span> | Budget: {currencySymbol}{proj.budget}</p>
                      </div>
                    ))}
                    {clientProjects.length === 0 && <p className="text-center py-6 text-gray-400 font-mono">No active projects linked.</p>}
                  </div>
                )}

                {detailTab === "billing" && (
                  <div className="space-y-2.5">
                    {clientInvoices.slice(0, 3).map((inv) => (
                      <div key={inv.id} className="flex justify-between items-center p-2 rounded-lg border border-gray-50 dark:border-gray-800 bg-gray-100/30 dark:bg-gray-950/10">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{inv.invoiceNumber}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{inv.issueDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">{currencySymbol}{inv.total}</p>
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${inv.status === "Paid" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>{inv.status}</span>
                        </div>
                      </div>
                    ))}
                    {clientInvoices.length === 0 && <p className="text-center py-6 text-gray-400 font-mono">No invoices issued.</p>}
                  </div>
                )}

                {detailTab === "contracts" && (
                  <div className="space-y-2">
                    {clientFiles.slice(0, 4).map((file) => (
                      <div key={file.id} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 dark:border-gray-800/60">
                        <Folder className="w-4 h-4 text-blue-500 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-gray-900 dark:text-white font-medium">{file.name}</p>
                          <p className="text-[9px] text-gray-400 font-mono">{file.size} | {file.dateUploaded}</p>
                        </div>
                      </div>
                    ))}
                    {clientFiles.length === 0 && <p className="text-center py-6 text-gray-400 font-mono">No contract docs uploaded.</p>}
                  </div>
                )}

                {detailTab === "notes" && (
                  <div className="space-y-2 font-sans">
                    <p className="bg-gray-50 dark:bg-gray-950/20 p-3 rounded-lg border border-gray-100 dark:border-gray-800 text-[11px] leading-relaxed italic">
                      {selectedClient.notes || "No account logs recorded yet. Create an inline edit to record account profiles."}
                    </p>
                    <div className="space-y-1 pt-2">
                      <p className="text-[10px] font-mono text-gray-400 uppercase">Registered Contact Details</p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-700 dark:text-gray-300">
                        <Mail className="w-3.5 h-3.5 text-gray-400" /> {selectedClient.email}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-700 dark:text-gray-300 mt-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" /> {selectedClient.phone}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
              <Building className="w-8 h-8 text-gray-300" />
              <p className="font-display font-medium text-sm">Select Client Account</p>
              <p className="text-xs max-w-[200px]">Click any client card in the catalog to flyout real-time billing audits and logs.</p>
            </div>
          )}
        </div>
      </div>

      {/* Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md">Register New Client Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 max-h-[480px] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corporation"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Software">Software</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Edtech">Edtech</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">GST Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 27AAACZ1000A1Z1"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. billing@acme.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 99999 99999"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Company Website</label>
                  <input
                    type="text"
                    placeholder="e.g. https://www.acme.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Primary Address</label>
                  <input
                    type="text"
                    placeholder="Suite 100, Corporate Towers"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Account Notes</label>
                  <textarea
                    placeholder="Enter any initial client notes..."
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full text-sm p-3.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-all shadow-md cursor-pointer"
              >
                Onboard Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Editing Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md">Modify Account Settings</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 max-h-[480px] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Software">Software</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Edtech">Edtech</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Lead">Lead</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">GST REG</label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Internal Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full text-sm p-3.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-all shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
