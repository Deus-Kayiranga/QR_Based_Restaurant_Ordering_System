import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { MainLayout } from '../components/layout/MainLayout'
import Sidebar, { type NavItem } from '../components/layout/Sidebar'
import { CartProvider } from '../contexts/CartContext'
import { TableSessionProvider } from '../contexts/TableSessionContext'
import { ActivityLogsPage } from '../pages/super-admin/ActivityLogsPage'
import { DashboardPage as AdminDashboard } from '../pages/super-admin/DashboardPage'
import { StaffDetailPage } from '../pages/super-admin/StaffDetailPage'
import StaffManagementPage from '../pages/super-admin/StaffManagementPage'
import { SystemSettingsPage } from '../pages/super-admin/SystemSettingsPage'
import { TableManagementPage } from '../pages/super-admin/TableManagementPage'
import { MenuManagementPage as AdminMenuManagementPage } from '../pages/super-admin/MenuManagementPage'
import { OrderManagementPage as AdminOrderManagementPage } from '../pages/super-admin/OrderManagementPage'
import { BillingManagementPage as AdminBillingManagementPage } from '../pages/super-admin/BillingManagementPage'
import { StockManagementPage as AdminStockManagementPage } from '../pages/super-admin/StockManagementPage'
import { BillsPage } from '../pages/manager/BillsPage'
import ManagerDashboard from '../pages/manager/DashboardPage'
import { MenuItemDetailPage } from '../pages/manager/MenuItemDetailPage'
import MenuManagementPage from '../pages/manager/MenuManagementPage'
import OrdersPage from '../pages/manager/OrdersPage'
import ReportsPage from '../pages/manager/ReportsPage'
import { TablesStatusPage } from '../pages/manager/TablesStatusPage'
import CashierDashboard from '../pages/cashier/DashboardPage'
import PaymentHistoryPage from '../pages/cashier/PaymentHistoryPage'
import { PaymentProcessingPage } from '../pages/cashier/PaymentProcessingPage'
import { PendingBillsPage } from '../pages/cashier/PendingBillsPage'
import { ShiftSummaryPage } from '../pages/cashier/ShiftSummaryPage'
import BarDisplayPage from '../pages/kitchen/BarDisplayPage'
import BarDashboard from '../pages/kitchen/BarDashboard'
import BarStockPage from '../pages/kitchen/BarStockPage'
import KitchenDashboard from '../pages/kitchen/KitchenDashboard'
import KitchenDisplayPage from '../pages/kitchen/KitchenDisplayPage'
import WaiterDashboard from '../pages/waiter/DashboardPage'
import MyOrdersPage from '../pages/waiter/MyOrdersPage'
import TableDetailPage from '../pages/waiter/TableDetailPage'
import TableOverviewPage from '../pages/waiter/TableOverviewPage'
import AddMoreItemsPage from '../pages/customer/AddMoreItemsPage'
import BillPage from '../pages/customer/BillPage'
import CartPage from '../pages/customer/CartPage'
import MenuBrowserPage from '../pages/customer/MenuBrowserPage'
import OrderTrackingPage from '../pages/customer/OrderTrackingPage'
import PaymentPage from '../pages/customer/PaymentPage'
import ReceiptPage from '../pages/customer/ReceiptPage'
import { OrderEntryPage } from '../pages/customer/OrderEntryPage'
import WelcomePage from '../pages/customer/WelcomePage'
import SectionAssignmentPage from '../pages/manager/SectionAssignmentPage'
import { WaiterProvider } from '../contexts/WaiterContext'
import { ChangePasswordPage } from '../pages/shared/ChangePasswordPage'
import ForgotPasswordPage from '../pages/shared/ForgotPasswordPage'
import LoginPage from '../pages/shared/LoginPage'
import NotFoundPage from '../pages/shared/NotFoundPage'
import { NotificationsPage } from '../pages/shared/NotificationsPage'
import ProfilePage from '../pages/shared/ProfilePage'
import { RegisterPage } from '../pages/shared/RegisterPage'
import ResetPasswordPage from '../pages/shared/ResetPasswordPage'
import { ServerErrorPage } from '../pages/shared/ServerErrorPage'
import { SettingsPage } from '../pages/shared/SettingsPage'
import { UnauthorizedPage } from '../pages/shared/UnauthorizedPage'
import VerifyOtpPage from '../pages/shared/VerifyOtpPage'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'
import {
  BarChart2,
  ClipboardList,
  Coffee,
  CreditCard,
  LayoutDashboard,
  QrCode,
  Receipt,
  Shield,
  UserPlus,
  Users,
  Utensils,
  Package,
  UtensilsCrossed,
  Beer,
} from 'lucide-react'

const adminNav: NavItem[] = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/staff', label: 'Staff Management', icon: Users },
  { to: '/admin/menu', label: 'Menu Management', icon: Utensils },
  { to: '/admin/orders', label: 'Order Management', icon: ClipboardList },
  { to: '/admin/billing', label: 'Billing Management', icon: Receipt },
  { to: '/admin/stock', label: 'Stock Management', icon: Package },
  { to: '/admin/tables', label: 'Table Management', icon: QrCode },
  { to: '/admin/settings', label: 'System Settings', icon: Shield },
]

