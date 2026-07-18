/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Meeting } from "../types";
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
  MapPin,
  Check,
} from "lucide-react";

export const MeetingsView: React.FC = () => {
  const { meetings, addMeeting, clients, employees } = useApp();
  const [search, setSearch] = useState("");
  const [filterClientMeetings, setFilterClientMeetings] = useState<"all" | "client" | "internal">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Meeting form states
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [isClientMeeting, setIsClientMeeting] = useState(true);
  const [agenda, setAgenda] = useState("");
  const [meetingLink, setMeetingLink] = useState("https://meet.google.com/abc-defg-hij");

  // Filtering Meetings
  const filteredMeetings = meetings.filter((meet) => {
    const matchSearch = meet.title.toLowerCase().includes(search.toLowerCase()) ||
                        (meet.agenda || "").toLowerCase().includes(search.toLowerCase());
    
    if (filterClientMeetings === "client") return matchSearch && meet.isClientMeeting;
    if (filterClientMeetings === "internal") return matchSearch && !meet.isClientMeeting;
    return matchSearch;
  });

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    addMeeting({
      title,
      date,
      time,
      duration,
      invitees: isClientMeeting ? ["client-1", "employee-1"] : ["employee-1", "employee-2"],
      agenda,
      notes: "Auto-initialized sync log.",
      status: "Scheduled",
      meetingLink: meetingLink || "https://meet.google.com/abc-defg-hij",
      isClientMeeting,
    });

    // Reset Form
    setTitle("");
    setDate("");
    setTime("");
    setDuration(30);
    setAgenda("");
    setMeetingLink("https://meet.google.com/abc-defg-hij");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6" id="meetings-view-container">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900 dark:text-white tracking-tight">
            Schedule & Sync
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Coordinate video milestone reviews, calendar checkups, and client syncs with Google Meet endpoints.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Book Sync Meeting
        </button>
      </div>

      {/* Query Bar */}
      <div className="p-4 rounded-xl glass-panel bg-white/70 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search topic or agenda notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 text-sm focus:outline-hidden focus:border-indigo-500 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterClientMeetings("all")}
            className={`text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all ${
              filterClientMeetings === "all"
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-800/60 dark:text-indigo-400"
                : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            All Syncs
          </button>
          <button
            onClick={() => setFilterClientMeetings("client")}
            className={`text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all ${
              filterClientMeetings === "client"
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-800/60 dark:text-indigo-400"
                : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            Client Meetings
          </button>
          <button
            onClick={() => setFilterClientMeetings("internal")}
            className={`text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all ${
              filterClientMeetings === "internal"
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-800/60 dark:text-indigo-400"
                : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            Internal Team Sprints
          </button>
        </div>
      </div>

      {/* Main Grid Calendar & Meeting Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meetings Catalog List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMeetings.map((meet) => (
              <div
                key={meet.id}
                className="p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 shadow-xs flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-all"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold ${
                      meet.isClientMeeting
                        ? "bg-blue-50 text-blue-600 border-blue-200/40 dark:bg-blue-950/30 dark:text-blue-400"
                        : "bg-indigo-50 text-indigo-600 border-indigo-200/40 dark:bg-indigo-950/30 dark:text-indigo-400"
                    }`}>
                      {meet.isClientMeeting ? "CLIENT SYNC" : "INTERNAL DEV"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {meet.duration}m
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md leading-tight">
                    {meet.title}
                  </h3>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {meet.agenda}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                  <div className="space-y-0.5">
                    <p className="font-mono text-gray-400 text-[10px]">SCHEDULED ON</p>
                    <p className="font-bold text-gray-900 dark:text-white font-mono">{meet.date} @ {meet.time}</p>
                  </div>

                  <a
                    href={meet.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-[11px] transition-all shadow-xs cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" /> Launch Meet
                  </a>
                </div>
              </div>
            ))}

            {filteredMeetings.length === 0 && (
              <div className="col-span-2 py-12 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400 space-y-1">
                <Calendar className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="font-medium text-sm">No scheduled meetings</p>
                <p className="text-xs">Schedule a client review sync or internal team workshop.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sync Tips & Integration details card */}
        <div className="space-y-4 lg:col-span-1">
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-gray-900/40 border border-indigo-100/30 dark:border-indigo-900/30 text-xs text-gray-600 dark:text-gray-300 space-y-4">
            <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md flex items-center gap-1.5">
              <Video className="w-4 h-4 text-indigo-500" /> Virtual Sync Infrastructure
            </h3>
            
            <p className="leading-relaxed text-[11px]">
              AgencyOS coordinates Google Meet and Zoom virtual syncs directly. Client meetings issue notification alerts to linked emails automatically.
            </p>

            <div className="space-y-2 border-t border-indigo-200/30 dark:border-gray-800/80 pt-3">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">1</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Email Dispatches</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Invitee calendars are updated immediately on scheduling.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">2</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Workspace Logger</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Record highlights, actions items, and upload wireframes review links.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-md">Schedule Calendar Sync</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleCreateMeeting} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Sync Agenda Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Deliverables Milestone Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase">Meeting Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase">Meeting Time</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase">Duration (Minutes)</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                    <option value={90}>90 Minutes</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase">Meeting Scope</label>
                  <select
                    value={isClientMeeting ? "client" : "internal"}
                    onChange={(e) => setIsClientMeeting(e.target.value === "client")}
                    className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="client">Client Account Sync</option>
                    <option value="internal">Internal Dev Workshop</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Google Meet URL</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Agenda Summary</label>
                <textarea
                  placeholder="Provide topics, deliverables reviews and comments..."
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  rows={2}
                  className="w-full text-sm p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-all shadow-md cursor-pointer"
              >
                Schedule & Dispatches Calendar Invites
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
