import { useState } from 'react';
import {
  LayoutDashboard, Utensils, Grid3x3, Users, CreditCard, Settings, LogOut,
  Shield, Activity, Database, Server, Globe, ChevronRight, QrCode,
  CheckCircle, AlertCircle, Clock, TrendingUp, BarChart2, Bell,
  Download, RefreshCw, Eye, Lock, Unlock, X, Plus, Edit, Check,
  ClipboardList, Trash2, Search, UserPlus, ChevronDown,
} from 'lucide-react';
import { QRCodeDisplay } from '../ui/QRCodeDisplay';
import {
  mockMenuItems, mockCategories, mockTables, mockOrders, mockUsers, mockBills, mockPayments, mockNotifications,
  formatCurrency, RestaurantTable, generateQRToken, getQRCodeURL, User, UserRole,
} from '../../../data/mockData';
import { ManagerDashboard } from '../manager/ManagerDashboard';

type AdminView = 'overview' | 'manager' | 'restaurant_config' | 'qr_management' | 'system_health' | 'activity_logs' | 'user_roles' | 'staff_management';

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  is_active: boolean;
}

interface RestaurantConfig {
  name: string;
  address: string;
  phone: string;
  email: string;
  tax_rate: number;
  currency: string;
  open_time: string;
  close_time: string;
  wifi_password: string;
}

const defaultConfig: RestaurantConfig = {
  name: 'La Ta Bhore', address: 'KG 12 Ave, Kiyovu, Kigali, Rwanda',
  phone: '+250 788 000 111', email: 'info@latabhore.rw',
  tax_rate: 18, currency: 'RWF', open_time: '07:00', close_time: '22:00',
  wifi_password: 'latabhore2026',
};

const activityLogs = [
  { id: 1, user: 'Aline Uwase', action: 'Added menu item: Cinnamon Roll', type: 'menu', time: '08:45' },
  { id: 2, user: 'Patrick Habimana', action: 'Processed payment RWF 21,806 for Table T1', type: 'payment', time: '07:45' },
  { id: 3, user: 'Jean Paul N.', action: 'Marked order #55 as served', type: 'order', time: '08:32' },
  { id: 4, user: 'Clarisse I.', action: 'Marked item #7 as unavailable (86)', type: 'menu', time: '08:00' },
  { id: 5, user: 'Emmanuel Mugisha', action: 'Generated new QR code for Table T3', type: 'system', time: '07:10' },
  { id: 6, user: 'Marie Keza', action: 'Started shift — Tables assigned: T1, T3, T6', type: 'staff', time: '06:30' },
  { id: 7, user: 'Patrick Habimana', action: 'Processed MTN MoMo payment RWF 11,210', type: 'payment', time: '07:52' },
  { id: 8, user: 'Emmanuel Mugisha', action: 'Updated restaurant tax rate to 18%', type: 'system', time: '06:00' },
];

