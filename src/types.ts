/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  OWNER = "Owner",
  MANAGER = "Manager",
  DEVELOPER = "Developer",
  DESIGNER = "Designer",
  MARKETING = "Marketing",
  CLIENT = "Client",
}

export interface Client {
  id: string;
  companyName: string;
  logo: string; // Tailwind color or icon/photo placeholder
  industry: string;
  website: string;
  gstNumber: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive" | "Lead";
  notes: string;
  tags: string[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface ProjectActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

export interface Project {
  id: string;
  clientId: string;
  projectName: string;
  description: string;
  budget: number;
  deadline: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Planning" | "In Progress" | "Review" | "Testing" | "Completed" | "On Hold";
  progress: number; // 0 to 100
  category: "Web App" | "Mobile App" | "Branding" | "IT Support" | "SEO & Marketing" | "Consulting";
  assignedMembers: string[]; // Team member IDs
  milestones: ProjectMilestone[];
  dependencies: string[]; // Project IDs
  activityTimeline: ProjectActivity[];
  comments: { id: string; user: string; role: string; text: string; timestamp: string }[];
  attachments: { id: string; name: string; size: string; url: string }[];
  estimatedHours: number;
  workedHours: number;
  projectHealth: "Healthy" | "At Risk" | "Critical";
}

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "Backlog" | "To Do" | "In Progress" | "Review" | "Testing" | "Completed";
  priority: "Low" | "Medium" | "High";
  checklist: TaskChecklistItem[];
  dueDate: string;
  assignedTo: string; // Team member ID
  labels: string[];
  comments: { id: string; user: string; text: string; timestamp: string }[];
  attachments: { id: string; name: string; size: string }[];
  timeSpent: number; // in hours
  recurrence?: "None" | "Daily" | "Weekly" | "Monthly";
}

export interface WorkLogEntry {
  id: string;
  date: string;
  hours: number;
  description: string;
  projectName: string;
}

export interface Employee {
  id: string;
  name: string;
  photo: string; // Accent styling class
  role: string;
  department: "Engineering" | "Design" | "Marketing" | "Management";
  salary: number;
  attendance: number; // percentage
  assignedProjects: string[]; // Project IDs
  performanceRating: number; // 1 to 5 stars
  skills: string[];
  leaves: { id: string; type: string; startDate: string; endDate: string; status: "Approved" | "Pending" | "Rejected" }[];
  workLogs: WorkLogEntry[];
  availability: "Available" | "Busy" | "OOF" | "Part-Time";
  email: string;
  phone: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number; // minutes
  invitees: string[]; // Team member or client IDs
  agenda: string;
  notes: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  meetingLink?: string;
  isClientMeeting: boolean;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  items: InvoiceItem[];
  taxRate: number; // percentage (e.g. 18 for GST)
  discountRate: number; // percentage
  subtotal: number;
  total: number;
  issueDate: string;
  dueDate: string;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  notes?: string;
  terms?: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  invoiceNumber: string;
  clientId: string;
  amount: number;
  paymentMethod: "UPI" | "Credit Card" | "Debit Card" | "Wallet" | "Net Banking" | "Bank Transfer" | "Cash";
  date: string;
  status: "Success" | "Pending" | "Failed";
  receiptNumber: string;
}

export interface Contract {
  id: string;
  title: string;
  type: "Proposal" | "Quotation" | "Agreement" | "NDA";
  status: "Draft" | "Pending Review" | "Signed" | "Expired";
  version: string;
  dateUploaded: string;
  fileSize: string;
  url?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "zip" | "code";
  size: string;
  folder: string;
  tags: string[];
  uploadedBy: string;
  dateUploaded: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "task" | "invoice" | "payment" | "project" | "meeting" | "client" | "system";
  time: string;
  read: boolean;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}
