/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  Client,
  Employee,
  Project,
  Task,
  Invoice,
  Payment,
  Contract,
  FileItem,
  AppNotification,
  RevenuePoint,
  Meeting,
} from "../types";
import {
  generateClients,
  generateEmployees,
  generateProjects,
  generateTasks,
  generateInvoices,
  generatePayments,
  generateContracts,
  generateFiles,
  generateNotifications,
  generateRevenueHistory,
  generateMeetings,
} from "../dummyData";

interface SystemSettings {
  companyName: string;
  brandColors: string;
  currency: string;
  gstRate: number;
  language: string;
  timezone: string;
}

interface AppContextType {
  theme: "light" | "dark";
  activeRole: UserRole;
  activeTab: string;
  searchQuery: string;
  
  // Data Collections
  clients: Client[];
  employees: Employee[];
  projects: Project[];
  tasks: Task[];
  invoices: Invoice[];
  payments: Payment[];
  contracts: Contract[];
  files: FileItem[];
  notifications: AppNotification[];
  meetings: Meeting[];
  revenue: RevenuePoint[];
  settings: SystemSettings;
  tickets: { id: string; clientId: string; title: string; description: string; priority: string; status: string; date: string }[];
  clientPortalId: string; // The client ID currently acting when activeRole === Client

  // Operations
  toggleTheme: () => void;
  setActiveRole: (role: UserRole) => void;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setClientPortalId: (id: string) => void;

