import { useEffect, useMemo, ComponentType } from "react";
import {
  LayoutDashboard,
  Building,
  Briefcase,
  CheckSquare,
  Users,
  DollarSign,
  Calendar,
  Folder,
  Sparkles,
  Settings,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types";

export interface NavItem {
  id: string;
  label: string;
  icon: ComponentType<any>;
  roles: UserRole[];
}

export const useNavigation = () => {
  const { activeRole, activeTab, setActiveTab } = useApp();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        id: "Dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.DEVELOPER],
      },
      {
        id: "CRM",
        label: "CRM",
        icon: Building,
        roles: [UserRole.OWNER, UserRole.MANAGER],
      },
      {
        id: "Projects",
        label: "Projects",
        icon: Briefcase,
        roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.DEVELOPER],
      },
      {
        id: "Kanban",
        label: "Kanban",
        icon: CheckSquare,
        roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.DEVELOPER],
      },
      {
        id: "Team",
        label: "Team Space",
        icon: Users,
        roles: [UserRole.OWNER, UserRole.MANAGER],
      },
      {
        id: "Finance",
        label: "Finance & Bills",
        icon: DollarSign,
        roles: [UserRole.OWNER, UserRole.MANAGER],
      },
      {
        id: "Meetings",
        label: "Meetings",
        icon: Calendar,
        roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.DEVELOPER, UserRole.CLIENT],
      },
      {
        id: "Files",
        label: "Documents",
        icon: Folder,
        roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.DEVELOPER, UserRole.CLIENT],
      },
      {
        id: "ClientPortal",
        label: "Client Portal",
        icon: Sparkles,
        roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.CLIENT],
      },
      {
        id: "Settings",
        label: "Settings",
        icon: Settings,
        roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.DEVELOPER, UserRole.CLIENT],
      },
    ],
    []
  );

  // Dynamic sidebar menu filtering
  const filteredNav = useMemo(() => {
    return navItems.filter((item) => item.roles.includes(activeRole));
  }, [navItems, activeRole]);

  // Current path/navigation item determination
  const currentNavItem = useMemo(() => {
    return navItems.find((item) => item.id === activeTab) || null;
  }, [navItems, activeTab]);

  // Handle safe navigation that enforces role validation
  const handleNavigate = (tabId: string) => {
    const targetItem = navItems.find((item) => item.id === tabId);
    if (targetItem && targetItem.roles.includes(activeRole)) {
      setActiveTab(tabId);
    } else {
      console.warn(`Role-based access violation blocked: Navigation to '${tabId}' is restricted for role: ${activeRole}`);
    }
  };

  // Strictly enforce role-based access and handle automatic fallback on role switch
  useEffect(() => {
    const currentItem = navItems.find((item) => item.id === activeTab);
    const isAllowed = currentItem?.roles.includes(activeRole);

    if (!isAllowed) {
      if (activeRole === UserRole.CLIENT) {
        setActiveTab("ClientPortal");
      } else {
        setActiveTab("Dashboard");
      }
    }
  }, [activeRole, activeTab, navItems, setActiveTab]);

  return {
    navItems,
    filteredNav,
    currentNavItem,
    handleNavigate,
    activeRole,
    activeTab,
  };
};
