/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import {
  Briefcase,
  CheckSquare,
  Users,
  Award,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export const ManagerDashboard: React.FC = () => {
  const {
    clients,
    projects,
    tasks,
    employees,
    addProject,
    addTask,
    addNotification,
    setActiveTab,
  } = useApp();

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Form States for quick additions
  const [newProjName, setNewProjName] = useState("");
  const [newProjClient, setNewProjClient] = useState("");
  const [newProjBudget, setNewProjBudget] = useState("");
  const [newProjHours, setNewProjHours] = useState("");
  const [newProjPriority, setNewProjPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProj, setNewTaskProj] = useState("");
  const [newTaskAssigned, setNewTaskAssigned] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"Low" | "Medium" | "High">("Medium");

  // Filter Lists
  const activeProjects = useMemo(() => {
    return projects.filter((p) => p.status !== "Completed");
  }, [projects]);

  const activeTasks = useMemo(() => {
    return tasks.filter((t) => t.status !== "Completed");
  }, [tasks]);

  // Overall Velocity
  const sprintVelocity = useMemo(() => {
    if (activeProjects.length === 0) return 100;
    const totalProgress = activeProjects.reduce((sum, p) => sum + p.progress, 0);
    return Math.round(totalProgress / activeProjects.length);
  }, [activeProjects]);

  const atRiskMilestonesCount = useMemo(() => {
    return activeProjects.filter((p) => p.projectHealth === "At Risk" || p.projectHealth === "Critical").length;
  }, [activeProjects]);

  // Team capacity index
  const teamAllocationList = useMemo(() => {
    return employees.map((emp) => {
      const assignedTasks = tasks.filter((t) => t.assignedTo === emp.id && t.status !== "Completed");
      let workload: "Optimal" | "High" | "Overloaded" = "Optimal";
      if (assignedTasks.length > 3) workload = "Overloaded";
      else if (assignedTasks.length >= 2) workload = "High";
      return {
        ...emp,
        activeTasksCount: assignedTasks.length,
        workload,
      };
    }).slice(0, 5); // top 5
  }, [employees, tasks]);

  const upcomingMilestones = useMemo(() => {
    const list: { id: string; projectTitle: string; title: string; dueDate: string; completed: boolean }[] = [];
    activeProjects.forEach((p) => {
      p.milestones.forEach((m) => {
        if (!m.completed) {
          list.push({
            id: m.id,
            projectTitle: p.projectName,
            title: m.title,
            dueDate: m.dueDate,
            completed: m.completed,
          });
        }
      });
    });
    return list.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 4);
  }, [activeProjects]);

  const handleQuickProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName || !newProjClient) return;

    addProject({
      clientId: newProjClient,
      projectName: newProjName,
      description: "Quick Project initialized under Manager sprint schedules.",
      budget: Number(newProjBudget) || 15000,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: newProjPriority,
      status: "Planning",
      progress: 0,
      category: "Web App",
      assignedMembers: [newTaskAssigned || "employee-1", "employee-2"],
      milestones: [
        { id: `ms-${Date.now()}-1`, title: "Requirements Definition Signoff", dueDate: "2026-08-01", completed: false },
        { id: `ms-${Date.now()}-2`, title: "Alpha Sprint Completion", dueDate: "2026-08-20", completed: false }
      ],
      dependencies: [],
      activityTimeline: [{ id: `act-p-${Date.now()}`, user: "Manager", action: "Project planned and scoped", timestamp: "Just now" }],
      comments: [],
      attachments: [],
      estimatedHours: Number(newProjHours) || 160,
      workedHours: 0,
      projectHealth: "Healthy",
    });

    setNewProjName("");
    setNewProjClient("");
    setNewProjBudget("");
    setNewProjHours("");
    setShowAddProjectModal(false);
  };

  const handleQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskProj || !newTaskAssigned) return;

    addTask({
      projectId: newTaskProj,
      title: newTaskTitle,
      description: "Allocated during dynamic Manager task scoping.",
      status: "To Do",
      priority: newTaskPriority,
      checklist: [{ id: `chk-${Date.now()}`, text: "Scoping review", completed: false }],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      assignedTo: newTaskAssigned,
      labels: ["Manager-Allocated"],
    });

    setNewTaskTitle("");
    setNewTaskProj("");
    setNewTaskAssigned("");
    setShowAddTaskModal(false);
  };

  return (
    <div className="space-y-6" id="manager-dashboard-root">
      {/* Top Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="manager-kpi-grid">
        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Active Software Sprints</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-gray-900 dark:text-white">
              {activeProjects.length} <span className="text-xs text-gray-500 font-normal">Sprints</span>
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-3 h-3 mr-0.5" /> High throughput
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Active Sprint Tasks</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-gray-900 dark:text-white">
              {activeTasks.length} <span className="text-xs text-gray-500 font-normal">Tasks</span>
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-indigo-500">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Velocity is climbing
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">At Risk Milestones</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-amber-500">
              {atRiskMilestonesCount} <span className="text-xs text-gray-500 font-normal">Overdue</span>
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-3 h-3 mr-0.5" /> Needs attention
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Team Sprint Velocity</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-emerald-500">
              {sprintVelocity}%
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <Award className="w-3 h-3 mr-0.5" /> On track for release
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Row: Sprint Deliverables Map & Team Load */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Delivery Health & Progress Grid */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-500" /> Active Software Sprints Delivery Tracker
              </h2>
              <p className="text-[11px] text-gray-400">Review real-time milestones progress, budget spend, and health indexes</p>
            </div>
            
            <button
              onClick={() => setActiveTab("Projects")}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              All Projects <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {activeProjects.slice(0, 4).map((p) => {
              const clientObj = clients.find((c) => c.id === p.clientId);
              return (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-950/20 space-y-3 transition-all hover:translate-x-1"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-xs">{p.projectName}</h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase">
                        CLIENT: {clientObj?.companyName || "Account"} | PRIORITY: {p.priority}
                      </p>
                    </div>

                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      p.projectHealth === "Healthy"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200/20"
                        : p.projectHealth === "At Risk"
                        ? "bg-amber-50 text-amber-600 border-amber-200/20"
                        : "bg-rose-50 text-rose-600 border-rose-200/20"
                    }`}>
                      Health: {p.projectHealth}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-gray-400">
                      <span>MILESTONES COMPLETE</span>
                      <span>{p.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800/80 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 dark:bg-indigo-400 h-1.5 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>

                  {/* Timelog breakdown */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 border-t border-gray-150 dark:border-gray-800/40 pt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{p.workedHours}h of {p.estimatedHours}h used</span>
                    </div>
                    <span>Deadline: {p.deadline}</span>
                  </div>
                </div>
              );
            })}

            {activeProjects.length === 0 && (
              <p className="text-center py-12 text-gray-400 font-mono">No active software deliverables scheduled.</p>
            )}
          </div>
        </div>

        {/* Team Allocation capacity panel */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 flex flex-col justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-500" /> Resource Capacities
            </h2>
            <p className="text-[11px] text-gray-400">Development workload and active ticket allocations</p>
          </div>

          <div className="space-y-3.5 py-4">
            {teamAllocationList.map((emp) => (
              <div key={emp.id} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-[10px] text-gray-700 dark:text-gray-300">
                    {emp.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{emp.name}</p>
                    <p className="text-[9px] text-gray-400 font-mono">{emp.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                    emp.workload === "Overloaded"
                      ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
                      : emp.workload === "High"
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                      : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                  }`}>
                    {emp.activeTasksCount} Tasks ({emp.workload})
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800/60">
            <button
              onClick={() => setActiveTab("Team")}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              Manage Engineering Space
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming Milestones Checklist & Quick Actions Launchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Milestone Agenda Checklist */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-rose-500" /> Active Milestones Timeline Review
            </h2>
            <p className="text-[11px] text-gray-400">Urgent target deliverables for the immediate 15-day sprint cycles</p>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {upcomingMilestones.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl border border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-950/10 flex justify-between items-center gap-3 text-xs"
              >
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{m.title}</h4>
                  <p className="text-[10px] text-gray-400 font-mono">PARENT PROJECT: {m.projectTitle}</p>
                </div>

                <div className="text-right font-mono text-[10px]">
                  <p className="text-gray-400">DUE DATE</p>
                  <p className="font-bold text-gray-900 dark:text-white">{m.dueDate}</p>
                </div>
              </div>
            ))}

            {upcomingMilestones.length === 0 && (
              <p className="text-center py-10 text-gray-400 font-mono">No target milestones in the immediate backlog.</p>
            )}
          </div>
        </div>

        {/* Quick Scope Launchpad (PM toolbox) */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 space-y-4 text-xs">
          <div>
            <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-500" /> Dynamic Sprint Launchpad
            </h2>
            <p className="text-[11px] text-gray-400">Initiate deliverables directly onto development logs</p>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-2">
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="w-full py-3 border border-dashed border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-400 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 text-indigo-500" /> Scaffolding New Sprint Project
            </button>

            <button
              onClick={() => setShowAddTaskModal(true)}
              className="w-full py-3 border border-dashed border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-400 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <CheckSquare className="w-4 h-4 text-blue-500" /> Assign Individual Backlog Task
            </button>
          </div>
        </div>
      </div>

      {/* Project Adding Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md">Scaffold Sprint Project</h3>
              <button onClick={() => setShowAddProjectModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs font-mono cursor-pointer">Close</button>
            </div>

            <form onSubmit={handleQuickProject} className="space-y-3 text-xs text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lumina Mobile API Gateway"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Target Client</label>
                  <select
                    required
                    value={newProjClient}
                    onChange={(e) => setNewProjClient(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select client...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Est. Hours</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={newProjHours}
                    onChange={(e) => setNewProjHours(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Budget Allocation ($)</label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={newProjBudget}
                    onChange={(e) => setNewProjBudget(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Risk Index</label>
                  <select
                    value={newProjPriority}
                    onChange={(e) => setNewProjPriority(e.target.value as any)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                    <option value="Critical">Critical Path</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-xs mt-2"
              >
                Schedule Agile Sprint Scope
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Task Adding Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md">Assign Agile Task</h3>
              <button onClick={() => setShowAddTaskModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs font-mono cursor-pointer">Close</button>
            </div>

            <form onSubmit={handleQuickTask} className="space-y-3 text-xs text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Task Objective Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement OIDC Client Credential token validation"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Agile Sprint Project</label>
                  <select
                    required
                    value={newTaskProj}
                    onChange={(e) => setNewTaskProj(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select project...</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.projectName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Assigned Engineer</label>
                  <select
                    required
                    value={newTaskAssigned}
                    onChange={(e) => setNewTaskAssigned(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select member...</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.role.split(" ")[0]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Release Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Low">Low priority</option>
                  <option value="Medium">Regular / Medium</option>
                  <option value="High">High / Immediate Block</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-xs mt-2"
              >
                Dispatch Task to Backlog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