  // Mutators
  addClient: (c: Omit<Client, "id">) => void;
  updateClient: (c: Client) => void;
  addProject: (p: Omit<Project, "id">) => void;
  updateProject: (p: Project) => void;
  addTask: (t: Omit<Task, "id" | "comments" | "attachments" | "timeSpent">) => void;
  updateTask: (t: Task) => void;
  deleteTask: (id: string) => void;
  addEmployee: (e: Omit<Employee, "id" | "leaves" | "workLogs">) => void;
  updateEmployee: (e: Employee) => void;
  addMeeting: (m: Omit<Meeting, "id">) => void;
  addInvoice: (inv: Omit<Invoice, "id" | "subtotal" | "total">) => void;
  updateInvoice: (inv: Invoice) => void;
  payInvoiceDemo: (invoiceId: string, method: string) => Promise<{ success: boolean; transactionId: string; receiptNumber: string }>;
  addContract: (c: Omit<Contract, "id">) => void;
  addFile: (f: Omit<FileItem, "id">) => void;
  deleteFile: (id: string) => void;
  addNotification: (title: string, message: string, type: AppNotification["type"]) => void;
  markNotifRead: (id: string) => void;
  markAllNotifsRead: () => void;
  clearAllNotifs: () => void;
  updateSettings: (s: SystemSettings) => void;
  raiseSupportTicket: (title: string, description: string, priority: string) => void;
  addProjectComment: (projectId: string, commentText: string) => void;
  addTaskComment: (taskId: string, commentText: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [activeRole, setActiveRoleState] = useState<UserRole>(UserRole.OWNER);
  const [activeTab, setActiveTabState] = useState<string>("Dashboard");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [clientPortalId, setClientPortalId] = useState<string>("client-1");

  // State collections
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    companyName: "Zelquent Tech",
    brandColors: "#4F46E5",
    currency: "USD ($)",
    gstRate: 18,
    language: "English (US)",
    timezone: "IST (UTC+5:30)",
  });
  const [tickets, setTickets] = useState<{ id: string; clientId: string; title: string; description: string; priority: string; status: string; date: string }[]>([]);

  // Load from local storage or generate if empty
  useEffect(() => {
    try {
      // Force dark theme as the unified premium cosmic palette for all screens
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("agency_theme", "dark");

      const storedRole = localStorage.getItem("agency_role") as UserRole | null;
      if (storedRole) setActiveRoleState(storedRole);

      const storedPortalId = localStorage.getItem("agency_portal_id");
      if (storedPortalId) setClientPortalId(storedPortalId);

      const storedSettings = localStorage.getItem("agency_settings");
      if (storedSettings) setSettings(JSON.parse(storedSettings));

      // Load main collections
      const getOrSet = <T,>(key: string, generator: () => T): T => {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            return JSON.parse(cached);
          } catch {
            // fallback
          }
        }
        const data = generator();
        localStorage.setItem(key, JSON.stringify(data));
        return data;
      };

      const loadedClients = getOrSet("agency_clients", generateClients);
      const loadedEmployees = getOrSet("agency_employees", generateEmployees);
      const loadedProjects = getOrSet("agency_projects", () => generateProjects(loadedClients, loadedEmployees));
      const loadedTasks = getOrSet("agency_tasks", () => generateTasks(loadedProjects, loadedEmployees));
      const loadedInvoices = getOrSet("agency_invoices", () => generateInvoices(loadedClients));
      const loadedPayments = getOrSet("agency_payments", () => generatePayments(loadedInvoices));
      const loadedContracts = getOrSet("agency_contracts", () => generateContracts(loadedClients));
      const loadedFiles = getOrSet("agency_files", () => generateFiles(loadedEmployees));
      const loadedNotifications = getOrSet("agency_notifications", generateNotifications);
      const loadedMeetings = getOrSet("agency_meetings", () => generateMeetings(loadedClients, loadedEmployees));
      const loadedRevenue = getOrSet("agency_revenue", generateRevenueHistory);
      const loadedTickets = getOrSet("agency_tickets", () => [
        { id: "tick-1", clientId: "client-1", title: "API Endpoint Intermittent 502", description: "The web hook is returning 502 error rates under heavy sync windows.", priority: "High", status: "Open", date: "2026-07-16" },
        { id: "tick-2", clientId: "client-1", title: "Billing Invoice Question", description: "Need to change corporate address shown on INV-2026-1002.", priority: "Medium", status: "Resolved", date: "2026-07-14" },
      ]);

      setClients(loadedClients);
      setEmployees(loadedEmployees);
      setProjects(loadedProjects);
      setTasks(loadedTasks);
      setInvoices(loadedInvoices);
      setPayments(loadedPayments);
      setContracts(loadedContracts);
      setFiles(loadedFiles);
      setNotifications(loadedNotifications);
      setMeetings(loadedMeetings);
      setRevenue(loadedRevenue);
      setTickets(loadedTickets);
    } catch (err) {
      console.error("Localstorage load error, resetting collections", err);
    }
  }, []);

  // Sync utilities
  const sync = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const toggleTheme = () => {
    // Keep theme as dark to enforce unified cosmic color palette
    setTheme("dark");
    document.documentElement.classList.add("dark");
    localStorage.setItem("agency_theme", "dark");
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    localStorage.setItem("agency_role", role);
    
    // Auto shift relevant tabs depending on role for polished UX
    if (role === UserRole.CLIENT) {
      setActiveTabState("ClientPortal");
    } else if (activeTab === "ClientPortal") {
      setActiveTabState("Dashboard");
    }
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
  };

  // Mutators
  const addClient = (c: Omit<Client, "id">) => {
    const newClients = [{ ...c, id: `client-${clients.length + 1}` }, ...clients];
    setClients(newClients);
    sync("agency_clients", newClients);
    addNotification("New Client Registered", `${c.companyName} has been successfully added to CRM`, "client");
  };

  const updateClient = (c: Client) => {
    const newClients = clients.map((cl) => (cl.id === c.id ? c : cl));
    setClients(newClients);
    sync("agency_clients", newClients);
  };

  const addProject = (p: Omit<Project, "id">) => {
    const newP = {
      ...p,
      id: `project-${projects.length + 1}`,
      comments: [],
      attachments: [],
      activityTimeline: [{ id: `act-${Date.now()}`, user: activeRole, action: "Project initialized and budgeted", timestamp: "Just now" }],
    };
    const newProjects = [newP, ...projects];
    setProjects(newProjects);
    sync("agency_projects", newProjects);
    addNotification("Project Created", `${p.projectName} has been registered and scheduled`, "project");
  };

  const updateProject = (p: Project) => {
    const newProjects = projects.map((pr) => (pr.id === p.id ? p : pr));
    setProjects(newProjects);
    sync("agency_projects", newProjects);
  };

  const addProjectComment = (projectId: string, commentText: string) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `pcom-${Date.now()}`,
              user: activeRole === UserRole.CLIENT ? "Client Representative" : "Agency Team",
              role: activeRole,
              text: commentText,
              timestamp: "Just now"
            }
          ]
        };
      }
      return p;
    });
    setProjects(updated);
    sync("agency_projects", updated);
  };

  const addTaskComment = (taskId: string, commentText: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          comments: [
            ...t.comments,
            {
              id: `tcom-${Date.now()}`,
              user: activeRole === UserRole.CLIENT ? "Client Support" : "Developer",
              text: commentText,
              timestamp: "Just now"
            }
          ]
        };
      }
      return t;
    });
    setTasks(updated);
    sync("agency_tasks", updated);
  };

  const addTask = (t: Omit<Task, "id" | "comments" | "attachments" | "timeSpent">) => {
    const newT: Task = {
      ...t,
      id: `task-${tasks.length + 1}`,
      comments: [],
      attachments: [],
      timeSpent: 0,
    };
    const newTasks = [newT, ...tasks];
    setTasks(newTasks);
    sync("agency_tasks", newTasks);
    
    // Auto notify assignee
    const assignedEmp = employees.find((e) => e.id === t.assignedTo);
    addNotification(
      "Task Assigned",
      `Task '${t.title}' assigned to ${assignedEmp ? assignedEmp.name : "Team Member"}`,
      "task"
    );
  };

  const updateTask = (t: Task) => {
    const newTasks = tasks.map((tk) => (tk.id === t.id ? t : tk));
    setTasks(newTasks);
    sync("agency_tasks", newTasks);
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter((t) => t.id !== id);
    setTasks(newTasks);
    sync("agency_tasks", newTasks);
  };

  const addEmployee = (e: Omit<Employee, "id" | "leaves" | "workLogs">) => {
    const newE: Employee = {
      ...e,
      id: `employee-${employees.length + 1}`,
      leaves: [],
      workLogs: [],
    };
    const newEmployees = [newE, ...employees];
    setEmployees(newEmployees);
    sync("agency_employees", newEmployees);
    addNotification("New Employee Onboarded", `${e.name} added under ${e.department} division`, "system");
  };

  const updateEmployee = (e: Employee) => {
    const newEmployees = employees.map((emp) => (emp.id === e.id ? e : emp));
    setEmployees(newEmployees);
    sync("agency_employees", newEmployees);
  };

  const addMeeting = (m: Omit<Meeting, "id">) => {
    const newM = { ...m, id: `meet-${meetings.length + 1}` };
    const newMeetings = [newM, ...meetings];
    setMeetings(newMeetings);
    sync("agency_meetings", newMeetings);
    addNotification("Meeting Scheduled", `'${m.title}' created on ${m.date} at ${m.time}`, "meeting");
  };

  const addInvoice = (inv: Omit<Invoice, "id" | "subtotal" | "total">) => {
    const subtotal = inv.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const tax = subtotal * (inv.taxRate / 100);
    const discount = subtotal * (inv.discountRate / 100);
    const total = Math.round(subtotal + tax - discount);

    const newInv: Invoice = {
      ...inv,
      id: `invoice-${invoices.length + 1}`,
      subtotal,
      total,
    };
    const newInvoices = [newInv, ...invoices];
    setInvoices(newInvoices);
    sync("agency_invoices", newInvoices);
    addNotification("Invoice Generated", `Invoice ${inv.invoiceNumber} created for total ${settings.currency.split(" ")[1] || "$"}${total}`, "invoice");
  };

  const updateInvoice = (inv: Invoice) => {
    const newInvoices = invoices.map((i) => (i.id === inv.id ? inv : i));
    setInvoices(newInvoices);
    sync("agency_invoices", newInvoices);
  };

  // Demo Payment Module implementation
  const payInvoiceDemo = async (invoiceId: string, method: string): Promise<{ success: boolean; transactionId: string; receiptNumber: string }> => {
    return new Promise((resolve) => {
      // Simulate processing animation timing
      setTimeout(() => {
        const inv = invoices.find((i) => i.id === invoiceId);
        if (!inv) {
          resolve({ success: false, transactionId: "", receiptNumber: "" });
          return;
        }

        const transactionId = `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;
        const receiptNumber = `REC-${Math.floor(10000 + Math.random() * 90000)}`;
        const payDate = new Date().toISOString().split("T")[0];

        // 1. Update invoice status
        const updatedInvoice: Invoice = { ...inv, status: "Paid" };
        const newInvoices = invoices.map((i) => (i.id === invoiceId ? updatedInvoice : i));
        setInvoices(newInvoices);
        sync("agency_invoices", newInvoices);

        // 2. Add to payment history
        const newPay: Payment = {
          id: `payment-${payments.length + 1}`,
          transactionId,
          invoiceNumber: inv.invoiceNumber,
          clientId: inv.clientId,
          amount: inv.total,
          paymentMethod: method as any,
          date: payDate,
          status: "Success",
          receiptNumber,
        };
        const newPayments = [newPay, ...payments];
        setPayments(newPayments);
        sync("agency_payments", newPayments);

        // 3. Update active Month Revenue Point (Add to revenue of current month: e.g. July 2026)
        const currentMonthName = "Jul 2026";
        const newRevenue = revenue.map((r) => {
          if (r.month === currentMonthName) {
            return {
              ...r,
              revenue: r.revenue + inv.total,
              profit: r.profit + inv.total,
            };
          }
          return r;
        });
        setRevenue(newRevenue);
        sync("agency_revenue", newRevenue);

        // 4. Send Notification
        addNotification(
          "Payment Received (Demo)",
          `Payment of $${inv.total} received via ${method} for ${inv.invoiceNumber}.`,
          "payment"
        );

        resolve({
          success: true,
          transactionId,
          receiptNumber,
        });
      }, 1500); // Realistic processing delay
    });
  };

  const addContract = (c: Omit<Contract, "id">) => {
    const newC = { ...c, id: `contract-${contracts.length + 1}` };
    const newContracts = [newC, ...contracts];
    setContracts(newContracts);
    sync("agency_contracts", newContracts);
    addNotification("Contract Uploaded", `Agreement document '${c.title}' uploaded successfully`, "system");
  };

  const addFile = (f: Omit<FileItem, "id">) => {
    const newF = { ...f, id: `file-${files.length + 1}` };
    const newFiles = [newF, ...files];
    setFiles(newFiles);
    sync("agency_files", newFiles);
    addNotification("File Uploaded", `Asset '${f.name}' shared inside ${f.folder}`, "system");
  };

  const deleteFile = (id: string) => {
    const newFiles = files.filter((f) => f.id !== id);
    setFiles(newFiles);
    sync("agency_files", newFiles);
  };

  const addNotification = (title: string, message: string, type: AppNotification["type"]) => {
    const newN: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      time: new Date().toLocaleString(),
      read: false,
    };
    setNotifications((prev) => {
      const updated = [newN, ...prev];
      sync("agency_notifications", updated);
      return updated;
    });
  };

  const markNotifRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    sync("agency_notifications", updated);
  };

  const markAllNotifsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    sync("agency_notifications", updated);
  };

  const clearAllNotifs = () => {
    setNotifications([]);
    sync("agency_notifications", []);
  };

  const updateSettings = (s: SystemSettings) => {
    setSettings(s);
    localStorage.setItem("agency_settings", JSON.stringify(s));
    addNotification("Settings Saved", "AgencyOS configurations updated successfully", "system");
  };

  const raiseSupportTicket = (title: string, description: string, priority: string) => {
    const newTicket = {
      id: `tick-${tickets.length + 1}`,
      clientId: clientPortalId,
      title,
      description,
      priority,
      status: "Open",
      date: new Date().toISOString().split("T")[0],
    };
    const updated = [newTicket, ...tickets];
    setTickets(updated);
    sync("agency_tickets", updated);
    addNotification("Support Ticket Raised", `Ticket raised: ${title}`, "client");
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        activeRole,
        activeTab,
        searchQuery,
        clients,
        employees,
        projects,
        tasks,
        invoices,
        payments,
        contracts,
        files,
        notifications,
        meetings,
        revenue,
        settings,
        tickets,
        clientPortalId,
        toggleTheme,
        setActiveRole,
        setActiveTab,
        setSearchQuery,
        setClientPortalId,
        addClient,
        updateClient,
        addProject,
        updateProject,
        addTask,
        updateTask,
        deleteTask,
        addEmployee,
        updateEmployee,
        addMeeting,
        addInvoice,
        updateInvoice,
        payInvoiceDemo,
        addContract,
        addFile,
        deleteFile,
        addNotification,
        markNotifRead,
        markAllNotifsRead,
        clearAllNotifs,
        updateSettings,
        raiseSupportTicket,
        addProjectComment,
        addTaskComment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
