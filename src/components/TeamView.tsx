/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Employee } from "../types";
import {
  Search,
  Plus,
  Mail,
  Phone,
  DollarSign,
  TrendingUp,
  Star,
  Award,
  Calendar,
  Clock,
  User,
  X,
  Edit2,
  AlertCircle,
  Briefcase,
} from "lucide-react";

export const TeamView: React.FC = () => {
  const { employees, projects, addEmployee, updateEmployee, settings } = useApp();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: "",
    role: "Senior Full Stack Developer",
    department: "Engineering",
    salary: 80000,
    availability: "Available",
    email: "",
    phone: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "all" || emp.department === deptFilter;
    return matchSearch && matchDept;
  });

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: (formData.skills || []).filter((s) => s !== skill),
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addEmployee({
      name: formData.name,
      photo: "from-purple-500 to-pink-600",
      role: formData.role || "Developer",
      department: (formData.department as any) || "Engineering",
      salary: Number(formData.salary) || 75000,
      attendance: 100,
      assignedProjects: [],
      performanceRating: 5,
      skills: formData.skills || ["React", "TypeScript"],
      availability: (formData.availability as any) || "Available",
      email: formData.email,
      phone: formData.phone || "+91 90000 00000",
    });

    setFormData({
      name: "",
      role: "Senior Full Stack Developer",
      department: "Engineering",
      salary: 80000,
      availability: "Available",
      email: "",
      phone: "",
      skills: [],
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6" id="team-view-container">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900 dark:text-white tracking-tight">
            Team Workspace
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Audit {employees.length} full-time specialists, track attendance indices, salaries, and assign core sprint deliverables.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Onboard Employee
        </button>
      </div>

      {/* Query Bar */}
      <div className="p-4 rounded-xl glass-panel bg-white/70 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employee name or role title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-sm focus:outline-hidden focus:border-indigo-500 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Management">Management</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" id="team-cards-grid">
        {filteredEmployees.map((emp) => {
          const availabilityColors = {
            Available: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/30",
            Busy: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/30",
            OOF: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/30",
            "Part-Time": "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/30",
          };

          return (
            <div
              key={emp.id}
              onClick={() => setSelectedEmp(emp)}
              className="p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 shadow-xs flex flex-col justify-between gap-4 cursor-pointer hover:border-indigo-400 hover:scale-[1.01] transition-all relative overflow-hidden"
            >
              {/* Profile Top Row */}
              <div className="flex items-start gap-3">
                <span className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${emp.photo} flex items-center justify-center text-white font-display font-bold text-lg`}>
                  {emp.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm truncate leading-tight">
                    {emp.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{emp.role}</p>
                  <p className="text-[10px] font-mono text-indigo-500 font-semibold">{emp.department.toUpperCase()}</p>
                </div>
              </div>

              {/* Skills line */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {emp.skills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats Footer Row */}
              <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-gray-100 dark:border-gray-800/80 pt-3 text-gray-500">
                <div>
                  <span className="font-mono block uppercase text-[8px] text-gray-400">ATTENDANCE</span>
                  <p className="font-bold text-gray-900 dark:text-white mt-0.5">{emp.attendance}%</p>
                </div>
                <div className="text-right">
                  <span className="font-mono block uppercase text-[8px] text-gray-400">STATUS</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full border text-[8px] font-bold mt-1 ${availabilityColors[emp.availability]}`}>
                    {emp.availability}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded flyout details view (Active select card) */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm">Employee Portfolio</h3>
              <button onClick={() => setSelectedEmp(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800/80">
                <span className={`w-14 h-14 rounded-xl bg-gradient-to-tr ${selectedEmp.photo} flex items-center justify-center text-white font-display font-bold text-xl`}>
                  {selectedEmp.name.charAt(0)}
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-none">{selectedEmp.name}</h4>
                  <p className="text-gray-400 mt-1">{selectedEmp.role}</p>
                  <p className="text-[10px] font-mono text-indigo-500 mt-0.5 font-bold uppercase">{selectedEmp.department}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-mono text-gray-400 uppercase">Contact Logs</p>
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400" /> {selectedEmp.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" /> {selectedEmp.phone}</div>
              </div>

              {/* Skills */}
              <div className="space-y-1.5 border-t border-gray-100 dark:border-gray-800/80 pt-3">
                <p className="text-[10px] font-mono text-gray-400 uppercase">Specialized Skillset</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEmp.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 font-medium font-mono text-[9px]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Performance / Work log */}
              <div className="space-y-2 border-t border-gray-100 dark:border-gray-800/80 pt-3">
                <p className="text-[10px] font-mono text-gray-400 uppercase">Performance Audit Index</p>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(selectedEmp.performanceRating) ? "fill-amber-500 text-amber-500" : "text-gray-300"}`} />
                  ))}
                  <span className="text-gray-900 dark:text-white font-mono font-bold ml-1">{selectedEmp.performanceRating}/5</span>
                </div>
              </div>

              {/* Annual Package */}
              <div className="space-y-1.5 border-t border-gray-100 dark:border-gray-800/80 pt-3 flex justify-between items-center text-xs">
                <span className="text-gray-400 font-mono uppercase text-[10px]">Annual Base Salary Package</span>
                <span className="font-bold text-gray-900 dark:text-white font-mono text-sm">${selectedEmp.salary.toLocaleString()}/year</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onboard Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm">Onboard New Team Specialist</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 max-h-[440px] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-500 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Division</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Annual Package ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="85000"
                    value={formData.salary || ""}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Designation / Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead React Developer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@zelquent.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 99999 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Skills compiler input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-500 uppercase">Skills Compiler</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Next.js, Redux, Docker"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 text-sm px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold text-xs rounded-lg cursor-pointer text-gray-900 dark:text-white"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(formData.skills || []).map((sk) => (
                    <span
                      key={sk}
                      onClick={() => handleRemoveSkill(sk)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center gap-1 cursor-pointer"
                    >
                      {sk} <X className="w-2.5 h-2.5" />
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-all shadow-md cursor-pointer"
              >
                Assemble Specialist Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
