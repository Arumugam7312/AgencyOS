/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types";
import { OwnerDashboard } from "./dashboards/OwnerDashboard";
import { ManagerDashboard } from "./dashboards/ManagerDashboard";
import { DeveloperDashboard } from "./dashboards/DeveloperDashboard";
import { ClientDashboard } from "./dashboards/ClientDashboard";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Clock, 
  ListTodo,
  TrendingUp,
  HelpCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

export const DashboardView: React.FC = () => {
  const { activeRole, tasks, employees, projects, clientPortalId } = useApp();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Trigger simulated loading state on role change to highlight skeleton feedback
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 750);
    return () => clearTimeout(timer);
  }, [activeRole]);

  // Compute tasks assigned or scoped to the current active role
  const scopedTasks = useMemo(() => {
    switch (activeRole) {
      case UserRole.OWNER:
      case UserRole.MANAGER:
        return tasks;
      case UserRole.DEVELOPER: {
        const devIds = employees
          .filter(
            (e) =>
              e.department === "Engineering" ||
              e.role.toLowerCase().includes("developer") ||
              e.role.toLowerCase().includes("engineer")
          )
          .map((e) => e.id);
        return tasks.filter((t) => devIds.includes(t.assignedTo));
      }
      case UserRole.DESIGNER: {
        const designerIds = employees
          .filter((e) => e.department === "Design" || e.role.toLowerCase().includes("designer"))
          .map((e) => e.id);
        return tasks.filter((t) => designerIds.includes(t.assignedTo));
      }
      case UserRole.MARKETING: {
        const mktIds = employees
          .filter((e) => e.department === "Marketing" || e.role.toLowerCase().includes("marketing"))
          .map((e) => e.id);
        return tasks.filter((t) => mktIds.includes(t.assignedTo));
      }
      case UserRole.CLIENT: {
        const clientProjectIds = projects
          .filter((p) => p.clientId === clientPortalId)
          .map((p) => p.id);
        return tasks.filter((t) => clientProjectIds.includes(t.projectId));
      }
      default:
        return tasks;
    }
  }, [activeRole, tasks, employees, projects, clientPortalId]);

  // Calculate task statistics
  const todayStr = "2026-07-18";

  const metrics = useMemo(() => {
    const total = scopedTasks.length;
    const completed = scopedTasks.filter((t) => t.status === "Completed").length;
    const overdue = scopedTasks.filter(
      (t) => t.status !== "Completed" && t.dueDate < todayStr
    ).length;
    const pending = total - completed;
    const onTimePending = Math.max(0, pending - overdue);
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, overdue, onTimePending, rate };
  }, [scopedTasks]);

  // Recharts completion pie-chart data
  const pieData = useMemo(() => {
    if (metrics.total === 0) {
      return [{ name: "No Scoped Tasks", value: 1, color: "#374151" }];
    }
    return [
      { name: "Completed", value: metrics.completed, color: "#10b981" }, // emerald-500
      { name: "On-Time Pending", value: metrics.onTimePending, color: "#6366f1" }, // indigo-500
      { name: "Overdue", value: metrics.overdue, color: "#f43f5e" }, // rose-500
    ];
  }, [metrics]);

  // Recharts task status and overdue bar-chart data
  const barData = useMemo(() => {
    const counts = {
      "Backlog": 0,
      "To Do": 0,
      "In Progress": 0,
      "Review/Test": 0,
      "Completed": 0,
    };

    scopedTasks.forEach((t) => {
      if (t.status === "Completed") {
        counts["Completed"]++;
      } else {
        if (t.status === "Backlog") counts["Backlog"]++;
        else if (t.status === "To Do") counts["To Do"]++;
        else if (t.status === "In Progress") counts["In Progress"]++;
        else if (t.status === "Review" || t.status === "Testing") counts["Review/Test"]++;
      }
    });

    return [
      { name: "Backlog", Tasks: counts["Backlog"], fill: "#64748b" }, // slate-500
      { name: "To Do", Tasks: counts["To Do"], fill: "#3b82f6" }, // blue-500
      { name: "In Progress", Tasks: counts["In Progress"], fill: "#f59e0b" }, // amber-500
      { name: "Review/Test", Tasks: counts["Review/Test"], fill: "#8b5cf6" }, // violet-500
      { name: "Completed", Tasks: counts["Completed"], fill: "#10b981" }, // emerald-500
      { name: "Overdue Alert", Tasks: metrics.overdue, fill: "#f43f5e" }, // rose-500
    ];
  }, [scopedTasks, metrics.overdue]);

  // Custom tooltips matching dark mode / light mode theme styles
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 dark:bg-black text-white px-3 py-2 rounded-xl border border-gray-800 shadow-xl text-xs font-mono">
          <p className="font-semibold text-gray-300 mb-1">{payload[0].name}</p>
          <p className="text-indigo-400 font-bold flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color || payload[0].fill }} />
            {payload[0].value} Tasks
          </p>
        </div>
      );
    }
    return null;
  };

  const renderDashboard = () => {
    switch (activeRole) {
      case UserRole.OWNER:
        return <OwnerDashboard />;
      case UserRole.MANAGER:
        return <ManagerDashboard />;
      case UserRole.DEVELOPER:
      case UserRole.DESIGNER:
      case UserRole.MARKETING:
        return <DeveloperDashboard />;
      case UserRole.CLIENT:
        return <ClientDashboard />;
      default:
        return <OwnerDashboard />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="role-dashboard-wrapper">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800/60 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5.5 h-5.5 text-indigo-500 animate-pulse" />
            {activeRole} Workspace Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Welcome back to AgencyOS. Review real-time workloads, financial ledgers, and live system audits.
          </p>
        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton role={activeRole} />
      ) : (
        <>
          {/* TASK PERFORMANCE ANALYTICS SUMMARY PANEL */}
          <div className="p-5 rounded-2xl border border-indigo-100 dark:border-gray-800/70 bg-white/60 dark:bg-gray-950/20 backdrop-blur-md shadow-xs space-y-5" id="task-performance-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800/40 pb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4.5 h-4.5 text-indigo-500" />
                  Scoped Task Performance Summary
                </h2>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                  Analyzing performance metrics across {metrics.total} tasks assigned to {activeRole} role
                </p>
              </div>

              {/* Quick statistics layout */}
              <div className="flex flex-wrap items-center gap-3.5 text-xs">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{metrics.completed} Completed ({metrics.rate}%)</span>
                </div>
                {metrics.overdue > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-medium animate-bounce">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{metrics.overdue} Overdue</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/10 text-indigo-600 dark:text-indigo-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{metrics.onTimePending} Active</span>
                </div>
              </div>
            </div>

            {metrics.total === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400 dark:text-gray-500">
                <ListTodo className="w-10 h-10 mb-3 text-gray-300 dark:text-gray-700" />
                <p className="text-xs font-mono">No tasks assigned to the current role scope.</p>
                <p className="text-[10px] mt-1 max-w-sm">Create and assign new items under the Kanban or Projects tab to see visual performance analytics here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Completion rate donut gauge */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-3 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800/40">
                  <span className="text-[10px] font-mono uppercase text-gray-400 mb-3 tracking-wider">Completion Gauge</span>
                  <div className="relative w-full h-[180px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Centered Percentage Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-2 pointer-events-none">
                      <span className="text-2xl font-bold font-display text-gray-900 dark:text-white leading-none">
                        {metrics.rate}%
                      </span>
                      <span className="text-[8px] font-mono uppercase text-gray-400 mt-1 tracking-wider">
                        Settle Rate
                      </span>
                    </div>
                  </div>

                  {/* Compact Pie Legends */}
                  <div className="flex flex-wrap items-center justify-center gap-3.5 mt-2.5 text-[10px] font-mono text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                      <span>Done ({metrics.completed})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500" />
                      <span>On-Time ({metrics.onTimePending})</span>
                    </div>
                    {metrics.overdue > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                        <span>Overdue ({metrics.overdue})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status-wise distribution bar chart */}
                <div className="lg:col-span-7 flex flex-col p-2">
                  <span className="text-[10px] font-mono uppercase text-gray-400 mb-4 tracking-wider text-center lg:text-left">
                    Workflow status distribution
                  </span>
                  
                  <div className="w-full h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                        <XAxis 
                          dataKey="name" 
                          stroke="#64748b" 
                          fontSize={9} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={9} 
                          tickLine={false} 
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                        <Bar 
                          dataKey="Tasks" 
                          radius={[6, 6, 0, 0]} 
                          barSize={24}
                        >
                          {barData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* MAIN CHOSEN WORKSPACE DASHBOARD */}
          <div className="mt-4" id="role-dashboard-container">
            {renderDashboard()}
          </div>
        </>
      )}
    </div>
  );
};
