import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";

import {
  Sprout,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Warehouse,
  Users,
  ShieldCheck,
  ChartColumn,
  Settings,
  Beef,
  Wallet,
  Heart,
  HeartPulse,
  ClipboardList,
  ListChecks,
  TrendingUp,
  TrendingDown,
  Receipt,
  Boxes,
  Package,
  Truck,
  Tags,
  PawPrint,
  ArrowLeftRight,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { navigationByRole } from "../config/navigation";
import type { UserRole } from "../types/auth";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  warehouse: Warehouse,
  users: Users,
  "shield-check": ShieldCheck,
  "chart-column": ChartColumn,
  settings: Settings,
  beef: Beef,
  "paw-print": PawPrint,
  wallet: Wallet,
  heart: Heart,
  "heart-pulse": HeartPulse,
  "clipboard-list": ClipboardList,
  "list-checks": ListChecks,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  receipt: Receipt,
  boxes: Boxes,
  package: Package,
  truck: Truck,
  tags: Tags,
  "arrow-left-right": ArrowLeftRight,
};

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const role = user.role_name as UserRole;
  const navigationItems = navigationByRole[role] || [];

  // Find the section containing the current page
  const activeItem = navigationItems.find(
    (item) =>
      location.pathname === item.path ||
      location.pathname.startsWith(`${item.path}/`),
  );

  // Automatically expand the active page's section
  // whenever the user navigates to another page
  useEffect(() => {
    setExpandedSection(activeItem?.section ?? null);
  }, [location.pathname, role]);

  const handleSectionToggle = (section: string) => {
    setExpandedSection((current) => (current === section ? null : section));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header
        className="h-16 shrink-0 bg-white border-b
        border-gray-200 flex items-center justify-between
        px-5 z-30"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-600"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="flex items-center gap-2 text-green-800">
            <Sprout size={28} />
            <span className="font-bold text-lg">Farm Management</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-800">
              {user.first_name} {user.last_name}
            </p>

            <p className="text-xs text-gray-500">{user.role_name}</p>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-2 text-gray-600
              hover:text-red-600 transition"
          >
            <LogOut size={19} />

            <span className="hidden sm:block text-sm">Logout</span>
          </button>
        </div>
      </header>

      {/* Application body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-16 bottom-14
              bg-black/30 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            w-64 shrink-0 bg-white border-r border-gray-200
            flex flex-col p-4 overflow-y-auto
            fixed md:static top-16 bottom-14 z-20
            transition-transform duration-200
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }
          `}
        >
          <nav className="space-y-4">
            {navigationItems.map((item, index) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];

              const showSectionHeading =
                item.section &&
                item.section !== navigationItems[index - 1]?.section;

              const isExpanded = item.section === expandedSection;

              return (
                <div key={item.path}>
                  {/* Section heading */}
                  {showSectionHeading && item.section && (
                    <button
                      type="button"
                      onClick={() => handleSectionToggle(item.section!)}
                      className="w-full flex items-center
                        justify-between px-3 py-2 mb-1
                        text-xs font-semibold text-gray-400
                        uppercase tracking-wider
                        hover:text-green-800 transition"
                    >
                      <span>{item.section}</span>

                      {isExpanded ? (
                        <ChevronDown size={15} />
                      ) : (
                        <ChevronRight size={15} />
                      )}
                    </button>
                  )}

                  {/* Navigation link */}
                  {(!item.section || isExpanded) && (
                    <NavLink
                      to={item.path}
                      end
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5
                        rounded-lg text-sm font-medium transition
                        ${
                          isActive
                            ? "bg-green-50 text-green-800"
                            : "text-gray-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      {Icon && <Icon size={19} />}
                      {item.label}
                    </NavLink>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Scrollable page content */}
        <main
          className="flex-1 min-w-0 min-h-0
          overflow-y-auto p-5 md:p-8"
        >
          <Outlet />
        </main>
      </div>

      {/* Fixed footer */}
      <footer
        className="h-14 shrink-0 bg-white
        border-t border-gray-200 px-6 flex
        items-center justify-center z-30"
      >
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Farm Management System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default MainLayout;
