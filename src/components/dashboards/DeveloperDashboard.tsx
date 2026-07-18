/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { Task } from "../../types";
import {
  Play,
  Pause,
  RotateCcw,
  CheckSquare,
  Terminal,
  Clock,
  Code2,
  Cpu,
  User,
  Coffee,
  CheckCircle,
  Plus,
} from "lucide-react";

export const DeveloperDashboard: React.FC = () => {
  const {
    tasks,
    employees,
    updateTask,
    addNotification,
  } = useApp();

  // Find all developers/engineers
  const devEmployees = useMemo(() => {
    const devs = employees.filter(
      (e) => e.department === "Engineering" || e.role.toLowerCase().includes("developer") || e.role.toLowerCase().includes("designer")
    );
    return devs.length > 0 ? devs : employees;
  }, [employees]);

  // Default simulated developer to the first engineer found
  const [selectedEmpId, setSelectedEmpId] = useState<string>("");

  useEffect(() => {
    if (devEmployees.length > 0 && !selectedEmpId) {
      setSelectedEmpId(devEmployees[0].id);
    }
  }, [devEmployees, selectedEmpId]);

  const activeEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmpId) || devEmployees[0];
  }, [employees, devEmployees, selectedEmpId]);

  // Filter tasks for active developer
  const myTasks = useMemo(() => {
    return tasks.filter((t) => t.assignedTo === selectedEmpId);
  }, [tasks, selectedEmpId]);

  const pendingTasks = useMemo(() => {
    return myTasks.filter((t) => t.status !== "Completed");
  }, [myTasks]);

  const completedTasksCount = useMemo(() => {
    return myTasks.filter((t) => t.status === "Completed").length;
  }, [myTasks]);

  // Focus Timer States (Pomodoro)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [focusPreset, setFocusPreset] = useState("Feature Dev");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            addNotification(
              "Focus Cycle Concluded",
              `Outstanding! Siddharth Sharma completed 25 mins focus for '${focusPreset}'`,
              "system"
            );
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, focusPreset]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(25 * 60);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Timesheet Logger States
  const [logTaskId, setLogTaskId] = useState("");
  const [logHours, setLogHours] = useState("");
  const [logMessage, setLogMessage] = useState("");

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTaskId || !logHours) return;

    const taskToUpdate = tasks.find((t) => t.id === logTaskId);
    if (taskToUpdate) {
      const updated: Task = {
        ...taskToUpdate,
        timeSpent: (taskToUpdate.timeSpent || 0) + Number(logHours),
      };
      updateTask(updated);
      addNotification(
        "Timesheet Approved",
        `Logged ${logHours} hours on task '${taskToUpdate.title}' for ${activeEmployee?.name || "Developer"}`,
        "task"
      );
      setLogHours("");
      setLogMessage("");
      setLogTaskId("");
    }
  };

  // Toggle task completeness directly from checklist
  const handleToggleTaskStatus = (task: Task) => {
    const nextStatus = task.status === "Completed" ? "In Progress" : "Completed";
    const updated: Task = {
      ...task,
      status: nextStatus,
    };
    updateTask(updated);
    addNotification(
      "Sprint Task Synced",
      `Task status updated to '${nextStatus}' for '${task.title}'`,
      "task"
    );
  };

  return (
    <div className="space-y-6" id="dev-dashboard-root">
      {/* Simulation Selector Bar */}
      <div className="p-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/20 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-xs">Simulating Developer View</h3>
            <p className="text-[10px] text-gray-400">Select any developer profile to review and manage their live checklist</p>
          </div>
        </div>

        <select
          value={selectedEmpId}
          onChange={(e) => setSelectedEmpId(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden cursor-pointer"
        >
          {devEmployees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} ({e.role.split(" ")[0]})
            </option>
          ))}
        </select>
      </div>

      {/* Top Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="dev-kpi-grid">
        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">My Pending Backlog</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-gray-900 dark:text-white">
              {pendingTasks.length} <span className="text-xs text-gray-500 font-normal">tickets</span>
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-indigo-500">
              <Code2 className="w-3 h-3 mr-0.5" /> Direct allocations
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Sprint Completed</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-emerald-500">
              {completedTasksCount} <span className="text-xs text-gray-500 font-normal">resolved</span>
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-3 h-3 mr-0.5" /> Ready for test build
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Sprint Focus Hours</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-gray-900 dark:text-white">
              {myTasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0)}h <span className="text-xs text-gray-500 font-normal">logged</span>
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-gray-400">
              <Clock className="w-3 h-3 mr-0.5" /> Timesheets synced
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Daily focus streak</p>
            <h3 className="text-lg md:text-2xl font-display font-semibold text-amber-500">
              4 days
            </h3>
            <span className="inline-flex items-center text-[10px] font-mono text-amber-600">
              <Coffee className="w-3 h-3 mr-0.5" /> Flow state active
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Coffee className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Row: Developer Backlog Checklist & Pomodoro Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Board / Checklist */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-indigo-500" /> Interactive Sprint Task Checklist
              </h2>
              <p className="text-[11px] text-gray-400">Directly toggle status checkpoints to coordinate with PM metrics</p>
            </div>
            
            <span className="text-[10px] font-mono text-gray-400">{myTasks.length} Allocated tickets</span>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {myTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => handleToggleTaskStatus(t)}
                className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  t.status === "Completed"
                    ? "bg-gray-50/20 dark:bg-gray-950/10 border-gray-100 dark:border-gray-850 opacity-60"
                    : "bg-white dark:bg-gray-950/20 border-gray-100 dark:border-gray-800 hover:border-indigo-400"
                }`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                  t.status === "Completed"
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                }`}>
                  {t.status === "Completed" && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className={`text-xs font-semibold text-gray-900 dark:text-white ${t.status === "Completed" ? "line-through" : ""}`}>
                    {t.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[9px] font-mono text-gray-400 uppercase">
                    <span>PRIORITY: {t.priority}</span>
                    <span>•</span>
                    <span>DUE: {t.dueDate}</span>
                    {t.timeSpent ? (
                      <>
                        <span>•</span>
                        <span>LOGGED: {t.timeSpent}h</span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}

            {myTasks.length === 0 && (
              <p className="text-center py-12 text-gray-400 font-mono">No tasks allocated under this engineer profile.</p>
            )}
          </div>
        </div>

        {/* Pomodoro Focus Timer */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-500 animate-pulse" /> Focus Workspace
            </h2>
            <p className="text-[11px] text-gray-400">Initiate deep work sprints with custom timers</p>
          </div>

          <div className="flex flex-col items-center justify-center py-4 relative">
            <div className="text-4xl font-mono font-extrabold text-gray-900 dark:text-white select-none tracking-widest relative">
              {formatTimer(timerSeconds)}
              {isTimerRunning && (
                <span className="absolute -top-1 -right-3 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
              )}
            </div>
            
            <p className="text-[10px] font-mono text-rose-600 dark:text-rose-400 mt-2 uppercase tracking-widest font-semibold">
              FOCUS CYCLE: {focusPreset}
            </p>
          </div>

          {/* Preset buttons */}
          <div className="grid grid-cols-3 gap-1 text-[9px] font-mono">
            {["Feature Dev", "OIDC Sync", "Bug Triage"].map((pr) => (
              <button
                key={pr}
                onClick={() => setFocusPreset(pr)}
                className={`py-1 rounded-md text-center cursor-pointer border ${
                  focusPreset === pr
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200"
                    : "border-gray-100 dark:border-gray-850 text-gray-400 hover:text-white"
                }`}
              >
                {pr}
              </button>
            ))}
          </div>

          <div className="flex gap-2 text-xs pt-1">
            <button
              onClick={toggleTimer}
              className={`flex-1 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-white shadow-xs ${
                isTimerRunning ? "bg-rose-600 hover:bg-rose-700" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Work
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Start Focus
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="px-3.5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Timesheet Logger & Terminal Code Sync Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Timesheet Logger */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 space-y-4">
          <div>
            <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" /> Log Timesheet Hours
            </h2>
            <p className="text-[11px] text-gray-400">Post development timesheets directly into assigned project deliverables</p>
          </div>

          <form onSubmit={handleLogHours} className="space-y-3 text-xs text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-400 uppercase">Select Target Task</label>
                <select
                  required
                  value={logTaskId}
                  onChange={(e) => setLogTaskId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                >
                  <option value="">Choose task...</option>
                  {pendingTasks.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-400 uppercase">Hours Spent</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 4"
                  value={logHours}
                  onChange={(e) => setLogHours(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-400 uppercase">Work Summary (Optional)</label>
              <input
                type="text"
                placeholder="Brief description of code added..."
                value={logMessage}
                onChange={(e) => setLogMessage(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg cursor-pointer text-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Approve & Sync Hours
            </button>
          </form>
        </div>

        {/* Live Build Logs Terminal Simulator */}
        <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-sm font-display font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-500 animate-pulse" /> Sandbox Container Build Terminal
            </h2>
            <p className="text-[11px] text-gray-400">Live operational events on sandbox staging virtual machines</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-950 text-[10px] font-mono text-emerald-400 space-y-1.5 h-[160px] overflow-y-auto border border-emerald-950 shadow-inner">
            <p className="text-gray-500">[2026-07-17 23:08:10] INFO: Initializing local developer shell space...</p>
            <p className="text-indigo-400">[2026-07-17 23:08:11] SYSTEM: Selected engineer: {activeEmployee?.name || "Developer"}</p>
            <p className="text-gray-500">[2026-07-17 23:08:12] COMPILER: Hot Module Reload disabled (DISABLE_HMR=true)</p>
            <p className="text-emerald-400 font-semibold">[2026-07-17 23:08:14] SUCCESS: TypeScript compilation complete. 0 fatal errors.</p>
            <p className="text-gray-400">[2026-07-17 23:08:15] PORT: Ingress routing active on port 3000 to sandboxed reverse proxy.</p>
            <p className="text-amber-500">[2026-07-17 23:08:16] METRIC: {pendingTasks.length} backlog tickets active on task cache.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
