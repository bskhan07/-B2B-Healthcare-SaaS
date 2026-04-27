import {
  LayoutDashboard,
  Users,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
  children?: NavItem[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigationConfig: NavGroup[] = [
  {
    title: "Main",
    items: [
      {
        id: "dashboard",
        label: "Home",
        icon: LayoutDashboard,
        path: "/",
      },
      {
        id: "patients",
        label: "Patient Details",
        icon: Users,
        path: "/patients",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        path: "/analytics",
      },
    ],
  },
];
