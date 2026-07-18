/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
} from "./types";

// Random color options for initials / avatars
const BG_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-blue-600",
  "from-indigo-500 to-purple-600",
  "from-violet-500 to-fuchsia-600",
];

// Helper to pick stable items
const pickRandom = <T>(arr: T[] | readonly T[], seedIndex: number): T => {
  return arr[seedIndex % arr.length];
};

// Generates 50 clients
export const generateClients = (): Client[] => {
  const industries = ["Software", "Healthcare", "E-commerce", "Real Estate", "Fintech", "Automotive", "Edtech", "Fashion", "Logistics", "Energy"];
  const companies = [
    "Apex", "Nova", "Stellar", "Quantum", "Vertex", "Infinity", "Vanguard", "Genesis", "Aura", "Zenith",
    "Prism", "Echo", "Lumina", "Helix", "Alpha", "Omega", "Stratford", "Aero", "Pulse", "Titan",
    "Nexus", "Matrix", "Catalyst", "Elevate", "Ascent", "Cognitive", "Evolve", "Impact", "Radiant", "Sync",
    "Vivid", "Summit", "Focus", "Stream", "Core", "Optima", "Alliance", "Solstice", "Veritas", "Ironclad",
    "Bold", "True", "NextGen", "Crest", "Oasis", "Beacon", "Spire", "Zephyr", "Nimbus", "Horizon"
  ];
  const suffixes = ["Labs", "Technologies", "Media", "Group", "Solutions", "Ventures", "Systems", "Consulting", "Co", "Digital"];
  const contacts = [
    "Sarah Connor", "John Doe", "Bruce Wayne", "Clark Kent", "Diana Prince", "Tony Stark", "Steve Rogers", "Natasha Romanoff",
    "Peter Parker", "Wanda Maximoff", "Barry Allen", "Arthur Curry", "Hal Jordan", "Oliver Queen", "Bruce Banner", "Selina Kyle",
    "Harvey Dent", "James Gordon", "Lois Lane", "Lex Luthor", "Arthur Pendragon", "Guinevere Du", "Lancelot Link", "Merlin Amber",
    "Luke Skywalker", "Leia Organa", "Han Solo", "Lando Calrissian", "Obi-Wan Kenobi", "Anakin Skywalker", "Padme Amidala", "Mace Windu",
    "Frodo Baggins", "Samwise Gamgee", "Aragorn Elessar", "Legolas Greenleaf", "Gimli Gloin", "Gandalf Grey", "Boromir Denethor", "Arwen Undomiel",
    "Harry Potter", "Hermione Granger", "Ron Weasley", "Albus Dumbledore", "Severus Snape", "Minerva McGonagall", "Sirius Black", "Remus Lupin",
    "Percy Jackson", "Annabeth Chase"
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const comName = `${pickRandom(companies, i)} ${pickRandom(suffixes, i + 3)}`;
    const color = pickRandom(BG_GRADIENTS, i);
    const domain = comName.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
    return {
      id: `client-${i + 1}`,
      companyName: comName,
      logo: color,
      industry: pickRandom(industries, i),
      website: `https://www.${domain}`,
      gstNumber: `27AAACZ${1000 + i}A1Z${i % 9}`,
      address: `${100 + i * 12} Business Park, Suite ${5 + i}, Mumbai, Maharashtra, 400051`,
      contactPerson: contacts[i],
      phone: `+91 98765 4${String(300 + i).padStart(3, "0")}`,
      email: `${contacts[i].toLowerCase().replace(/\s/g, "")}@${domain}`,
      status: i < 35 ? "Active" : i < 45 ? "Lead" : "Inactive",
      notes: `${comName} is a valuable account focusing on scaling their online infrastructure and cloud capabilities. Preferred contact is via email.`,
      tags: [pickRandom(["Enterprise", "High-Value", "Retainer", "SME", "Monthly", "Local", "Global"], i), pickRandom(["Tech-Heavy", "Creative", "Urgent", "Standard"], i + 1)],
    };
  });
};

