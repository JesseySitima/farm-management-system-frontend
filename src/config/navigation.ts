import type { UserRole } from "../types/auth";

export interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  section?: string;
}

export const navigationByRole: Record<UserRole, NavigationItem[]> = {
  "System Administrator": [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "layout-dashboard",
      section: "Overview",
    },
    {
      label: "Farms",
      path: "/farms",
      icon: "warehouse",
      section: "Farm Management",
    },
    {
      label: "Users",
      path: "/users",
      icon: "users",
      section: "Administration",
    },
    {
      label: "Roles & Permissions",
      path: "/roles",
      icon: "shield-check",
      section: "Administration",
    },
    {
      label: "Reports",
      path: "/reports",
      icon: "chart-column",
      section: "Reports & Analytics",
    },
    {
      label: "System Settings",
      path: "/settings",
      icon: "settings",
      section: "Administration",
    },
  ],

  "Farm Owner": [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "layout-dashboard",
      section: "Overview",
    },
    {
      label: "Farms",
      path: "/farms",
      icon: "warehouse",
      section: "Farm Management",
    },
    {
      label: "Products",
      path: "/products",
      icon: "package",
      section: "Collections Management",
    },
    {
      label: "Livestock",
      path: "/livestock",
      icon: "beef",
      section: "Livestock Management",
    },
    {
      label: "Flocks",
      path: "/flocks",
      icon: "users",
      section: "Livestock Management",
    },
    {
      label: "Species",
      path: "/species",
      icon: "beef",
      section: "Livestock Management",
    },
    {
      label: "Staff",
      path: "/staff",
      icon: "users",
      section: "Farm Management",
    },
    {
      label: "Finances",
      path: "/finances",
      icon: "wallet",
      section: "Finance & Reports",
    },
    {
      label: "Reports",
      path: "/reports",
      icon: "chart-column",
      section: "Finance & Reports",
    },
    {
      label: "Inventory",
      path: "/inventory",
      icon: "boxes",
      section: "Inventory Management",
    },
    {
      label: "Inventory Categories",
      path: "/inventory/categories",
      icon: "tags",
      section: "Inventory Management",
    },
    {
      label: "Inventory Items",
      path: "/inventory/items",
      icon: "tags",
      section: "Inventory Management",
    },
    {
      label: "Stock Receiving",
      path: "inventory/stock-receiving",
      icon: "tags",
      section: "Inventory Management",
    },
    {
      label: "Stock Movements",
      path: "/inventory/stock-movements",
      icon: "arrow-left-right",
      section: "Inventory Management",
    },
    {
      label: "Suppliers",
      path: "/suppliers",
      icon: "truck",
      section: "Inventory Management",
    },
    {
      label: "Stock Reports",
      path: "/reports",
      icon: "chart-column",
      section: "Reports & Analytics",
    },
  ],

  "Farm Manager": [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "layout-dashboard",
      section: "Overview",
    },
    {
      label: "Livestock",
      path: "/livestock",
      icon: "beef",
      section: "Livestock Management",
    },
    {
      label: "Breeding",
      path: "/breeding",
      icon: "heart",
      section: "Livestock Management",
    },
    {
      label: "Health Records",
      path: "/health",
      icon: "heart-pulse",
      section: "Livestock Management",
    },
    {
      label: "Staff",
      path: "/staff",
      icon: "users",
      section: "Farm Operations",
    },
    {
      label: "Reports",
      path: "/reports",
      icon: "chart-column",
      section: "Reports & Analytics",
    },
  ],

  "Farm Supervisor": [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "layout-dashboard",
      section: "Overview",
    },
    {
      label: "Livestock",
      path: "/livestock",
      icon: "beef",
      section: "Livestock Management",
    },
    {
      label: "Daily Activities",
      path: "/activities",
      icon: "clipboard-list",
      section: "Farm Operations",
    },
    {
      label: "Tasks",
      path: "/tasks",
      icon: "list-checks",
      section: "Farm Operations",
    },
    {
      label: "Health Records",
      path: "/health",
      icon: "heart-pulse",
      section: "Livestock Management",
    },
  ],

  "Farm Worker": [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "layout-dashboard",
      section: "Overview",
    },
    {
      label: "My Tasks",
      path: "/tasks",
      icon: "list-checks",
      section: "My Work",
    },
    {
      label: "Daily Activities",
      path: "/activities",
      icon: "clipboard-list",
      section: "My Work",
    },
    {
      label: "My Livestock",
      path: "/livestock",
      icon: "beef",
      section: "Livestock Management",
    },
  ],

  Accountant: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "layout-dashboard",
      section: "Overview",
    },
    {
      label: "Income",
      path: "/income",
      icon: "trending-up",
      section: "Financial Management",
    },
    {
      label: "Expenses",
      path: "/expenses",
      icon: "trending-down",
      section: "Financial Management",
    },
    {
      label: "Transactions",
      path: "/transactions",
      icon: "receipt",
      section: "Financial Management",
    },
    {
      label: "Financial Reports",
      path: "/reports",
      icon: "chart-column",
      section: "Reports & Analytics",
    },
  ],

  Storekeeper: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "layout-dashboard",
      section: "Overview",
    },
    {
      label: "Inventory",
      path: "/inventory",
      icon: "boxes",
      section: "Inventory Management",
    },
    {
      label: "Inventory Categories",
      path: "/inventory/categories",
      icon: "tags",
      section: "Inventory Management",
    },
    {
      label: "Stock Movements",
      path: "/stock-movements",
      icon: "arrow-left-right",
      section: "Inventory Management",
    },
    {
      label: "Suppliers",
      path: "/suppliers",
      icon: "truck",
      section: "Inventory Management",
    },
    {
      label: "Stock Reports",
      path: "/reports",
      icon: "chart-column",
      section: "Reports & Analytics",
    },
  ],
};
