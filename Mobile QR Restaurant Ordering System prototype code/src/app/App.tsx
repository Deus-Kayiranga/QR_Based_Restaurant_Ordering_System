import { useState } from 'react';
import { HomePage } from './components/home/HomePage';
import { LoginPage } from './components/auth/LoginPage';
import { WelcomeLanding } from './components/customer/WelcomeLanding';
import { MenuBrowser } from './components/customer/MenuBrowser';
import { CartView } from './components/customer/CartView';
import { OrderTracking } from './components/customer/OrderTracking';
import { BillPayment } from './components/customer/BillPayment';
import { WaiterDashboard } from './components/waiter/WaiterDashboard';
import { KitchenDisplay } from './components/kitchen/KitchenDisplay';
import { BarDisplay } from './components/kitchen/BarDisplay';
import { CashierDashboard } from './components/cashier/CashierDashboard';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { mockOrders, mockOrderItems, UserRole, MenuItem } from '../data/mockData';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialNotes: string;
}

type CustomerView = 'welcome' | 'menu' | 'cart' | 'tracking' | 'payment';
type AppView = 'home' | 'login' | 'app';

const ROLE_OPTIONS: { value: UserRole; label: string; icon: string; color: string; desc: string }[] = [
  { value: 'waiter',        label: 'Waiter',        icon: 'W', color: '#4169E1', desc: 'Table service & orders' },
  { value: 'kitchen_staff', label: 'Kitchen Staff',  icon: 'K', color: '#FF8C00', desc: 'Food preparation' },
  { value: 'bar_staff',     label: 'Bar Staff',      icon: 'B', color: '#0288D1', desc: 'Drinks preparation' },
  { value: 'cashier',       label: 'Cashier',        icon: 'C', color: '#228B22', desc: 'Payment processing' },
  { value: 'manager',       label: 'Manager',        icon: 'M', color: '#8B4513', desc: 'Operations' },
  { value: 'super_admin',   label: 'Super Admin',    icon: 'A', color: '#6B3410', desc: 'Full system access' },
];

const MOCK_USERS: Record<UserRole, { username: string; password: string; userId: number }> = {
  waiter:        { username: 'waiter',   password: 'waiter123',   userId: 3 },
  kitchen_staff: { username: 'kitchen',  password: 'kitchen123',  userId: 4 },
  bar_staff:     { username: 'bar',      password: 'bar123',      userId: 8 },
  cashier:       { username: 'cashier',  password: 'cashier123',  userId: 5 },
  manager:       { username: 'manager',  password: 'manager123',  userId: 2 },
  super_admin:   { username: 'admin',    password: 'admin123',    userId: 1 },
  customer:      { username: '',         password: '',             userId: 0 },
};

export default function App() {
  const [appView, setAppView] = useState<AppView>('home');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [customerView, setCustomerView] = useState<CustomerView>('welcome');
  const [customerCartItems, setCustomerCartItems] = useState<CartItem[]>([]);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [guestCount, setGuestCount] = useState(2);
  const [tableNumber, setTableNumber] = useState('T2');

  const handleLogin = (role: UserRole, uid: number) => {
    setSelectedRole(role);
    setUserId(uid);
    setAppView('app');
  };

  const handleLogout = () => {
    setSelectedRole(null);
    setUserId(null);
    setAppView('home');
    setCustomerView('welcome');
    setCustomerCartItems([]);
    setCurrentOrderId(null);
    setGuestCount(2);
  };

  const handleQRScan = (scannedTable: string) => {
    setTableNumber(scannedTable);
    setSelectedRole('customer');
    setAppView('app');
    setCustomerView('welcome');
  };

  const handleStaffLoginClick = () => {
    setAppView('login');
  };

  const handleWelcomeContinue = (guests: number) => { setGuestCount(guests); setCustomerView('menu'); };
  const handleViewCart = (items: CartItem[]) => { setCustomerCartItems(items); setCustomerView('cart'); };
  const handlePlaceOrder = (_items: CartItem[], _special: string) => { setCurrentOrderId(55); setCustomerView('tracking'); };
  const handleBackToMenu = () => setCustomerView('menu');
  const handleViewBill = () => setCustomerView('payment');
  const handlePaymentComplete = () => { setCustomerView('welcome'); setCustomerCartItems([]); setCurrentOrderId(null); setGuestCount(2); };
  const handleCallWaiter = () => alert('Waiter has been notified and will be with you shortly!');

  // ── HOME PAGE ──
  if (appView === 'home') {
    return <HomePage onScanComplete={handleQRScan} onStaffLogin={handleStaffLoginClick} />;
  }

  // ── LOGIN PAGE ──
  if (appView === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={() => setAppView('home')} />;
  }

  // ── STAFF DASHBOARDS ──
  if (appView === 'app') {
    if (selectedRole === 'waiter') return <WaiterDashboard waiterId={userId || 3} onTableSelect={t => console.log(t)} onLogout={handleLogout} />;
    if (selectedRole === 'kitchen_staff') return <KitchenDisplay onLogout={handleLogout} />;
    if (selectedRole === 'bar_staff') return <BarDisplay onLogout={handleLogout} />;
    if (selectedRole === 'cashier') return <CashierDashboard onLogout={handleLogout} />;
    if (selectedRole === 'manager') return <ManagerDashboard isAdmin={false} onLogout={handleLogout} />;
    if (selectedRole === 'super_admin') return <SuperAdminDashboard onLogout={handleLogout} />;

    // Customer view (from QR scan)
    const currentOrder = currentOrderId ? mockOrders.find(o => o.order_id === currentOrderId) : null;
    const currentOrderItems = currentOrderId ? mockOrderItems.filter(oi => oi.order_id === currentOrderId) : [];
    if (customerView === 'welcome') return <WelcomeLanding tableNumber={tableNumber} onContinue={handleWelcomeContinue} onCallWaiter={handleCallWaiter} />;
    if (customerView === 'cart') return <CartView cartItems={customerCartItems} tableNumber={tableNumber} onBack={handleBackToMenu} onPlaceOrder={handlePlaceOrder} onUpdateCart={setCustomerCartItems} />;
    if (customerView === 'tracking' && currentOrder) return <OrderTracking order={currentOrder} orderItems={currentOrderItems} onBack={handleBackToMenu} onViewBill={handleViewBill} onCallWaiter={handleCallWaiter} />;
    if (customerView === 'payment' && currentOrder) return <BillPayment order={currentOrder} orderItems={currentOrderItems} onBack={() => setCustomerView('tracking')} onPaymentComplete={handlePaymentComplete} />;
    return <MenuBrowser tableNumber={tableNumber} onViewCart={handleViewCart} />;
  }

  // Fallback - redirect to home
  return <HomePage onScanComplete={handleQRScan} onStaffLogin={handleStaffLoginClick} />;
}