// Generates 30 employees
export const generateEmployees = (): Employee[] => {
  const firstNames = [
    "Amit", "Priya", "Rahul", "Sneha", "Vikram", "Neha", "Rohan", "Anjali", "Siddharth", "Tanvi",
    "Aditya", "Divya", "Karan", "Pooja", "Arjun", "Ritu", "Varun", "Simran", "Kabir", "Meera",
    "Rishi", "Kriti", "Akash", "Ishita", "Abhishek", "Shreya", "Pranav", "Nisha", "Gaurav", "Aanchal"
  ];
  const lastNames = [
    "Sharma", "Patel", "Mehta", "Joshi", "Verma", "Gupta", "Sen", "Rao", "Nair", "Das",
    "Choudhury", "Bose", "Reddy", "Mishra", "Singh", "Pandey", "Kulkarni", "Deshmukh", "Pillai", "Saxena",
    "Trivedi", "Banerjee", "Dutta", "Bahl", "Malhotra", "Kapoor", "Kapoor", "Roy", "Chatterjee", "Shetty"
  ];
  const departments = ["Engineering", "Design", "Marketing", "Management"] as const;
  const roles = [
    "Senior Full Stack Developer", "Lead UI/UX Designer", "Growth Marketing Lead", "SaaS Technical Architect",
    "Backend Engineer", "Frontend Developer", "Visual Designer", "Copywriter", "SEO Analyst", "Project Manager"
  ];
  const skillsList = ["React", "TypeScript", "Node.js", "Express", "TailwindCSS", "Figma", "Illustrator", "GraphQL", "PostgreSQL", "SEO", "Copywriting", "Next.js", "AWS", "Docker", "Agile", "UI Styling", "Brand Strategy"];

  return Array.from({ length: 30 }, (_, i) => {
    const dept = i < 15 ? "Engineering" : i < 22 ? "Design" : i < 27 ? "Marketing" : "Management";
    let role = "";
    if (dept === "Engineering") {
      role = i % 4 === 0 ? "SaaS Technical Architect" : i % 2 === 0 ? "Senior Full Stack Developer" : "Frontend Developer";
    } else if (dept === "Design") {
      role = i % 2 === 0 ? "Lead UI/UX Designer" : "Visual Designer";
    } else if (dept === "Marketing") {
      role = i % 2 === 0 ? "Growth Marketing Lead" : "SEO Analyst";
    } else {
      role = "Project Manager";
    }

    const first = firstNames[i];
    const last = lastNames[i];
    const salary = dept === "Management" ? 120000 + (i * 2000) : dept === "Engineering" ? 90000 + (i * 1500) : dept === "Design" ? 75000 + (i * 1200) : 60000 + (i * 1000);
    const code = pickRandom(BG_GRADIENTS, i + 5);

    return {
      id: `employee-${i + 1}`,
      name: `${first} ${last}`,
      photo: code,
      role,
      department: dept,
      salary,
      attendance: 90 + (i % 10),
      assignedProjects: [],
      performanceRating: 3.5 + ((i % 4) * 0.5),
      skills: [pickRandom(skillsList, i), pickRandom(skillsList, i + 1), pickRandom(skillsList, i + 2)],
      leaves: [
        { id: `l-${i}-1`, type: "Sick Leave", startDate: "2026-06-10", endDate: "2026-06-11", status: "Approved" },
        { id: `l-${i}-2`, type: "Annual Leave", startDate: "2026-08-15", endDate: "2026-08-22", status: "Pending" }
      ],
      workLogs: [
        { id: `wl-${i}-1`, date: "2026-07-15", hours: 8, description: "Coding active core dashboards and integrating user stores", projectName: "AgencyOS Platform" },
        { id: `wl-${i}-2`, date: "2026-07-16", hours: 7.5, description: "Iterating layout styling and resolving flex box wrap bugs", projectName: "Lumina Redesign" }
      ],
      availability: i % 10 === 0 ? "OOF" : i % 5 === 0 ? "Busy" : "Available",
      email: `${first.toLowerCase()}.${last.toLowerCase()}@zelquent.com`,
      phone: `+91 99988 ${String(100 + i).padStart(3, "0")}45`,
    };
  });
};

