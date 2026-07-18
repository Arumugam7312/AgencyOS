/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { FileItem } from "../types";
import {
  Folder,
  File,
  Plus,
  Search,
  Download,
  Trash,
  ChevronRight,
  HardDrive,
  Upload,
  FileText,
  Briefcase,
  X,
  AlertCircle,
} from "lucide-react";

export const FilesView: React.FC = () => {
  const { files, addFile, deleteFile, projects } = useApp();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dragOver, setDragOver] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("SLA & Contracts");
  const [size, setSize] = useState("2.4 MB");
  const [projectId, setProjectId] = useState("");

  const filteredFiles = files.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || f.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addFile({
      name,
      category,
      size: size || "1.2 MB",
      dateUploaded: new Date().toISOString().split("T")[0],
      uploadedBy: "Admin Owner",
      url: "#",
    });

    // Reset Form
    setName("");
    setCategory("SLA & Contracts");
    setSize("2.4 MB");
    setProjectId("");
    setShowUploadModal(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const firstFile = droppedFiles[0];
      const fileSizeStr = firstFile.size > 1024 * 1024
        ? `${(firstFile.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(firstFile.size / 1024).toFixed(0)} KB`;
      
      setName(firstFile.name);
      setSize(fileSizeStr);
      setCategory("SLA & Contracts");
      setShowUploadModal(true);
    }
  };

  return (
    <div className="space-y-6" id="files-view-container">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900 dark:text-white tracking-tight">
            Document Vault
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Store SLAs, invoices, contracts, responsive wireframes, and secure assets folder hierarchies.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="vault-metrics">
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-gray-400 block uppercase">TOTAL DOCUMENTS</span>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{files.length} Vault Files</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 flex items-center justify-center"><Folder className="w-5 h-5" /></div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-gray-400 block uppercase">CONTRACTS & SLAS</span>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
              {files.filter((f) => f.category === "SLA & Contracts").length} Signed
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center"><FileText className="w-5 h-5" /></div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-gray-400 block uppercase">VAULT STORAGE</span>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">45.2 MB / 10 GB</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-500 flex items-center justify-center"><HardDrive className="w-5 h-5" /></div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-gray-400 block uppercase">SECURE PROTOCOLS</span>
            <p className="text-lg font-bold text-emerald-500 mt-1">AES-256 Bit</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center"><AlertCircle className="w-5 h-5" /></div>
        </div>
      </div>

      {/* Drag & Drop Canvas Panel */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-6 border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center text-center gap-2 ${
          dragOver
            ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-600"
            : "border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/10 text-gray-400"
        }`}
      >
        <Upload className={`w-8 h-8 transition-transform ${dragOver ? "scale-110 text-indigo-500" : "text-gray-300"}`} />
        <div>
          <p className="text-xs font-semibold text-gray-900 dark:text-white">
            Drag & drop document directly here or click Upload button to compile.
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Supports PDF, XLS, Figma JSON, and images up to 50MB</p>
        </div>
      </div>

      {/* Query Bar */}
      <div className="p-4 rounded-xl glass-panel bg-white/70 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search filenames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-sm focus:outline-hidden focus:border-indigo-500 text-gray-900 dark:text-white"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white focus:outline-hidden cursor-pointer font-medium"
        >
          <option value="all">All Vault Folders</option>
          <option value="SLA & Contracts">SLA & Contracts</option>
          <option value="Invoices & Finance">Invoices & Finance</option>
          <option value="Deliverables & Assets">Deliverables & Assets</option>
          <option value="General Templates">General Templates</option>
        </select>
      </div>

      {/* Grid List of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="document-grid">
        {filteredFiles.map((f) => (
          <div
            key={f.id}
            className="p-4 rounded-xl bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 hover:border-indigo-200/50 dark:hover:border-gray-700/60 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-500 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate" title={f.name}>{f.name}</h4>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{f.category}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-[10px] font-mono text-gray-400">
              <div className="space-y-0.5">
                <p>SIZE: {f.size}</p>
                <p>DATE: {f.dateUploaded}</p>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => alert(`Downloading file: ${f.name}`)}
                  className="p-1.5 rounded bg-gray-50 hover:bg-gray-100 dark:bg-gray-950/40 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all cursor-pointer border border-gray-100 dark:border-gray-800"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteFile(f.id)}
                  className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-500 dark:bg-rose-950/20 dark:hover:bg-rose-900/40 transition-all cursor-pointer border border-rose-200/20"
                  title="Remove Document"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredFiles.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 font-mono border border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
            No secure vault documents matching selected category tags.
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in duration-150">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md">Onboard Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Document/Filename</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solaris_Project_SLA_signed.pdf"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase">Vault Folder / Folder</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white cursor-pointer"
                  >
                    <option value="SLA & Contracts">SLA & Contracts</option>
                    <option value="Invoices & Finance">Invoices & Finance</option>
                    <option value="Deliverables & Assets">Deliverables & Assets</option>
                    <option value="General Templates">General Templates</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase">Document FileSize</label>
                  <input
                    type="text"
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Link Parent Sprint / Project</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white cursor-pointer"
                >
                  <option value="">None / General</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.projectName}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-all shadow-md cursor-pointer animate-in fade-in zoom-in duration-150"
              >
                Upload & Seal Inside AES Vault
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