export function SuperAdminDashboard({ onLogout }: { onLogout?: () => void }) {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [config, setConfig] = useState(defaultConfig);
  const [tables, setTables] = useState(mockTables);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showQRModal, setShowQRModal] = useState<RestaurantTable | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [configSaved, setConfigSaved] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<UserRole | 'all'>('all');
  const [userForm, setUserForm] = useState<UserFormData>({ first_name: '', last_name: '', email: '', phone_number: '', role: 'waiter', is_active: true });

  const openAddUser = () => { setEditingUser(null); setUserForm({ first_name: '', last_name: '', email: '', phone_number: '+250 7', role: 'waiter', is_active: true }); setShowUserModal(true); };
  const openEditUser = (u: User) => { setEditingUser(u); setUserForm({ first_name: u.first_name, last_name: u.last_name, email: u.email, phone_number: u.phone_number, role: u.role, is_active: u.is_active }); setShowUserModal(true); };
  const saveUser = () => {
    if (!userForm.first_name || !userForm.last_name || !userForm.email) return;
    if (editingUser) {
      setUsers(prev => prev.map(u => u.user_id === editingUser.user_id ? { ...u, ...userForm } : u));
      showToast(`${userForm.first_name} ${userForm.last_name} updated!`);
    } else {
      const newUser: User = { user_id: Date.now(), ...userForm, last_login_at: null, created_at: new Date().toISOString() };
      setUsers(prev => [...prev, newUser]);
      showToast(`${userForm.first_name} ${userForm.last_name} added to staff!`);
    }
    setShowUserModal(false);
    setEditingUser(null);
  };
  const deleteUser = (u: User) => {
    setUsers(prev => prev.filter(x => x.user_id !== u.user_id));
    setDeleteConfirmUser(null);
    showToast(`${u.first_name} ${u.last_name} removed from staff.`);
  };
  const toggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, is_active: !u.is_active } : u));
  };
  const filteredUsers = users.filter(u => {
    const matchName = `${u.first_name} ${u.last_name}`.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchName && matchRole;
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveConfig = () => {
    setConfigSaved(true);
    showToast('Restaurant settings saved successfully!');
    setTimeout(() => setConfigSaved(false), 2000);
  };

  const totalRevenue = mockPayments.reduce((s, p) => s + p.amount, 0);
  const totalOrders = mockOrders.length;
  const totalStaff = mockUsers.length;
  const totalTables = tables.length;

  const NavItem = ({ icon: Icon, label, view, badge }: { icon: any; label: string; view: AdminView; badge?: number }) => (
    <button onClick={() => setCurrentView(view)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative border-l-[3px] ${currentView === view ? 'border-l-[#FFA500] bg-[#D2691E] text-white font-bold shadow-md' : 'border-l-transparent text-[#C4A882] hover:bg-[#4A2512] hover:text-white'}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{label}</span>
      {badge && badge > 0 && <span className="ml-auto w-5 h-5 bg-[#b22222] text-white text-xs rounded-full flex items-center justify-center">{badge}</span>}
    </button>
  );

  // If manager view is selected, render ManagerDashboard with admin=true
  if (currentView === 'manager') {
    return (
      <div className="relative">
        <button onClick={() => setCurrentView('overview')} className="fixed top-4 left-4 z-50 bg-[#ffa500] text-[#2c1810] px-4 py-2 rounded-xl font-black flex items-center gap-2 shadow-lg hover:bg-[#e09500] transition-colors">
          <Shield className="w-4 h-4" /> ← Back to Admin
        </button>
        <ManagerDashboard isAdmin={true} onLogout={onLogout} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f0] flex">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#228b22] text-white px-5 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2">
          <Check className="w-5 h-5" /> {toast}
        </div>
      )}

      {/* Sidebar — Admin theme */}
      <div className="w-64 text-white p-5 flex flex-col flex-shrink-0 fixed left-0 top-0 h-screen z-50 overflow-hidden" style={{ background: 'linear-gradient(180deg, #3E1A0A 0%, #2C1205 100%)' }}>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-6 h-6 text-[#ffa500]" />
            <h1 className="text-xl font-black" style={{ fontFamily: 'Playfair Display, serif' }}>La Ta Bhore</h1>
          </div>
          <p className="text-sm text-[#ffa500] font-bold">Super Admin Portal</p>
          <p className="text-xs text-[#c4a882] mt-1">Full System Access</p>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={LayoutDashboard} label="System Overview" view="overview" />
          <div className="border-t border-white/10 my-2" />
          <p className="text-xs px-4 font-bold uppercase tracking-wide mb-1" style={{ color: '#B8A088' }}>Management</p>
          <NavItem icon={Utensils} label="Full Management" view="manager" />
          <NavItem icon={Users} label="Staff Management" view="staff_management" badge={users.filter(u=>!u.is_active).length} />
          <NavItem icon={Globe} label="Restaurant Config" view="restaurant_config" />
          <NavItem icon={QrCode} label="QR Code Manager" view="qr_management" />
          <NavItem icon={Shield} label="Roles & Access" view="user_roles" />
          <div className="border-t border-white/10 my-2" />
          <p className="text-xs px-4 font-bold uppercase tracking-wide mb-1" style={{ color: '#B8A088' }}>System</p>
          <NavItem icon={Activity} label="System Health" view="system_health" />
          <NavItem icon={Database} label="Activity Logs" view="activity_logs" />
        </nav>

        <div className="border-t border-[#8b4513] pt-4 mt-4">
          <div className="flex items-center gap-3 px-3 py-3 bg-[#ffa500]/10 rounded-xl mb-3">
            <div className="w-10 h-10 rounded-full bg-[#ffa500] flex items-center justify-center">
              <span className="font-black text-[#2c1810] text-sm">EM</span>
            </div>
            <div>
              <p className="font-bold text-sm text-white">Emmanuel Mugisha</p>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#ffa500]" />
                <p className="text-xs text-[#ffa500] font-bold">Super Admin</p>
              </div>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[#fff0e0] hover:bg-[#8b4513] rounded-xl transition-colors">
            <LogOut className="w-5 h-5" /><span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-auto min-h-screen">

        {/* ─── SYSTEM OVERVIEW ─── */}
        {currentView === 'overview' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>System Overview</h1>
                <p className="text-[#8b7355]">Friday, May 1, 2026 · All systems operational</p>
              </div>
              <div className="flex items-center gap-2 bg-[#228b22]/10 border border-[#228b22]/20 rounded-xl px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-[#228b22] animate-pulse" />
                <span className="text-sm font-bold text-[#228b22]">All Systems Online</span>
              </div>
            </div>

            {/* System Stats */}
            <div className="grid grid-cols-4 gap-5 mb-8">
              {[
                { icon: TrendingUp, label: "Total Revenue Today", value: formatCurrency(totalRevenue), sub: "Cash + MoMo + Airtel", color: "#228b22" },
                { icon: ClipboardList, label: "Total Orders", value: totalOrders, sub: `${mockOrders.filter(o=>o.order_status!=='completed').length} active`, color: "#ff8c00" },
                { icon: Users, label: "Active Staff", value: mockUsers.filter(u=>u.is_active).length, sub: `${totalStaff} total`, color: "#4169e1" },
                { icon: Grid3x3, label: "Tables", value: tables.filter(t=>t.is_active).length, sub: `${tables.filter(t=>t.status==='occupied').length} occupied`, color: "#8b4513" },
              ].map(({ icon: Icon, label, value, sub, color }) => (
                <div key={label} className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: color + '15' }}>
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <p className="text-sm text-[#8b7355] font-semibold">{label}</p>
                  </div>
                  <p className="text-3xl font-black text-[#2c1810] mb-1">{value}</p>
                  <p className="text-sm text-[#8b7355]">{sub}</p>
                </div>
              ))}
            </div>

            {/* System Health Summary */}
            <div className="grid grid-cols-3 gap-5 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                <h3 className="font-bold text-[#2c1810] mb-4 flex items-center gap-2"><Server className="w-5 h-5 text-[#4169e1]" /> System Health</h3>
                <div className="space-y-3">
                  {[
                    { label: "Web Server", status: "Operational", ok: true },
                    { label: "Database", status: "Operational", ok: true },
                    { label: "QR Service", status: "Operational", ok: true },
                    { label: "Payment Gateway", status: "Operational", ok: true },
                    { label: "Notifications", status: "Operational", ok: true },
                  ].map(({ label, status, ok }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-[#8b7355]">{label}</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${ok ? 'bg-[#228b22]' : 'bg-[#b22222]'}`} />
                        <span className={`text-xs font-bold ${ok ? 'text-[#228b22]' : 'text-[#b22222]'}`}>{status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                <h3 className="font-bold text-[#2c1810] mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-[#d2691e]" /> Payment Breakdown</h3>
                {[
                  { method: 'Cash', amount: mockPayments.filter(p=>p.payment_method==='cash').reduce((s,p)=>s+p.amount,0), color: '#228b22', pct: 44 },
                  { method: 'MTN MoMo', amount: mockPayments.filter(p=>p.payment_method==='momo').reduce((s,p)=>s+p.amount,0), color: '#ffcb05', pct: 27 },
                  { method: 'Airtel Money', amount: mockPayments.filter(p=>p.payment_method==='airtel_money').reduce((s,p)=>s+p.amount,0), color: '#ed1c24', pct: 29 },
                ].map(({ method, amount, color, pct }) => (
                  <div key={method} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-[#2c1810]">{method}</span>
                      <span className="font-bold" style={{ color }}>{formatCurrency(amount)}</span>
                    </div>
                    <div className="h-2 bg-[#f5f0ea] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                <h3 className="font-bold text-[#2c1810] mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-[#8b4513]" /> Staff On Duty</h3>
                <div className="space-y-3">
                  {mockUsers.filter(u => u.is_active).map(user => {
                    const roleColors: Record<string, string> = { super_admin: '#ffa500', manager: '#8b4513', waiter: '#4169e1', kitchen_staff: '#ff8c00', bar_staff: '#0288d1', cashier: '#228b22' };
                    return (
                      <div key={user.user_id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: roleColors[user.role] || '#8b7355' }}>
                          {user.first_name[0]}{user.last_name[0]}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#2c1810]">{user.first_name} {user.last_name}</p>
                          <p className="text-xs text-[#8b7355] capitalize">{user.role.replace('_', ' ')}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[#228b22]" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Admin Actions */}
            <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
              <h2 className="text-xl font-bold text-[#2c1810] mb-4">Admin Quick Actions</h2>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Full Management Panel", desc: "Menu, orders, tables, staff", icon: Utensils, view: 'manager' as AdminView, color: '#d2691e' },
                  { label: "Restaurant Config", desc: "Name, hours, tax settings", icon: Settings, view: 'restaurant_config' as AdminView, color: '#4169e1' },
                  { label: "QR Code Manager", desc: "Generate & manage all QR codes", icon: QrCode, view: 'qr_management' as AdminView, color: '#8b4513' },
                  { label: "System Logs", desc: "View all activity logs", icon: Activity, view: 'activity_logs' as AdminView, color: '#228b22' },
                ].map(({ label, desc, icon: Icon, view, color }) => (
                  <button key={label} onClick={() => setCurrentView(view)} className="p-4 bg-[#fff8f0] hover:bg-[#fff0e0] rounded-xl text-left transition-colors group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors" style={{ background: color + '20' }}>
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <p className="font-bold text-[#2c1810] mb-1">{label}</p>
                    <p className="text-xs text-[#8b7355]">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── RESTAURANT CONFIG ─── */}
        {currentView === 'restaurant_config' && (
          <div className="p-8">
            <h1 className="text-3xl font-black text-[#2c1810] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Restaurant Configuration</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                <h3 className="text-lg font-bold text-[#2c1810] mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-[#d2691e]" /> Restaurant Information</h3>
                {[
                  { label: "Restaurant Name", key: 'name' as keyof RestaurantConfig, type: "text" },
                  { label: "Address", key: 'address' as keyof RestaurantConfig, type: "text" },
                  { label: "Phone Number", key: 'phone' as keyof RestaurantConfig, type: "tel" },
                  { label: "Email Address", key: 'email' as keyof RestaurantConfig, type: "email" },
                  { label: "WiFi Password (for QR cards)", key: 'wifi_password' as keyof RestaurantConfig, type: "text" },
                ].map(({ label, key, type }) => (
                  <div key={key} className="mb-4">
                    <label className="block text-sm font-bold text-[#2c1810] mb-1">{label}</label>
                    <input type={type} value={config[key] as string} onChange={e => setConfig(c => ({ ...c, [key]: e.target.value }))} className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513] text-sm" />
                  </div>
                ))}
              </div>

              <div className="space-y-5">
                <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                  <h3 className="text-lg font-bold text-[#2c1810] mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#228b22]" /> Financial Settings</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-[#2c1810] mb-1">Tax Rate (%)</label>
                    <div className="flex items-center gap-3">
                      <input type="number" value={config.tax_rate} onChange={e => setConfig(c => ({ ...c, tax_rate: parseFloat(e.target.value) }))} className="flex-1 px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513] text-sm" min="0" max="100" />
                      <span className="font-bold text-[#8b7355]">%</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-[#2c1810] mb-1">Currency</label>
                    <input value="RWF (Rwandan Franc)" disabled className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl bg-[#f9f9f9] text-[#8b7355] text-sm cursor-not-allowed" />
                    <p className="text-xs text-[#c4a882] mt-1">Locked: Rwanda Franc (RWF) is fixed for this installation</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                  <h3 className="text-lg font-bold text-[#2c1810] mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-[#ff8c00]" /> Operating Hours</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#2c1810] mb-1">Opening Time</label>
                      <input type="time" value={config.open_time} onChange={e => setConfig(c => ({ ...c, open_time: e.target.value }))} className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513] text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#2c1810] mb-1">Closing Time</label>
                      <input type="time" value={config.close_time} onChange={e => setConfig(c => ({ ...c, close_time: e.target.value }))} className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513] text-sm" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                  <h3 className="text-lg font-bold text-[#2c1810] mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-[#ffa500]" /> System Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 border border-[#e8d5c4] rounded-xl hover:bg-[#fff8f0] transition-colors">
                      <Download className="w-5 h-5 text-[#4169e1]" />
                      <div className="text-left"><p className="font-semibold text-[#2c1810] text-sm">Export Data Backup</p><p className="text-xs text-[#8b7355]">Download all data as JSON/CSV</p></div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 border border-[#e8d5c4] rounded-xl hover:bg-[#fff8f0] transition-colors">
                      <RefreshCw className="w-5 h-5 text-[#ff8c00]" />
                      <div className="text-left"><p className="font-semibold text-[#2c1810] text-sm">Reset Daily Counters</p><p className="text-xs text-[#8b7355]">Reset order and revenue counters</p></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleSaveConfig} className={`mt-6 px-10 py-4 rounded-xl font-black text-lg shadow-[0_4px_12px_rgba(210,105,30,0.3)] transition-all flex items-center gap-3 ${configSaved ? 'bg-[#228b22]' : 'bg-[#d2691e] hover:bg-[#8b4513]'} text-white`}>
              {configSaved ? <><Check className="w-6 h-6" /> Saved!</> : 'Save All Settings'}
            </button>
          </div>
        )}

        {/* ─── QR MANAGEMENT ─── */}
        {currentView === 'qr_management' && (
          <div className="p-8">
            <h1 className="text-3xl font-black text-[#2c1810] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>QR Code Management</h1>
            <p className="text-[#8b7355] mb-6">Each table has a unique QR code that customers scan to access the menu. Tokens are secure and unique per table.</p>

            <div className="grid grid-cols-3 gap-5 mb-6">
              {[
                { label: "Total QR Codes", value: tables.length, color: "#8b4513" },
                { label: "Active QR Codes", value: tables.filter(t=>t.is_active).length, color: "#228b22" },
                { label: "Inactive QR Codes", value: tables.filter(t=>!t.is_active).length, color: "#b22222" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(44,24,16,0.08)] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: color + '15' }}><QrCode className="w-6 h-6" style={{ color }} /></div>
                  <div><p className="text-3xl font-black text-[#2c1810]">{value}</p><p className="text-sm text-[#8b7355]">{label}</p></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {tables.map(table => (
                <div key={table.table_id} className="bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(44,24,16,0.08)] text-center">
                  <div className="flex justify-center mb-3">
                    <QRCodeSVG value={getQRCodeURL(table)} size={100} fgColor="#2c1810" bgColor="#ffffff" level="H" />
                  </div>
                  <p className="font-black text-xl text-[#2c1810] mb-1">{table.table_number}</p>
                  <p className="text-xs text-[#8b7355] mb-2">{table.section} · {table.seating_capacity} seats</p>
                  <code className="text-xs bg-[#fff8f0] px-2 py-1 rounded font-mono text-[#8b4513] block mb-3 border border-[#e8d5c4] truncate">{table.qr_code_token}</code>
                  <div className="flex gap-2">
                    <button onClick={() => setShowQRModal(table)} className="flex-1 text-xs py-2 rounded-lg font-bold border border-[#e8d5c4] text-[#8b7355] hover:bg-[#fff8f0]">
                      <Eye className="w-3 h-3 inline mr-1" /> View
                    </button>
                    <button onClick={() => {
                      const newToken = generateQRToken();
                      setTables(prev => prev.map(t => t.table_id === table.table_id ? { ...t, qr_code_token: newToken } : t));
                      showToast(`QR regenerated for ${table.table_number}`);
                    }} className="flex-1 text-xs py-2 rounded-lg font-bold bg-[#d2691e] text-white hover:bg-[#8b4513]">
                      <RefreshCw className="w-3 h-3 inline mr-1" /> Regen
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#fff0e0] border border-[#e8d5c4] rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#d2691e] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2c1810] mb-1">QR Code Security Notes</p>
                  <ul className="text-sm text-[#8b7355] space-y-1">
                    <li>• Each table has a unique token that validates orders — prevents fake orders</li>
                    <li>• Regenerating a token immediately invalidates old QR codes — print new ones!</li>
                    <li>• URL format: <code className="bg-white px-1 rounded text-[#8b4513]">la-ta-bhore.com/order?table=T1&token=XXXXXXXX</code></li>
                    <li>• Sessions expire after 4 hours of inactivity for security</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── USER ROLES ─── */}
        {currentView === 'user_roles' && (
          <div className="p-8">
            <h1 className="text-3xl font-black text-[#2c1810] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>User Roles & Access Control</h1>
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              {[
                { role: 'super_admin', label: 'Super Admin', desc: 'Full system access. Restaurant owner. Can manage everything.', color: '#ffa500', perms: ['All management features', 'System configuration', 'Restaurant settings', 'QR code management', 'Backup & restore', 'User role assignment'] },
                { role: 'manager', label: 'Manager', desc: 'Operational supervisor. Manages daily menu, staff, orders.', color: '#8b4513', perms: ['Menu CRUD operations', 'Staff management', 'Order oversight', 'Table management', 'View reports', 'Notifications'] },
                { role: 'waiter', label: 'Waiter', desc: 'Table service. Manages tables and serves customers.', color: '#4169e1', perms: ['View assigned tables', 'View orders', 'Mark items served', 'Call manager', 'Notifications'] },
                { role: 'kitchen_staff', label: 'Kitchen Staff', desc: 'Food preparation. Uses Kitchen Display System.', color: '#ff8c00', perms: ['View kitchen orders', 'Update item status', 'Mark items ready', 'Mark items unavailable (86)'] },
                { role: 'bar_staff', label: 'Bar Staff', desc: 'Beverage preparation. Uses Bar Display System.', color: '#0288d1', perms: ['View bar orders', 'Update item status', 'Mark items ready', 'Mark items unavailable (86)'] },
                { role: 'cashier', label: 'Cashier', desc: 'Payment handler. Processes all bills.', color: '#228b22', perms: ['View pending bills', 'Process payments (Cash/MoMo/Airtel)', 'View payment history', 'Shift summary'] },
                { role: 'customer', label: 'Customer', desc: 'External diner. Uses PWA via QR code scan.', color: '#9ca3af', perms: ['Browse menu', 'Add to cart', 'Place orders', 'Track order status', 'View & pay bill'] },
              ].map(({ role, label, desc, color, perms }) => (
                <div key={role} className="bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '20' }}>
                      <Shield className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <p className="font-black text-[#2c1810]">{label}</p>
                      <p className="text-xs text-[#8b7355]">{desc}</p>
                    </div>
                    <span className="ml-auto text-xs px-2 py-1 rounded-full font-bold" style={{ background: color + '20', color }}>
                      {mockUsers.filter(u=>u.role===role).length} users
                    </span>
                  </div>
                  <div className="space-y-1">
                    {perms.map(p => (
                      <div key={p} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                        <span className="text-[#8b7355]">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── STAFF MANAGEMENT (CRUD) ─── */}
        {currentView === 'staff_management' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Staff Management</h1>
                <p className="text-[#8b7355] mt-1">{users.filter(u=>u.is_active).length} active · {users.filter(u=>!u.is_active).length} inactive · {users.length} total</p>
              </div>
              <button onClick={openAddUser} className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white shadow-md hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #8b4513, #d2691e)' }}>
                <UserPlus className="w-5 h-5" /> Add Staff Member
              </button>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4a882]" />
                <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search staff by name or email..."
                  className="w-full bg-white border border-[#e8d5c4] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#2c1810] focus:outline-none focus:border-[#8b4513] transition-all" />
              </div>
              <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value as UserRole | 'all')}
                className="bg-white border border-[#e8d5c4] rounded-xl px-4 py-2.5 text-sm text-[#2c1810] focus:outline-none focus:border-[#8b4513]">
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="manager">Manager</option>
                <option value="cashier">Cashier</option>
                <option value="kitchen_staff">Kitchen Staff</option>
                <option value="bar_staff">Bar Staff</option>
                <option value="waiter">Waiter</option>
              </select>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8d5c4] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e8d5c4]" style={{ background: '#FFF8F0' }}>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#8b7355] uppercase tracking-wide">Staff Member</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#8b7355] uppercase tracking-wide">Email</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#8b7355] uppercase tracking-wide">Role</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#8b7355] uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#8b7355] uppercase tracking-wide">Phone</th>
                    <th className="px-5 py-3 text-right text-xs font-bold text-[#8b7355] uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, i) => {
                    const roleColors: Record<string, string> = { super_admin: '#ffa500', manager: '#8b4513', waiter: '#4169e1', kitchen_staff: '#ff8c00', bar_staff: '#0288d1', cashier: '#228b22' };
                    const rc = roleColors[user.role] || '#8b7355';
                    return (
                      <tr key={user.user_id} className={`border-b border-[#f5efe8] hover:bg-[#FFF8F0] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FDFAF7]'}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: rc }}>
                              {user.first_name[0]}{user.last_name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-[#2c1810] text-sm">{user.first_name} {user.last_name}</p>
                              <p className="text-xs text-[#8b7355]">ID #{user.user_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#8b7355]">{user.email}</td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold capitalize" style={{ background: rc + '15', color: rc }}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => toggleUserStatus(user.user_id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${user.is_active ? 'bg-[#228b22]/10 text-[#228b22] hover:bg-[#228b22]/20' : 'bg-[#e0e0e0] text-[#8b7355] hover:bg-[#d0d0d0]'}`}>
                            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle" style={{ background: user.is_active ? '#228b22' : '#bdbdbd' }} />
                            {user.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#8b7355]">{user.phone_number}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button onClick={() => openEditUser(user)}
                              className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#4169e1] flex items-center justify-center hover:bg-[#E0E7FF] transition-colors" title="Edit">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteConfirmUser(user)}
                              className="w-8 h-8 rounded-lg bg-[#FFEBEE] text-[#c62828] flex items-center justify-center hover:bg-[#FFCDD2] transition-colors" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-12 text-center text-[#8b7355]">No staff members found matching your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add/Edit User Modal */}
            {showUserModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#e8d5c4] flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #3E1A0A, #6B3410)' }}>
                    <h3 className="font-bold text-white text-lg">{editingUser ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
                    <button onClick={() => setShowUserModal(false)} className="text-[#C4A882] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#2c1810] mb-1">First Name *</label>
                        <input type="text" value={userForm.first_name} onChange={e => setUserForm(f => ({ ...f, first_name: e.target.value }))}
                          className="w-full border border-[#e8d5c4] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8b4513]" placeholder="First name" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#2c1810] mb-1">Last Name *</label>
                        <input type="text" value={userForm.last_name} onChange={e => setUserForm(f => ({ ...f, last_name: e.target.value }))}
                          className="w-full border border-[#e8d5c4] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8b4513]" placeholder="Last name" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2c1810] mb-1">Email *</label>
                      <input type="email" value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full border border-[#e8d5c4] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8b4513]" placeholder="staff@latabhore.rw" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2c1810] mb-1">Phone Number</label>
                      <input type="tel" value={userForm.phone_number} onChange={e => setUserForm(f => ({ ...f, phone_number: e.target.value }))}
                        className="w-full border border-[#e8d5c4] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8b4513]" placeholder="+250 7XX XXX XXX" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2c1810] mb-1">Role *</label>
                      <select value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value as UserRole }))}
                        className="w-full border border-[#e8d5c4] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8b4513]">
                        <option value="waiter">Waiter</option>
                        <option value="kitchen_staff">Kitchen Staff</option>
                        <option value="bar_staff">Bar Staff</option>
                        <option value="cashier">Cashier</option>
                        <option value="manager">Manager</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-[#2c1810]">Status:</label>
                      <button type="button" onClick={() => setUserForm(f => ({ ...f, is_active: !f.is_active }))}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${userForm.is_active ? 'bg-[#228b22] text-white' : 'bg-[#e0e0e0] text-[#8b7355]'}`}>
                        {userForm.is_active ? '● Active' : '○ Inactive'}
                      </button>
                    </div>
                  </div>
                  <div className="px-6 pb-5 flex gap-3">
                    <button onClick={() => setShowUserModal(false)} className="flex-1 border-2 border-[#e8d5c4] text-[#8b7355] py-3 rounded-xl font-semibold hover:border-[#8b7355] transition-colors">Cancel</button>
                    <button onClick={saveUser} className="flex-1 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #8b4513, #d2691e)' }}>
                      {editingUser ? 'Update Staff' : 'Add Staff Member'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirmUser && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-[#2c1810] text-center mb-2">Remove Staff Member?</h3>
                  <p className="text-sm text-[#8b7355] text-center mb-6">
                    Are you sure you want to remove <strong>{deleteConfirmUser.first_name} {deleteConfirmUser.last_name}</strong>? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => setDeleteConfirmUser(null)} className="flex-1 border-2 border-[#e8d5c4] text-[#8b7355] py-2.5 rounded-xl font-semibold">Cancel</button>
                    <button onClick={() => deleteUser(deleteConfirmUser)} className="flex-1 bg-[#c62828] text-white py-2.5 rounded-xl font-bold hover:bg-[#a81e1e] transition-colors">Remove</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── SYSTEM HEALTH ─── */}
        {currentView === 'system_health' && (
          <div className="p-8">
            <h1 className="text-3xl font-black text-[#2c1810] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>System Health Monitor</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                <h3 className="text-lg font-bold text-[#2c1810] mb-4 flex items-center gap-2"><Server className="w-5 h-5 text-[#4169e1]" /> Service Status</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Web Application', status: 'Operational', uptime: '99.9%', latency: '45ms', ok: true },
                    { name: 'Database', status: 'Operational', uptime: '100%', latency: '12ms', ok: true },
                    { name: 'QR Code Generator', status: 'Operational', uptime: '99.7%', latency: '23ms', ok: true },
                    { name: 'MTN MoMo API', status: 'Operational', uptime: '98.5%', latency: '180ms', ok: true },
                    { name: 'Airtel Money API', status: 'Operational', uptime: '97.9%', latency: '210ms', ok: true },
                    { name: 'Email/SMS Service', status: 'Degraded', uptime: '89.2%', latency: '850ms', ok: false },
                  ].map(({ name, status, uptime, latency, ok }) => (
                    <div key={name} className="flex items-center justify-between p-3 bg-[#fff8f0] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${ok ? 'bg-[#228b22]' : 'bg-[#ff8c00]'} ${ok ? 'animate-pulse' : ''}`} />
                        <span className="font-semibold text-[#2c1810]">{name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[#8b7355]">↑{uptime}</span>
                        <span className="text-[#8b7355]">{latency}</span>
                        <span className={`font-bold ${ok ? 'text-[#228b22]' : 'text-[#ff8c00]'}`}>{status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                <h3 className="text-lg font-bold text-[#2c1810] mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-[#d2691e]" /> Database Stats</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Total Orders (All Time)', value: '1,247' },
                    { label: 'Total Payments Processed', value: '1,198' },
                    { label: 'Menu Items', value: mockMenuItems.length.toString() },
                    { label: 'Active Tables', value: tables.filter(t=>t.is_active).length.toString() },
                    { label: 'Staff Members', value: mockUsers.length.toString() },
                    { label: 'Table Sessions Today', value: '12' },
                    { label: 'QR Scans Today', value: '34' },
                    { label: 'Database Size', value: '24.5 MB' },
                    { label: 'Last Backup', value: 'Today 03:00 AM' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-[#f5f0ea] last:border-0">
                      <span className="text-sm text-[#8b7355]">{label}</span>
                      <span className="font-bold text-[#2c1810]">{value}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 flex items-center justify-center gap-2 border border-[#e8d5c4] text-[#8b7355] py-3 rounded-xl hover:bg-[#fff8f0] transition-colors font-semibold">
                  <Download className="w-4 h-4" /> Download Backup Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── ACTIVITY LOGS ─── */}
        {currentView === 'activity_logs' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-black text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Activity Logs</h1>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 border border-[#e8d5c4] text-[#8b7355] px-4 py-2 rounded-xl hover:bg-[#fff8f0] text-sm font-semibold">
                  <Download className="w-4 h-4" /> Export Logs
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
              <div className="overflow-hidden">
                {activityLogs.map((log, i) => {
                  const typeColors: Record<string, string> = { menu: '#d2691e', payment: '#228b22', order: '#4169e1', system: '#ffa500', staff: '#8b4513' };
                  return (
                    <div key={log.id} className={`flex items-start gap-4 px-6 py-4 ${i < activityLogs.length - 1 ? 'border-b border-[#f5f0ea]' : ''} hover:bg-[#fff8f0] transition-colors`}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: (typeColors[log.type] || '#8b7355') + '20' }}>
                        <Activity className="w-5 h-5" style={{ color: typeColors[log.type] || '#8b7355' }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-0.5">
                          <p className="font-bold text-[#2c1810] text-sm">{log.user}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold capitalize" style={{ background: (typeColors[log.type] || '#8b7355') + '20', color: typeColors[log.type] || '#8b7355' }}>{log.type}</span>
                        </div>
                        <p className="text-sm text-[#8b7355]">{log.action}</p>
                      </div>
                      <span className="text-sm text-[#c4a882] font-semibold flex-shrink-0">{log.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#2c1810]">QR Code — {showQRModal.table_number}</h3>
              <button onClick={() => setShowQRModal(null)} className="text-[#8b7355]"><X className="w-6 h-6" /></button>
            </div>
            <div className="bg-[#fff8f0] rounded-xl p-6 mb-4">
              <div className="bg-white p-4 rounded-xl shadow-md inline-block mb-3">
                <QRCodeSVG value={getQRCodeURL(showQRModal)} size={160} fgColor="#2c1810" bgColor="#ffffff" level="H" />
              </div>
              <p className="font-black text-lg text-[#2c1810]">Table {showQRModal.table_number}</p>
              <p className="text-sm text-[#8b7355]">{showQRModal.section} · {showQRModal.seating_capacity} persons</p>
              <p className="text-xs text-[#c4a882] mt-2 font-mono break-all">{getQRCodeURL(showQRModal)}</p>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 border-2 border-[#e8d5c4] text-[#8b7355] py-3 rounded-xl font-semibold hover:bg-[#fff8f0]">
                <Download className="w-4 h-4" /> Download
              </button>
              <button onClick={() => setShowQRModal(null)} className="flex-1 bg-[#d2691e] text-white py-3 rounded-xl font-bold">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}