// Generates 120 Projects
export const generateProjects = (clients: Client[], employees: Employee[]): Project[] => {
  const pCategories = ["Web App", "Mobile App", "Branding", "IT Support", "SEO & Marketing", "Consulting"] as const;
  const pNames = [
    "SaaS Portal", "E-Commerce Suite", "E-Learning App", "Corporate Redesign", "Brand Identity v2",
    "SEO Optimization", "Mobile Wallet", "Cloud Migration", "Analytics Dashboard", "Marketing Campaign",
    "CRM System", "HR Portal", "API Gateway", "Cybersecurity Audit", "UI Overhaul", "Social Network",
    "Inventory Manager", "Real Estate App", "Travel Planner", "Fitness Tracker", "AI Copywriter",
    "Cryptocurrency Broker", "Billing System", "Customer Portal", "Warehouse Control", "DevOps Pipeline"
  ];
  const pDescriptions = [
    "A comprehensive architectural implementation tailored for modern cross-platform workloads and scale.",
    "Completely restructuring consumer interactions, onboarding flows, checkout funnels, and tracking metrics.",
    "Establishing a recognizable aesthetic paradigm including typography, color guidelines, and media kits.",
    "Strategic deployment of secure pipelines, continuous testing, container environments, and state management.",
    "Deep algorithmic analysis, keyword mappings, search indexing, backlink strategies, and conversion audits."
  ];

  return Array.from({ length: 120 }, (_, i) => {
    const client = pickRandom(clients, i);
    const category = pickRandom(pCategories, i);
    const namePrefix = pickRandom(pNames, i);
    const name = `${client.companyName.split(" ")[0]} ${namePrefix}`;
    const budget = 8000 + (i * 750);
    const startOffsetDays = (i % 15) * 5;
    const endOffsetDays = startOffsetDays + 30 + (i % 5) * 15;
    
    // Dates calculation
    const dDate = new Date();
    dDate.setDate(dDate.getDate() + 45 - (i % 6) * 10);
    const deadline = dDate.toISOString().split("T")[0];

    const progress = i < 20 ? 100 : i < 80 ? Math.floor(20 + (i % 7) * 11) : i < 110 ? 0 : Math.floor(10 + (i % 3) * 20);
    let status: Project["status"] = "In Progress";
    if (progress === 100) status = "Completed";
    else if (progress === 0) status = i % 2 === 0 ? "Planning" : "On Hold";
    else if (progress > 85) status = i % 2 === 0 ? "Review" : "Testing";

    const assignedCount = 2 + (i % 4);
    const assignedMembers: string[] = [];
    for (let j = 0; j < assignedCount; j++) {
      const emp = pickRandom(employees, i + j);
      if (!assignedMembers.includes(emp.id)) {
        assignedMembers.push(emp.id);
      }
    }

    const health: Project["projectHealth"] = progress < 40 && i % 4 === 0 ? "Critical" : progress < 70 && i % 5 === 0 ? "At Risk" : "Healthy";

    return {
      id: `project-${i + 1}`,
      clientId: client.id,
      projectName: name,
      description: pickRandom(pDescriptions, i),
      budget,
      deadline,
      priority: i % 4 === 0 ? "Critical" : i % 3 === 0 ? "High" : i % 2 === 0 ? "Medium" : "Low",
      status,
      progress,
      category,
      assignedMembers,
      milestones: [
        { id: `m-${i}-1`, title: "Requirements Draft & Architecture", dueDate: "2026-06-15", completed: progress > 20 },
        { id: `m-${i}-2`, title: "UI Prototype & Core Theme", dueDate: "2026-07-01", completed: progress > 50 },
        { id: `m-${i}-3`, title: "MVP Release & Sandbox Deploy", dueDate: "2026-08-10", completed: progress === 100 }
      ],
      dependencies: i > 0 && i % 10 === 0 ? [`project-${i}`] : [],
      activityTimeline: [
        { id: `act-${i}-1`, user: "Admin", action: "Created project scope and set milestone timelines", timestamp: "10 days ago" },
        { id: `act-${i}-2`, user: "Lead Dev", action: "Pushed initial React setup and styled core routing layouts", timestamp: "4 days ago" }
      ],
      comments: [
        { id: `com-${i}-1`, user: "Siddharth Sharma", role: "Manager", text: "Please review the responsive menu behaviour on mobile devices and ensure high contrast accessibility standards.", timestamp: "2 days ago" }
      ],
      attachments: [
        { id: `att-${i}-1`, name: "Scope_of_Work.pdf", size: "1.4 MB", url: "#" },
        { id: `att-${i}-2`, name: "Brand_Asset_Pack.zip", size: "12.2 MB", url: "#" }
      ],
      estimatedHours: 80 + (i * 5),
      workedHours: Math.floor((80 + (i * 5)) * (progress / 100)),
      projectHealth: health,
    };
  });
};