const managerNav: NavItem[] = [
  { to: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/manager/menu', label: 'Menu', icon: Utensils },
  { to: '/manager/orders', label: 'Orders', icon: ClipboardList },
  { to: '/manager/tables', label: 'Tables', icon: QrCode },
  { to: '/manager/assignments', label: 'Assignments', icon: Users },
  { to: '/manager/stock', label: 'Stock', icon: Package },
  { to: '/manager/bills', label: 'Bills', icon: Receipt },
  { to: '/manager/reports', label: 'Reports', icon: BarChart2 },
];

const cashierNav: NavItem[] = [
  { to: '/cashier/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cashier/bills', label: 'Bills', icon: Receipt },
  { to: '/cashier/pay', label: 'Pay', icon: CreditCard },
  { to: '/cashier/history', label: 'History', icon: ClipboardList },
  { to: '/cashier/shift', label: 'Shift', icon: Coffee },
]

const kitchenNav: NavItem[] = [
  { to: '/kitchen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/kitchen/line', label: 'Kitchen Line', icon: UtensilsCrossed },
]

const barNav: NavItem[] = [
  { to: '/bar/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/bar/line', label: 'Bar Line', icon: Beer },
  { to: '/bar/stock', label: 'Stock Manager', icon: Package },
]

const waiterNav: NavItem[] = [
  { to: '/waiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/waiter/tables', label: 'Tables', icon: QrCode },
  { to: '/waiter/orders', label: 'My orders', icon: ClipboardList },
]

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/500" element={<ServerErrorPage />} />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />

      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/order" element={<OrderEntryPage />} />

      <Route path="/t/:tableNumber" element={<TableSessionProvider><Outlet /></TableSessionProvider>}>
        <Route element={<CartProvider><Outlet /></CartProvider>}>
          <Route index element={<WelcomePage />} />
          <Route path="menu" element={<MenuBrowserPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="track/:orderId" element={<OrderTrackingPage />} />
          <Route path="add" element={<AddMoreItemsPage />} />
          <Route path="bill" element={<BillPage />} />
          <Route path="pay" element={<PaymentPage />} />
          <Route path="receipt" element={<ReceiptPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      <Route element={<RoleRoute roles={['SUPER_ADMIN']} />}>
        <Route path="/admin" element={<MainLayout title="Super Admin" nav={adminNav} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="staff" element={<StaffManagementPage />} />
          <Route path="staff/:id" element={<StaffDetailPage />} />
          <Route path="register-staff" element={<RegisterPage />} />
          <Route path="menu" element={<AdminMenuManagementPage />} />
          <Route path="orders" element={<AdminOrderManagementPage />} />
          <Route path="billing" element={<AdminBillingManagementPage />} />
          <Route path="stock" element={<AdminStockManagementPage />} />
          <Route path="tables" element={<TableManagementPage />} />
          <Route path="settings" element={<SystemSettingsPage />} />
          <Route path="logs" element={<ActivityLogsPage />} />
        </Route>
      </Route>

      <Route element={<RoleRoute roles={['MANAGER', 'SUPER_ADMIN']} />}>
        <Route path="/manager" element={<MainLayout title="Manager" nav={managerNav} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="menu" element={<AdminMenuManagementPage />} />
          <Route path="menu/:id" element={<MenuItemDetailPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="tables" element={<TablesStatusPage />} />
          <Route path="assignments" element={<SectionAssignmentPage />} />
          <Route path="stock" element={<AdminStockManagementPage />} />
          <Route path="bills" element={<BillsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Route>

      <Route element={<RoleRoute roles={['CASHIER', 'MANAGER', 'SUPER_ADMIN']} />}>
        <Route path="/cashier" element={<MainLayout title="Cashier" nav={cashierNav} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CashierDashboard />} />
          <Route path="bills" element={<PendingBillsPage />} />
          <Route path="pending" element={<PendingBillsPage />} />
          <Route path="pay" element={<PaymentProcessingPage />} />
          <Route path="history" element={<PaymentHistoryPage />} />
          <Route path="shift" element={<ShiftSummaryPage />} />
        </Route>
      </Route>

      <Route element={<RoleRoute roles={['KITCHEN_STAFF', 'MANAGER', 'SUPER_ADMIN']} />}>
        <Route path="/kitchen" element={<MainLayout title="Kitchen Station" nav={kitchenNav} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<KitchenDashboard />} />
          <Route path="line" element={<KitchenDisplayPage />} />
        </Route>
      </Route>

      <Route element={<RoleRoute roles={['BAR_STAFF', 'MANAGER', 'SUPER_ADMIN']} />}>
        <Route path="/bar" element={<MainLayout title="Bar Station" nav={barNav} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BarDashboard />} />
          <Route path="line" element={<BarDisplayPage />} />
          <Route path="stock" element={<BarStockPage />} />
        </Route>
      </Route>

      <Route element={<RoleRoute roles={['WAITER', 'MANAGER']} />}>
        <Route element={<WaiterProvider><Outlet /></WaiterProvider>}>
          <Route path="/waiter" element={<MainLayout title="Waiter" nav={waiterNav} />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<WaiterDashboard />} />
            <Route path="tables" element={<TableOverviewPage />} />
            <Route path="tables/:tableId" element={<TableDetailPage />} />
            <Route path="bill/:orderId" element={<BillPage />} />
            <Route path="orders" element={<MyOrdersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<WelcomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
