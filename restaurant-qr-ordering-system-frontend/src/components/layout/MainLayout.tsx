import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from './Sidebar'
import Header from './Header'
import { COLORS } from '../../styles/theme'
import type { NavItem } from './Sidebar'

export function MainLayout({ title, nav }: { title?: string; nav?: NavItem[] }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bg }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}
          />
          <p className="text-sm font-medium" style={{ color: COLORS.textSecondary }}>
            Loading your workspace…
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/admin/dashboard') return 'Dashboard Overview'
    if (path.includes('/admin/staff')) return 'Staff Management'
    if (path.includes('/admin/menu')) return 'Menu Management'
    if (path.includes('/admin/orders')) return 'Order Management'
    if (path.includes('/admin/billing')) return 'Billing Management'
    if (path.includes('/admin/stock')) return 'Stock Management'
    if (path.includes('/admin/tables')) return 'Table Management'
    if (path.includes('/admin/settings')) return 'System Settings'
    if (path.includes('/admin/logs')) return 'Activity Logs'
    if (path === '/manager/dashboard') return 'Dashboard Overview'
    if (path.includes('/manager/menu')) return 'Menu Management'
    if (path.includes('/manager/orders')) return 'Orders'
    if (path.includes('/manager/tables')) return 'Tables Status'
    if (path.includes('/manager/bills')) return 'Bills'
    if (path.includes('/manager/reports')) return 'Business Reports'
    if (path.includes('/kitchen')) return 'Kitchen Display'
    if (path.includes('/bar')) return 'Bar Display'
    if (path === '/cashier/dashboard') return 'Dashboard Overview'
    if (path.includes('/cashier/bills')) return 'Pending Bills'
    if (path.includes('/cashier/pay')) return 'Process Payment'
    if (path.includes('/cashier/history')) return 'Payment History'
    if (path.includes('/cashier/shift')) return 'Shift Summary'
    if (path === '/waiter/dashboard') return 'Dashboard Overview'
    if (path.includes('/waiter/tables')) return 'My Tables'
    if (path.includes('/waiter/orders')) return 'My Orders'
    if (path === '/profile') return 'My Profile'
    if (path === '/notifications') return 'Notifications'
    if (path === '/settings') return 'Settings'
    if (path === '/change-password') return 'Change Password'
    return title || 'Azzurri Rwanda Restaurant'
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: COLORS.bg }}>
      {/*
        ONE single Sidebar component.
        On desktop (lg+): always visible via CSS (lg:translate-x-0 lg:static).
        On mobile: slides in/out based on isMobileSidebarOpen.
        The Sidebar component itself handles the overlay and the transform.
      */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main panel — takes all remaining space */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={getPageTitle()}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