// Generates 450 Tasks
export const generateTasks = (projects: Project[], employees: Employee[]): Task[] => {
  const taskPrefixes = [
    "Implement Auth System", "Optimize Database Queries", "Draft Style Guidelines", "Review Brand Typography",
    "Setup CI/CD Workflows", "Create Interactive Dashboard", "Refactor Layout Components", "Add High Contrast Theme Support",
    "Polish Checkout Animation", "Fix Mobile Sizing Padding Bugs", "Draft Email Copy Pack", "Integrate Analytics Tracking",
    "Write End-to-End Tests", "Configure DNS Mail Servers", "Create Client Portal Invoicing UI", "Refactor State Logic Store"
  ];
  
  return Array.from({ length: 450 }, (_, i) => {
    const project = pickRandom(projects, i);
    const emp = pickRandom(employees, i + 2);
    
    const isCompleted = i < 200 || (project.status === "Completed");
    let status: Task["status"] = "To Do";
    if (isCompleted) {
      status = "Completed";
    } else {
      const statuses: Task["status"][] = ["Backlog", "To Do", "In Progress", "Review", "Testing"];
      status = pickRandom(statuses, i);
    }

    const dDate = new Date();
    dDate.setDate(dDate.getDate() + (i % 20) - 10);
    const dueDate = dDate.toISOString().split("T")[0];

    const checklist = [
      { id: `chk-${i}-1`, text: "Review base system dependencies", completed: isCompleted || i % 2 === 0 },
      { id: `chk-${i}-2`, text: "Write comprehensive unit tests", completed: isCompleted },
      { id: `chk-${i}-3`, text: "Verify mobile responsive layouts", completed: isCompleted || i % 3 === 0 }
    ];

    return {
      id: `task-${i + 1}`,
      projectId: project.id,
      title: `${pickRandom(taskPrefixes, i)} [${project.projectName.split(" ")[0]}]`,
      description: "Perform robust integration tests, check for performance blockages in high-density renders, and verify WCAG 2.1 contrast rules.",
      status,
      priority: i % 3 === 0 ? "High" : i % 2 === 0 ? "Medium" : "Low",
      checklist,
      dueDate,
      assignedTo: emp.id,
      labels: [pickRandom(["Feature", "Bugfix", "UI/UX", "Docs", "Refactor", "SEO"], i), pickRandom(["Sprint-1", "Client-Review", "Core-App", "Urgent"], i + 1)],
      comments: [
        { id: `tc-${i}-1`, user: emp.name, text: "Almost finished with the core layout components. Will raise a PR for review tonight.", timestamp: "3 hours ago" }
      ],
      attachments: i % 4 === 0 ? [{ id: `ta-${i}-1`, name: "Mockup_v2.png", size: "320 KB" }] : [],
      timeSpent: isCompleted ? 4 + (i % 8) : 0,
      recurrence: i % 15 === 0 ? "Weekly" : "None",
    };
  });
};

// Generates 250 Invoices
export const generateInvoices = (clients: Client[]): Invoice[] => {
  return Array.from({ length: 250 }, (_, i) => {
    const client = pickRandom(clients, i);
    const issueOffset = (i % 30) * 4;
    const issueDateObj = new Date();
    issueDateObj.setDate(issueDateObj.getDate() - issueOffset);
    const issueDate = issueDateObj.toISOString().split("T")[0];

    const dueDateObj = new Date(issueDateObj);
    dueDateObj.setDate(dueDateObj.getDate() + 15);
    const dueDate = dueDateObj.toISOString().split("T")[0];

    const qty1 = 1 + (i % 3);
    const rate1 = 1500 + (i % 5) * 500;
    const qty2 = i % 2 === 0 ? 1 : 0;
    const rate2 = 800;

    const items = [
      { id: `ii-${i}-1`, description: "Full Stack SaaS Core Engineering Hours", quantity: qty1, unitPrice: rate1, amount: qty1 * rate1 }
    ];
    if (qty2 > 0) {
      items.push({ id: `ii-${i}-2`, description: "UI/UX Figma Design Sprint & Wireframing", quantity: qty2, unitPrice: rate2, amount: qty2 * rate2 });
    }

    const subtotal = items.reduce((acc, it) => acc + it.amount, 0);
    const taxRate = 18; // GST
    const discountRate = i % 10 === 0 ? 5 : 0;
    const tax = Math.round(subtotal * (taxRate / 100));
    const discount = Math.round(subtotal * (discountRate / 100));
    const total = subtotal + tax - discount;

    let status: Invoice["status"] = "Paid";
    if (i < 25) {
      status = "Paid"; // Must have some recently paid
    } else if (i < 45) {
      status = "Sent"; // Outstanding
    } else if (i < 55) {
      status = "Overdue"; // Overdue outstanding
    } else if (i < 65) {
      status = "Draft";
    } else {
      status = "Paid"; // Rest are historic paid
    }

    return {
      id: `invoice-${i + 1}`,
      invoiceNumber: `INV-2026-${String(1000 + i).padStart(4, "0")}`,
      clientId: client.id,
      items,
      taxRate,
      discountRate,
      subtotal,
      total,
      issueDate,
      dueDate,
      status,
      notes: "Thank you for partnering with Zelquent Tech. We appreciate your prompt payment in business accounts.",
      terms: "Payment is due within 15 days of invoice issue date. Late fees of 2% monthly may apply."
    };
  });
};

