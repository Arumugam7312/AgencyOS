/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Project } from "../types";
import {
  Search,
  Filter,
  Plus,
  Briefcase,
  Calendar,
  Clock,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  DollarSign,
  ChevronRight,
  MessageSquare,
  Paperclip,
  TrendingUp,
  X,
  UserPlus,
} from "lucide-react";

export const ProjectsView: React.FC = () => {
  const {
    projects,
    clients,
    employees,
    addProject,
    updateProject,
    addProjectComment,
    settings,
  } = useApp();

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProj, setSelectedProj] = useState<Project | null>(null);
  
  // Create / Edit modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [formData, setFormData] = useState<Partial<Project>>({
    projectName: "",
    clientId: "",
    description: "",
    budget: 0,
    deadline: "",
    priority: "Medium",
    status: "Planning",
    category: "Web App",
    assignedMembers: [],
    estimatedHours: 100,
    workedHours: 0,
  });

  const currencySymbol = settings.currency.split(" ")[1] || "$";

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const client = clients.find((c) => c.id === p.clientId);
      const matchSearch =
        p.projectName.toLowerCase().includes(search.toLowerCase()) ||
        (client?.companyName || "").toLowerCase().includes(search.toLowerCase());
      const matchPriority = priorityFilter === "all" || p.priority === priorityFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchPriority && matchStatus && matchCategory;
    });
  }, [projects, clients, search, priorityFilter, statusFilter, categoryFilter]);

  // Submit comments
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !selectedProj) return;
    addProjectComment(selectedProj.id, newComment);
    setNewComment("");
    // Re-sync local selection
    const fresh = projects.find((p) => p.id === selectedProj.id);
    if (fresh) setSelectedProj(fresh);
  };

  // Toggle single milestones
  const handleToggleMilestone = (project: Project, milestoneId: string) => {
    const updatedMilestones = project.milestones.map((ms) => {
      if (ms.id === milestoneId) {
        return { ...ms, completed: !ms.completed };
      }
      return ms;
    });

    // Re-calculate progress percentage based on completed milestones
    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

    const updated: Project = {
      ...project,
      milestones: updatedMilestones,
      progress,
      status: progress === 100 ? "Completed" : project.status,
    };

    updateProject(updated);
    setSelectedProj(updated);
  };

  // Add Project submit handler
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName || !formData.clientId) return;
    addProject({
      clientId: formData.clientId,
      projectName: formData.projectName,
      description: formData.description || "Project created inside the AgencyOS workspace",
      budget: Number(formData.budget) || 10000,
      deadline: formData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: (formData.priority as any) || "Medium",
      status: (formData.status as any) || "Planning",
      progress: 0,
      category: (formData.category as any) || "Web App",
      assignedMembers: formData.assignedMembers || ["employee-1"],
      milestones: [
        { id: `ms-1-${Date.now()}`, title: "Discovery and UX Prototypes", dueDate: "2026-08-01", completed: false },
        { id: `ms-2-${Date.now()}`, title: "Core Integration Tests & Sandbox Delivery", dueDate: "2026-08-25", completed: false },
      ],
      dependencies: [],
      activityTimeline: [],
      comments: [],
      attachments: [],
      estimatedHours: Number(formData.estimatedHours) || 80,
      workedHours: 0,
      projectHealth: "Healthy",
    });
    setFormData({
      projectName: "",
      clientId: "",
      description: "",
      budget: 0,
      deadline: "",
      priority: "Medium",
      status: "Planning",
      category: "Web App",
      assignedMembers: [],
      estimatedHours: 100,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6" id="projects-view-container">
      {/* Upper bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900 dark:text-white tracking-tight">
            Project Sprints
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Analyze {projects.length} accounts portfolios, schedule milestone checklists, and map teams logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer animate-pulse"
        >
          <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      {/* Query Bar */}
      <div className="p-4 rounded-xl glass-panel bg-white/70 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-sm focus:outline-hidden focus:border-indigo-500 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Testing">Testing</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Web App">Web App</option>
            <option value="Mobile App">Mobile App</option>
            <option value="Branding">Branding</option>
            <option value="SEO & Marketing">SEO & Marketing</option>
            <option value="Consulting">Consulting</option>
          </select>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.slice(0, 16).map((proj) => {
              const client = clients.find((c) => c.id === proj.clientId);
              
              // Status Styling
              const statusStyles = {
                "Planning": "bg-gray-100 text-gray-600 border-gray-200/50",
                "In Progress": "bg-indigo-50 text-indigo-600 border-indigo-200/30",
                "Review": "bg-purple-50 text-purple-600 border-purple-200/30",
                "Testing": "bg-blue-50 text-blue-600 border-blue-200/30",
                "Completed": "bg-emerald-50 text-emerald-600 border-emerald-200/30",
                "On Hold": "bg-amber-50 text-amber-600 border-amber-200/30",
              };

              const priorityStyles = {
                Low: "text-gray-500 bg-gray-100/50",
                Medium: "text-blue-500 bg-blue-100/50",
                High: "text-amber-500 bg-amber-100/50",
                Critical: "text-rose-500 bg-rose-100/50",
              };

              const healthColors = {
                Healthy: "bg-emerald-500",
                "At Risk": "bg-amber-500",
                Critical: "bg-rose-500",
              };

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSelectedProj(proj);
                    setTimeout(() => {
                      const element = document.getElementById("project-detail-sidebar");
                      if (element && window.innerWidth < 1024) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }, 100);
                  }}
                  className={`p-5 rounded-2xl border bg-white/70 dark:bg-gray-900/40 shadow-xs flex flex-col justify-between gap-4 transition-all hover:scale-[1.01] hover:border-indigo-400 cursor-pointer ${
                    selectedProj?.id === proj.id ? "border-indigo-500 ring-1 ring-indigo-500" : "border-gray-200/50 dark:border-gray-800/80"
                  }`}
                >
                  {/* Top metadata */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${statusStyles[proj.status]}`}>
                        {proj.status}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${healthColors[proj.projectHealth]}`} />
                        <span className="text-[10px] font-mono text-gray-400 font-semibold">{proj.projectHealth.toUpperCase()}</span>
                      </div>
                    </div>

                    <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md tracking-tight leading-tight pt-1 truncate">
                      {proj.projectName}
                    </h3>
                    <p className="text-[10px] font-mono text-gray-400 font-medium truncate">Client: {client?.companyName || "N/A"}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-gray-400">Completion</span>
                      <span className="font-bold text-gray-900 dark:text-white">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Bottom Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-gray-100 dark:border-gray-800/80 pt-3">
                    <div className="space-y-0.5">
                      <span className="text-gray-400 font-mono">BUDGET</span>
                      <p className="font-bold text-gray-900 dark:text-white">{currencySymbol}{proj.budget.toLocaleString()}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <span className="text-gray-400 font-mono">DEADLINE</span>
                      <p className="font-bold text-gray-900 dark:text-white">{proj.deadline}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed drawer right side panel */}
        <div className="lg:col-span-1" id="project-detail-sidebar">
          {selectedProj ? (
            <div className="p-5 rounded-2xl border border-indigo-200/40 dark:border-gray-800/80 bg-white/70 dark:bg-gray-900/40 space-y-5 shadow-xs sticky top-4 animate-in slide-in-from-right duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md">
                    {selectedProj.projectName}
                  </h3>
                  <p className="text-[10px] font-mono text-gray-400 mt-1">Category: {selectedProj.category}</p>
                </div>
                <button
                  onClick={() => setSelectedProj(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Milestones checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-indigo-500" /> Milestone Sprints
                </h4>

                <div className="space-y-2">
                  {selectedProj.milestones.map((ms) => (
                    <div
                      key={ms.id}
                      onClick={() => handleToggleMilestone(selectedProj, ms.id)}
                      className="flex items-center gap-2.5 p-2 rounded-lg border border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-950/20 cursor-pointer hover:bg-gray-100/30 text-xs font-medium"
                    >
                      <input
                        type="checkbox"
                        readOnly
                        checked={ms.completed}
                        className="rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`truncate text-gray-900 dark:text-white ${ms.completed ? "line-through text-gray-400" : ""}`}>
                          {ms.title}
                        </p>
                        <p className="text-[9px] text-gray-400 font-mono">Target: {ms.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments Stream */}
              <div className="space-y-3 border-t border-gray-100 dark:border-gray-800/80 pt-4">
                <h4 className="text-xs font-mono text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-500" /> Comments Board
                </h4>

                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                  {selectedProj.comments.map((com) => (
                    <div key={com.id} className="bg-gray-100/40 dark:bg-gray-950/10 p-2.5 rounded-lg border border-gray-50 dark:border-gray-800/60 text-xs">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-gray-900 dark:text-white">
                        <span>{com.user}</span>
                        <span className="font-mono text-gray-400">{com.timestamp}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed text-[11px]">{com.text}</p>
                    </div>
                  ))}
                  {selectedProj.comments.length === 0 && (
                    <p className="text-center py-4 text-gray-400 font-mono text-[11px]">No feedback left on this project.</p>
                  )}
                </div>

                {/* Comment input Form */}
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ask questions or upload design wireframes..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-xs focus:outline-hidden text-gray-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md text-xs transition-all cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
              <Briefcase className="w-8 h-8 text-gray-300" />
              <p className="font-display font-medium text-sm">Select Active Project</p>
              <p className="text-xs max-w-[200px]">Query full project lists then click to toggle completed milestones, comment streams and budgets.</p>
            </div>
          )}
        </div>
      </div>

      {/* Creation Modal overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md">Initialize New Project Sprint</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 max-h-[480px] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Project Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Billing Dashboard"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Client Owner</label>
                  <select
                    required
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">Select client...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Web App">Web App</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Branding">Branding</option>
                    <option value="SEO & Marketing">SEO & Marketing</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Budget ({currencySymbol})</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15000"
                    value={formData.budget || ""}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Deadline</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Estimated Hours</label>
                  <input
                    type="number"
                    placeholder="e.g. 120"
                    value={formData.estimatedHours || ""}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Project Description Scope</label>
                  <textarea
                    required
                    placeholder="Write a brief overview of deliverables, tech stack, and timeline..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-sm p-3.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-all shadow-md cursor-pointer"
              >
                Schedule Project Deliverable
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
