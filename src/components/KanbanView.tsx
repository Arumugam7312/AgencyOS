/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Task } from "../types";
import {
  Plus,
  Clock,
  CheckSquare,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  X,
  AlertCircle,
  Eye,
  Trash,
} from "lucide-react";

export const KanbanView: React.FC = () => {
  const {
    tasks,
    projects,
    employees,
    addTask,
    updateTask,
    deleteTask,
    addTaskComment,
  } = useApp();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState<Task["status"] | null>(null);
  const [newComment, setNewComment] = useState("");

  // Add Task form state
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [dueDate, setDueDate] = useState("");

  // Group columns
  const columns: { label: string; status: Task["status"]; color: string }[] = [
    { label: "Backlog", status: "Backlog", color: "bg-gray-100 dark:bg-gray-900 border-gray-200" },
    { label: "To Do", status: "To Do", color: "bg-blue-50/50 dark:bg-blue-950/10 border-blue-200/20" },
    { label: "In Progress", status: "In Progress", color: "bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-200/20" },
    { label: "Review", status: "Review", color: "bg-purple-50/50 dark:bg-purple-950/10 border-purple-200/20" },
    { label: "Testing", status: "Testing", color: "bg-yellow-50/50 dark:bg-yellow-950/10 border-yellow-200/20" },
    { label: "Completed", status: "Completed", color: "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200/20" },
  ];

  // Map tasks to columns
  const tasksByColumn = useMemo(() => {
    const map: Record<Task["status"], Task[]> = {
      Backlog: [],
      "To Do": [],
      "In Progress": [],
      Review: [],
      Testing: [],
      Completed: [],
    };
    // Limit to first 60 active tasks to keep rendering responsive
    tasks.slice(0, 60).forEach((t) => {
      if (map[t.status]) {
        map[t.status].push(t);
      }
    });
    return map;
  }, [tasks]);

  // Handle column moves
  const moveTask = (task: Task, direction: "left" | "right") => {
    const statuses: Task["status"][] = ["Backlog", "To Do", "In Progress", "Review", "Testing", "Completed"];
    const currentIndex = statuses.indexOf(task.status);
    let nextIndex = currentIndex;
    if (direction === "right" && currentIndex < statuses.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === "left" && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }
    
    if (nextIndex !== currentIndex) {
      updateTask({ ...task, status: statuses[nextIndex] });
    }
  };

  // Toggle checklist subtasks
  const handleToggleCheck = (task: Task, itemId: string) => {
    const updatedChecklist = task.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateTask({ ...task, checklist: updatedChecklist });
    // Re-sync local modal
    const fresh = tasks.find((t) => t.id === task.id);
    if (fresh) setSelectedTask(fresh);
  };

  // Submit Comments
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !selectedTask) return;
    addTaskComment(selectedTask.id, newComment);
    setNewComment("");
    // Re-sync local modal
    const fresh = tasks.find((t) => t.id === selectedTask.id);
    if (fresh) setSelectedTask(fresh);
  };

  // Create Task Form Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectId || !showAddModal) return;

    addTask({
      projectId,
      title,
      description: "Perform unit, performance and security auditing before release.",
      status: showAddModal,
      priority,
      checklist: [
        { id: `c1-${Date.now()}`, text: "Verify Layout Responsiveness", completed: false },
        { id: `c2-${Date.now()}`, text: "Run local unit test cases", completed: false },
      ],
      dueDate: dueDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      assignedTo: assignedTo || "employee-1",
      labels: ["Sprint-Core", "Task"],
    });

    setTitle("");
    setProjectId("");
    setAssignedTo("");
    setDueDate("");
    setShowAddModal(null);
  };

  return (
    <div className="space-y-6" id="kanban-view-container">
      {/* Header Info */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900 dark:text-white tracking-tight">
            Kanban Board
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Toggle, transition, and update core developer checklists across sprint states.
          </p>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin snap-x snap-mandatory" id="kanban-grid-cols">
        {columns.map((col) => {
          const colTasks = tasksByColumn[col.status] || [];
          return (
            <div
              key={col.status}
              className={`w-[280px] sm:w-[320px] lg:w-auto lg:flex-1 shrink-0 p-3 rounded-2xl border border-gray-200/40 dark:border-gray-800/80 ${col.color} flex flex-col min-h-[480px] max-h-[600px] snap-always snap-start`}
            >
              {/* Column Header */}
              <div className="flex justify-between items-center pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">{col.label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200/50 dark:bg-gray-800 text-gray-500 font-mono">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => setShowAddModal(col.status)}
                  className="p-1 rounded-md text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                {colTasks.map((task) => {
                  const emp = employees.find((e) => e.id === task.assignedTo);
                  const proj = projects.find((p) => p.id === task.projectId);
                  const completedChecklist = task.checklist.filter((c) => c.completed).length;

                  // Priority Styling
                  const prioColors = {
                    Low: "text-gray-500 bg-gray-100 dark:bg-gray-800",
                    Medium: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
                    High: "text-rose-500 bg-rose-50 dark:bg-rose-950/20",
                  };

                  return (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200/50 dark:border-gray-800/80 shadow-xs space-y-3 relative group transition-all hover:scale-[1.01] hover:border-indigo-400"
                    >
                      {/* Priority and project metadata */}
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] font-mono font-medium truncate max-w-[80px] text-gray-400">
                          {proj ? proj.projectName.split(" ")[0] : "Project"}
                        </span>
                        <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-md ${prioColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {task.title}
                      </h4>

                      {/* Checklist Summary */}
                      {task.checklist.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>{completedChecklist}/{task.checklist.length} Checklist</span>
                        </div>
                      )}

                      {/* Assignee & Dates footer */}
                      <div className="flex justify-between items-center pt-2.5 border-t border-gray-100 dark:border-gray-800/80">
                        <div className="flex items-center gap-1">
                          <span className={`w-5 h-5 rounded-full bg-gradient-to-tr ${emp?.photo || "from-gray-500 to-slate-600"} flex items-center justify-center text-white text-[8px] font-semibold uppercase font-display shrink-0`}>
                            {emp ? emp.name.charAt(0) : "T"}
                          </span>
                          <span className="text-[10px] text-gray-500 truncate max-w-[70px]">
                            {emp ? emp.name.split(" ")[0] : "Team"}
                          </span>
                        </div>

                        {/* Transitions Arrow Buttons */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveTask(task, "left")}
                            className="p-1 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 cursor-pointer"
                            disabled={col.status === "Backlog"}
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setSelectedTask(task)}
                            className="p-1 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveTask(task, "right")}
                            className="p-1 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 cursor-pointer"
                            disabled={col.status === "Completed"}
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task detail expand Drawer Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm">Task Inspections</h3>
                <p className="text-[10px] font-mono text-gray-400">ID: {selectedTask.id}</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-1">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{selectedTask.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{selectedTask.description}</p>
              </div>

              {/* Checklist */}
              <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3">
                <h5 className="text-xs font-mono text-gray-400 uppercase">Subtasks Checklist</h5>
                <div className="space-y-1.5">
                  {selectedTask.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleCheck(selectedTask, item.id)}
                      className="flex items-center gap-2 p-2 rounded-lg border border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/20 cursor-pointer text-xs"
                    >
                      <input type="checkbox" readOnly checked={item.completed} className="rounded text-indigo-600" />
                      <span className={item.completed ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-300"}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Comments log */}
              <div className="space-y-2.5 border-t border-gray-100 dark:border-gray-800 pt-3">
                <h5 className="text-xs font-mono text-gray-400 uppercase">Discussion Panel</h5>
                <div className="space-y-2 max-h-[120px] overflow-y-auto">
                  {selectedTask.comments.map((com) => (
                    <div key={com.id} className="p-2 bg-gray-50 dark:bg-gray-900/60 rounded-md text-[11px] leading-relaxed border border-gray-100/50 dark:border-gray-800/80">
                      <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                        <span>{com.user}</span>
                        <span className="font-mono text-gray-400">{com.timestamp}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-0.5">{com.text}</p>
                    </div>
                  ))}
                  {selectedTask.comments.length === 0 && <p className="text-center py-2 text-gray-400 text-[10px] font-mono">No discussions yet.</p>}
                </div>

                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Leave comment on this board..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs focus:outline-hidden text-gray-900 dark:text-white"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md text-xs cursor-pointer">Post</button>
                </form>
              </div>

              <button
                onClick={() => {
                  deleteTask(selectedTask.id);
                  setSelectedTask(null);
                }}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 border border-rose-200/50 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash className="w-3.5 h-3.5" /> Purge Sprint Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Column specific addition modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm">Add Task to {showAddModal}</h3>
              <button onClick={() => setShowAddModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-500 uppercase">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit responsive CSS selectors"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Sprint Project</label>
                  <select
                    required
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="">Select project...</option>
                    {projects.slice(0, 15).map((p) => (
                      <option key={p.id} value={p.id}>{p.projectName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Assignee</label>
                  <select
                    required
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="">Select person...</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-all shadow-md cursor-pointer"
              >
                Onboard Core Sprint Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
