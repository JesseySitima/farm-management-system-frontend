import type { UserRole } from '../types/auth'

export interface NavigationItem {
  label: string
  path: string
  icon: string
}

export const navigationByRole: Record<UserRole, NavigationItem[]> = {
  'System Administrator': [
    { label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
    { label: 'Farms', path: '/farms', icon: 'warehouse' },
    { label: 'Users', path: '/users', icon: 'users' },
    { label: 'Roles & Permissions', path: '/roles', icon: 'shield-check' },
    { label: 'Reports', path: '/reports', icon: 'chart-column' },
    { label: 'System Settings', path: '/settings', icon: 'settings' },
  ],

  'Farm Owner': [
    { label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
    { label: 'Farms', path: '/farms', icon: 'warehouse' },
    { label: 'Livestock', path: '/livestock', icon: 'beef' },
     { label: 'Species', path: '/species', icon: 'beef' },
    { label: 'Staff', path: '/staff', icon: 'users' },
    { label: 'Finances', path: '/finances', icon: 'wallet' },
    { label: 'Reports', path: '/reports', icon: 'chart-column' },
  ],

  'Farm Manager': [
    { label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
    { label: 'Livestock', path: '/livestock', icon: 'beef' },
    { label: 'Breeding', path: '/breeding', icon: 'heart' },
    { label: 'Health Records', path: '/health', icon: 'heart-pulse' },
    { label: 'Staff', path: '/staff', icon: 'users' },
    { label: 'Reports', path: '/reports', icon: 'chart-column' },
  ],

  'Farm Supervisor': [
    { label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
    { label: 'Livestock', path: '/livestock', icon: 'beef' },
    { label: 'Daily Activities', path: '/activities', icon: 'clipboard-list' },
    { label: 'Tasks', path: '/tasks', icon: 'list-checks' },
    { label: 'Health Records', path: '/health', icon: 'heart-pulse' },
  ],

  'Farm Worker': [
    { label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
    { label: 'My Tasks', path: '/tasks', icon: 'list-checks' },
    { label: 'Daily Activities', path: '/activities', icon: 'clipboard-list' },
    { label: 'My Livestock', path: '/livestock', icon: 'beef' },
  ],

  Accountant: [
    { label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
    { label: 'Income', path: '/income', icon: 'trending-up' },
    { label: 'Expenses', path: '/expenses', icon: 'trending-down' },
    { label: 'Transactions', path: '/transactions', icon: 'receipt' },
    { label: 'Financial Reports', path: '/reports', icon: 'chart-column' },
  ],

  Storekeeper: [
    { label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
    { label: 'Inventory', path: '/inventory', icon: 'boxes' },
    { label: 'Stock Movements', path: '/stock-movements', icon: 'package' },
    { label: 'Suppliers', path: '/suppliers', icon: 'truck' },
    { label: 'Stock Reports', path: '/reports', icon: 'chart-column' },
  ],
}