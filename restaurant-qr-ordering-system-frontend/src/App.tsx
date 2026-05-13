import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { TableSessionProvider } from './contexts/TableSessionContext';
import { BackendStatusChecker } from './components/common/BackendStatusChecker';
import { ToastContainer } from './components/common/ToastNotifications';

// Layouts
import StaffLayout from './components/layout/StaffLayout';
import CustomerLayout from './components/layout/CustomerLayout';

// Shared Pages
import LoginPage from './pages/shared/LoginPage';
import ForgotPasswordPage from './pages/shared/ForgotPasswordPage';
import VerifyOtpPage from './pages/shared/VerifyOtpPage';
import ResetPasswordPage from './pages/shared/ResetPasswordPage';
import ProfilePage from './pages/shared/ProfilePage';
import NotFoundPage from './pages/shared/NotFoundPage';

// Customer Pages
import WelcomePage from './pages/customer/WelcomePage';
import MenuBrowserPage from './pages/customer/MenuBrowserPage';
import CartPage from './pages/customer/CartPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import AddMoreItemsPage from './pages/customer/AddMoreItemsPage';
import BillPage from './pages/customer/BillPage';
import PaymentPage from './pages/customer/PaymentPage';
import ReceiptPage from './pages/customer/ReceiptPage';

// Staff Pages - Manager
import ManagerDashboard from './pages/manager/DashboardPage';
import MenuManagementPage from './pages/manager/MenuManagementPage';
import ManagerOrdersPage from './pages/manager/OrdersPage';
import ReportsPage from './pages/manager/ReportsPage';
import StockManagementPage from './pages/manager/StockManagementPage';

// Staff Pages - Kitchen & Bar
import KitchenDisplayPage from './pages/kitchen/KitchenDisplayPage';

// Staff Pages - Cashier
import CashierBillsPage from './pages/cashier/BillsPage';
import PaymentHistoryPage from './pages/cashier/PaymentHistoryPage';

// Staff Pages - Waiter
import WaiterTableOverview from './pages/waiter/TableOverviewPage';
import TableDetailPage from './pages/waiter/TableDetailPage';
import MyOrdersPage from './pages/waiter/MyOrdersPage';

// Staff Pages - Admin
import StaffManagementPage from './pages/super-admin/StaffManagementPage';

import { AppRoutes } from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <BackendStatusChecker>
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <WebSocketProvider>
            <ToastContainer />
            <CartProvider>
              <TableSessionProvider>
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </TableSessionProvider>
            </CartProvider>
          </WebSocketProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
    </BackendStatusChecker>
  );
}

export default App;
