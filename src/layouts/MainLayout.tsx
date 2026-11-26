
import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
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
} from 'lucide-react'

import { navigationByRole } from '../config/navigation'
import type { UserRole } from '../types/auth'

const iconMap = {
  'layout-dashboard': LayoutDashboard,
  warehouse: Warehouse,
  users: Users,
  'shield-check': ShieldCheck,
  'chart-column': ChartColumn,
  settings: Settings,
  beef: Beef,
  wallet: Wallet,
  heart: Heart,
  'heart-pulse': HeartPulse,
  'clipboard-list': ClipboardList,
  'list-checks': ListChecks,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  receipt: Receipt,
  boxes: Boxes,
  package: Package,
  truck: Truck,
}

function MainLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const user = JSON.parse(
    sessionStorage.getItem('user') || '{}'
  )

  const role = user.role_name as UserRole
  const navigationItems = navigationByRole[role] || []

  const handleLogout = () => {
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">

      {/* Header */}
      <header className="h-16 shrink-0 bg-white border-b
        border-gray-200 flex items-center justify-between
        px-5 z-30">

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-600"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="flex items-center gap-2 text-green-800">
            <Sprout size={28} />
            <span className="font-bold text-lg">
              Farm Management
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-800">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-gray-500">
              {user.role_name}
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-2 text-gray-600
              hover:text-red-600 transition"
          >
            <LogOut size={19} />
            <span className="hidden sm:block text-sm">
              Logout
            </span>
          </button>
        </div>
      </header>

      {/* Application body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-16 bottom-16
              bg-black/30 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            w-64 shrink-0 bg-white border-r border-gray-200
            flex flex-col p-4 overflow-y-auto
            fixed md:static top-16 bottom-16 z-20
            transition-transform duration-200
            ${sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full md:translate-x-0'}
          `}
        >
          <p className="text-xs font-semibold text-gray-400
            uppercase tracking-wider mb-4 px-3">
            Main Menu
          </p>

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = iconMap[
                item.icon as keyof typeof iconMap
              ]

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg
                    text-sm font-medium transition
                    ${isActive
                      ? 'bg-green-50 text-green-800'
                      : 'text-gray-600 hover:bg-gray-50'}`
                  }
                >
                  {Icon && <Icon size={19} />}
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </aside>

        {/* Scrollable page content */}
        <main className="flex-1 min-w-0 min-h-0
          overflow-y-auto p-5 md:p-8">
          <Outlet />
        </main>

      </div>

      {/* Fixed footer */}
      <footer className="h-14 shrink-0 bg-white
        border-t border-gray-200 px-6 flex
        items-center justify-center z-30">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Farm Management System.
          All rights reserved.
        </p>
      </footer>

    </div>
  )
}

export default MainLayout