// Generates 180 Payments matching Paid Invoices
export const generatePayments = (invoices: Invoice[]): Payment[] => {
  const paidInvoices = invoices.filter((inv) => inv.status === "Paid");
  const methods: Payment["paymentMethod"][] = ["UPI", "Credit Card", "Debit Card", "Wallet", "Net Banking", "Bank Transfer", "Cash"];

  return Array.from({ length: 180 }, (_, i) => {
    const inv = pickRandom(paidInvoices, i);
    const payDateObj = new Date(inv.issueDate);
    payDateObj.setDate(payDateObj.getDate() + (i % 5));
    const payDate = payDateObj.toISOString().split("T")[0];

    return {
      id: `payment-${i + 1}`,
      transactionId: `TXN-${9000000 + i * 15321}`,
      invoiceNumber: inv.invoiceNumber,
      clientId: inv.clientId,
      amount: inv.total,
      paymentMethod: pickRandom(methods, i),
      date: payDate,
      status: "Success",
      receiptNumber: `REC-2026-${String(5000 + i).padStart(4, "0")}`
    };
  });
};

// Generates 100 Contracts
export const generateContracts = (clients: Client[]): Contract[] => {
  const titles = [
    "Service Master Level Agreement", "Non-Disclosure Agreement (NDA)", "Vanguard App Scope Statement",
    "Acme Corp Quotation and Proposal", "E-Commerce Retainer Contract", "Strategic Advisory Terms",
    "Digital Branding Rights Assignment", "Security Compliance Audit Agreement"
  ];
  const types: Contract["type"][] = ["Agreement", "NDA", "Proposal", "Quotation"];
  const statuses: Contract["status"][] = ["Signed", "Pending Review", "Draft", "Expired"];

  return Array.from({ length: 100 }, (_, i) => {
    const client = pickRandom(clients, i);
    const contractType = pickRandom(types, i);
    const title = `${client.companyName.split(" ")[0]} - ${pickRandom(titles, i)}`;
    const status = i < 60 ? "Signed" : i < 80 ? "Pending Review" : i < 95 ? "Draft" : "Expired";

    const dDate = new Date();
    dDate.setDate(dDate.getDate() - (i % 30) * 3);
    const dateUploaded = dDate.toISOString().split("T")[0];

    return {
      id: `contract-${i + 1}`,
      title,
      type: contractType,
      status,
      version: `v1.${i % 3}`,
      dateUploaded,
      fileSize: `${1.2 + (i % 5) * 0.8} MB`,
      url: "#"
    };
  });
};

// Generates 300 Files
export const generateFiles = (employees: Employee[]): FileItem[] => {
  const folders = ["Client Deliverables", "Asset Kit", "Contract Documents", "Invoices", "Figma Archives", "Source Code Backup"];
  const extensions = ["png", "pdf", "zip", "tsx", "mp4", "jpg", "json"];
  const fileNames = [
    "DashboardMockup", "AgreementSigned", "BrandGuidelines", "BillingLogs", "DatabaseSchema",
    "LandingPageConcept", "ClientVideoTeaser", "WebpackConfig", "MarketingBanners", "AuditReport"
  ];

  return Array.from({ length: 300 }, (_, i) => {
    const ext = pickRandom(extensions, i);
    const baseName = pickRandom(fileNames, i);
    const name = `${baseName}_${i + 1}.${ext}`;
    
    let type: FileItem["type"] = "document";
    if (["png", "jpg"].includes(ext)) type = "image";
    else if (ext === "mp4") type = "video";
    else if (ext === "zip") type = "zip";
    else if (["tsx", "json"].includes(ext)) type = "code";

    const folder = pickRandom(folders, i);
    const uploader = pickRandom(employees, i);

    const dDate = new Date();
    dDate.setDate(dDate.getDate() - (i % 40));
    const dateUploaded = dDate.toISOString().split("T")[0];

    return {
      id: `file-${i + 1}`,
      name,
      type,
      size: `${120 + (i % 10) * 45} KB`,
      folder,
      tags: [pickRandom(["Design", "Production", "Backup", "Signed", "Draft"], i), pickRandom(["V2", "Core", "Asset", "Final"], i + 1)],
      uploadedBy: uploader.name,
      dateUploaded,
    };
  });
};

// Generates 150 Notifications
export const generateNotifications = (): AppNotification[] => {
  const types: AppNotification["type"][] = ["task", "invoice", "payment", "project", "meeting", "client", "system"];
  const titles = [
    "Task Assigned", "Invoice Paid", "Payment Received", "Project Milestone Nearing Deadline",
    "Meeting Reminder", "New Client Signed On", "Core Platform Updated to v1.2"
  ];
  const messages = [
    "You have been assigned to 'Fix Sizing Padding Bugs' under Apex Retail SaaS Portal.",
    "Invoice INV-2026-1032 has been paid in full via UPI.",
    "A direct Bank Transfer payment of $12,500 has been verified successfully.",
    "Milestone 'UI Prototype and Core Theme' is due in less than 48 hours.",
    "Client Sync with Apex Labs is scheduled in 15 minutes. Join via Google Meet.",
    "SaaS ventures has completed client onboarding and generated a Lead ticket.",
    "AgencyOS has deployed security patches. Standard session lengths have updated."
  ];

  return Array.from({ length: 150 }, (_, i) => {
    const typeIndex = i % types.length;
    
    const dDate = new Date();
    dDate.setMinutes(dDate.getMinutes() - (i * 25));
    const time = dDate.toLocaleString();

    return {
      id: `notif-${i + 1}`,
      title: pickRandom(titles, i),
      message: pickRandom(messages, i),
      type: types[typeIndex],
      time,
      read: i > 12 // first 12 unread
    };
  });
};

// Generates 24 Months Revenue History
export const generateRevenueHistory = (): RevenuePoint[] => {
  const months = [
    "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024",
    "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025",
    "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025",
    "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026"
  ];

  let baseRevenue = 145000;
  return months.map((month, i) => {
    // Upward trend over months
    baseRevenue += 4500 + Math.sin(i) * 8000;
    const expenses = Math.round(baseRevenue * 0.55 + Math.cos(i) * 4000);
    const profit = Math.round(baseRevenue - expenses);
    return {
      month,
      revenue: Math.round(baseRevenue),
      expenses,
      profit,
    };
  });
};

// Generates 15 Upcoming meetings
export const generateMeetings = (clients: Client[], employees: Employee[]): Meeting[] => {
  const agendas = [
    "Sprint Review & Backlog Triage", "Design Approval & Color Palette Alignment",
    "Technical Architecture Overview & API Mapping", "Onboarding Briefing & Scope Finalization",
    "Growth & Brand Strategy Monthly Retrospective"
  ];
  const meetingsList: Meeting[] = [];
  const hours = [10, 11, 13, 14, 15, 16];

  for (let i = 0; i < 15; i++) {
    const client = pickRandom(clients, i);
    const emp = pickRandom(employees, i);
    const dDate = new Date();
    dDate.setDate(dDate.getDate() + (i % 7) - 2); // some past, some upcoming
    const dStr = dDate.toISOString().split("T")[0];

    meetingsList.push({
      id: `meet-${i + 1}`,
      title: `${client.companyName.split(" ")[0]} Sync`,
      date: dStr,
      time: `${pickRandom(hours, i)}:00`,
      duration: i % 2 === 0 ? 30 : 60,
      invitees: [emp.id, `client-${client.id}`],
      agenda: pickRandom(agendas, i),
      notes: "Take detailed logs of all client design iterations, scope shifts, and timeline changes to update in the PM log.",
      status: dDate.getDate() < new Date().getDate() ? "Completed" : "Scheduled",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      isClientMeeting: i % 3 !== 0,
    });
  }

  return meetingsList;
};
