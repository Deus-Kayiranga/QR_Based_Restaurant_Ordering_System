import { useState } from 'react';
import {
  LayoutDashboard, Utensils, Grid3x3, Users, CreditCard, Settings, LogOut,
  Plus, Edit, Trash2, QrCode, Bell, ClipboardList, BarChart2, X, Check,
  ChevronDown, Search, Eye, EyeOff, RefreshCw, TrendingUp, AlertCircle,
  ToggleLeft, ToggleRight, Download, Printer, Shield, Coffee,
} from 'lucide-react';
import { QRCodeDisplay } from '../ui/QRCodeDisplay';
import { StaffLayout } from '../layouts/StaffLayout';
import { StaffManagement } from '../admin/StaffManagement';
import {
  mockMenuItems, mockCategories, mockTables, mockOrders, mockUsers, mockBills, mockNotifications, mockOrderItems,
  formatCurrency, MenuItem, RestaurantTable, MenuCategory, generateQRToken, getQRCodeURL,
} from '../../../data/mockData';

type ManagerView = 'dashboard' | 'menu' | 'orders' | 'tables' | 'billing' | 'staff' | 'notifications' | 'settings';

interface MenuItemFormData {
  item_name: string;
  description: string;
  price: string;
  category_id: string;
  destination_station: 'kitchen' | 'bar';
  is_vegetarian: boolean;
  contains_allergens: string;
  is_available: boolean;
  image_url: string;
}

const defaultForm: MenuItemFormData = {
  item_name: '', description: '', price: '', category_id: '1',
  destination_station: 'kitchen', is_vegetarian: false,
  contains_allergens: '', is_available: true, image_url: '',
};

export function ManagerDashboard({ isAdmin = false, onLogout }: { isAdmin?: boolean; onLogout?: () => void }) {
  const [currentView, setCurrentView] = useState<ManagerView>('dashboard');
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [tables, setTables] = useState(mockTables);
  const [users, setUsers] = useState(mockUsers);
  const [notifs, setNotifs] = useState(mockNotifications);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'tables', label: 'Tables', icon: Grid3x3 },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifs.filter(n => !n.is_read).length },
  ];

  // Modal states
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuForm, setMenuForm] = useState<MenuItemFormData>(defaultForm);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showQRModal, setShowQRModal] = useState<RestaurantTable | null>(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [tableForm, setTableForm] = useState({ table_number: '', section: '', seating_capacity: 2 });
  const [activeMenuCategory, setActiveMenuCategory] = useState<number | null>(null);
  const [menuSearch, setMenuSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Stats
  const activeOrders = mockOrders.filter(o => !['completed', 'cancelled'].includes(o.order_status)).length;
  const todayRevenue = 425800;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const pendingBills = mockBills.filter(b => b.bill_status === 'ready').length;
  const unreadNotifs = notifs.filter(n => !n.is_read).length;

  // Menu CRUD
  const openAddMenu = () => {
    setEditingItem(null);
    setMenuForm(defaultForm);
    setShowMenuModal(true);
  };

  const openEditMenu = (item: MenuItem) => {
    setEditingItem(item);
    setMenuForm({
      item_name: item.item_name, description: item.description, price: item.price.toString(),
      category_id: item.category_id.toString(), destination_station: item.destination_station,
      is_vegetarian: item.is_vegetarian, contains_allergens: item.contains_allergens,
      is_available: item.is_available, image_url: item.image_url,
    });
    setShowMenuModal(true);
  };

  const saveMenuItem = () => {
    if (!menuForm.item_name || !menuForm.price) return;
    if (editingItem) {
      setMenuItems(prev => prev.map(i => i.item_id === editingItem.item_id ? {
        ...i, ...menuForm, price: parseFloat(menuForm.price), category_id: parseInt(menuForm.category_id),
      } : i));
      showToast(`"${menuForm.item_name}" updated successfully!`);
    } else {
      const newItem: MenuItem = {
        item_id: Date.now(), category_id: parseInt(menuForm.category_id),
        item_name: menuForm.item_name, description: menuForm.description,
        price: parseFloat(menuForm.price), image_url: menuForm.image_url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
        destination_station: menuForm.destination_station, is_available: menuForm.is_available,
        is_vegetarian: menuForm.is_vegetarian, contains_allergens: menuForm.contains_allergens, display_order: 99,
      };
      setMenuItems(prev => [...prev, newItem]);
      showToast(`"${menuForm.item_name}" added to menu!`);
    }
    setShowMenuModal(false);
    setEditingItem(null);
  };

  const deleteMenuItem = (id: number) => {
    const item = menuItems.find(i => i.item_id === id);
    setMenuItems(prev => prev.filter(i => i.item_id !== id));
    setShowDeleteConfirm(null);
    showToast(`"${item?.item_name}" removed from menu`);
  };

  const toggleItemAvailability = (id: number) => {
    setMenuItems(prev => prev.map(i => i.item_id === id ? { ...i, is_available: !i.is_available } : i));
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (activeMenuCategory && item.category_id !== activeMenuCategory) return false;
    if (menuSearch && !item.item_name.toLowerCase().includes(menuSearch.toLowerCase())) return false;
    return true;
  });

  const NavItem = ({ icon: Icon, label, view, badge }: { icon: any; label: string; view: ManagerView; badge?: number }) => (
    <button onClick={() => setCurrentView(view)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative border-l-[3px] ${currentView === view ? 'border-l-[#FFA500] bg-[#D2691E] text-white font-bold shadow-md' : 'border-l-transparent text-[#C4A882] hover:bg-[#4A2512] hover:text-white'}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{label}</span>
      {badge && badge > 0 && <span className="ml-auto w-5 h-5 bg-[#b22222] text-white text-xs rounded-full flex items-center justify-center">{badge}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F5EFE8] flex">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#228b22] text-white px-5 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2" style={{ animation: 'slideIn 0.3s ease' }}>
          <Check className="w-5 h-5" /> {toast}
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 text-white p-5 flex flex-col flex-shrink-0 fixed left-0 top-0 h-screen z-50 overflow-hidden" style={{ background: 'linear-gradient(180deg, #3E1A0A 0%, #2C1205 100%)' }}>
        <div className="mb-6 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(210,105,30,0.25)' }}>
              <Coffee className="w-5 h-5 text-[#FFA500]" />
            </div>
            <div>
              <h1 className="font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>La Ta Bhore</h1>
              <p className="text-[11px]" style={{ color: '#B8A088' }}>Management System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          <NavItem icon={LayoutDashboard} label="Dashboard" view="dashboard" />
          <NavItem icon={Utensils} label="Menu Management" view="menu" />
          <NavItem icon={ClipboardList} label="Orders" view="orders" badge={activeOrders} />
          <NavItem icon={Grid3x3} label="Tables & QR Codes" view="tables" />
          <NavItem icon={CreditCard} label="Billing" view="billing" badge={pendingBills} />
          <NavItem icon={Users} label="Staff" view="staff" />
          <NavItem icon={Bell} label="Notifications" view="notifications" badge={unreadNotifs} />
          <NavItem icon={Settings} label="Settings" view="settings" />
        </nav>

        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-full bg-[#d2691e] flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-sm">{isAdmin ? 'EM' : 'AU'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{isAdmin ? 'Emmanuel Mugisha' : 'Aline Uwase'}</p>
              <p className="text-xs" style={{ color: '#B8A088' }}>{isAdmin ? 'Super Admin' : 'Manager'}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors" style={{ color: '#C4A882' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(198,40,40,0.2)'; (e.currentTarget as HTMLElement).style.color = '#ff8888'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#C4A882'; }}>
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-auto min-h-screen">

        {/* ─── DASHBOARD ─── */}
        {currentView === 'dashboard' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Dashboard Overview</h1>
              <div className="flex items-center gap-2 text-[#228b22] text-sm">
                <div className="w-2 h-2 rounded-full bg-[#228b22] animate-pulse" />
                <span>Live · Updated just now</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-5 mb-8">
              {[
                { icon: Grid3x3, label: "Active Tables", value: `${occupiedTables}/${tables.length}`, sub: `${Math.round(occupiedTables/tables.length*100)}% occupancy`, color: "#228b22" },
                { icon: ClipboardList, label: "Orders Today", value: "47", sub: "+12% from yesterday", color: "#ff8c00" },
                { icon: TrendingUp, label: "Revenue Today", value: formatCurrency(todayRevenue), sub: "+8% from yesterday", color: "#8b4513" },
                { icon: CreditCard, label: "Pending Bills", value: pendingBills, sub: "Awaiting payment", color: "#b22222" },
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

            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Table Floor Map */}
              <div className="col-span-2 bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                <h2 className="text-xl font-bold text-[#2c1810] mb-4">Floor Plan — Live View</h2>
                <div className="bg-[#fff8f0] rounded-xl p-4 relative" style={{ minHeight: 240 }}>
                  {tables.map(table => {
                    const colors: Record<string, string> = { available: '#228b22', occupied: '#ff8c00', reserved: '#4169e1', blocked: '#9ca3af' };
                    return (
                      <div key={table.table_id} className="absolute cursor-pointer hover:scale-110 transition-transform" style={{ left: table.position_x || 80, top: table.position_y || 80 }}>
                        <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center shadow-md" style={{ background: colors[table.status] || '#9ca3af' }}>
                          <span className="text-white font-black text-sm">{table.table_number}</span>
                          <span className="text-white text-xs opacity-80">{table.seating_capacity}p</span>
                        </div>
                      </div>
                    );
                  })}
                  {/* Legend */}
                  <div className="absolute bottom-3 right-3 flex gap-3">
                    {[['#228b22', 'Free'], ['#ff8c00', 'Busy'], ['#4169e1', 'Reserved'], ['#9ca3af', 'Blocked']].map(([color, label]) => (
                      <div key={label} className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded" style={{ background: color }} />
                        <span className="text-xs text-[#8b7355]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                <h2 className="text-xl font-bold text-[#2c1810] mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button onClick={() => { setCurrentView('menu'); openAddMenu(); }} className="w-full flex items-center gap-3 p-3 bg-[#fff8f0] hover:bg-[#fff0e0] rounded-xl transition-colors">
                    <Plus className="w-5 h-5 text-[#d2691e]" /><span className="font-semibold text-[#2c1810]">Add Menu Item</span>
                  </button>
                  <button onClick={() => setCurrentView('staff')} className="w-full flex items-center gap-3 p-3 bg-[#fff8f0] hover:bg-[#fff0e0] rounded-xl transition-colors">
                    <Users className="w-5 h-5 text-[#4169e1]" /><span className="font-semibold text-[#2c1810]">Manage Staff</span>
                  </button>
                  <button onClick={() => setCurrentView('tables')} className="w-full flex items-center gap-3 p-3 bg-[#fff8f0] hover:bg-[#fff0e0] rounded-xl transition-colors">
                    <QrCode className="w-5 h-5 text-[#8b4513]" /><span className="font-semibold text-[#2c1810]">Generate QR Codes</span>
                  </button>
                  <button onClick={() => setCurrentView('orders')} className="w-full flex items-center gap-3 p-3 bg-[#fff8f0] hover:bg-[#fff0e0] rounded-xl transition-colors">
                    <ClipboardList className="w-5 h-5 text-[#228b22]" /><span className="font-semibold text-[#2c1810]">View Orders</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
              <h2 className="text-xl font-bold text-[#2c1810] mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {mockOrders.slice(0, 6).map(order => {
                  const table = tables.find(t => t.table_id === order.table_id);
                  const statusColors: Record<string, string> = { preparing: 'bg-[#ff8c00]', ready: 'bg-[#228b22]', placed: 'bg-[#4169e1]', completed: 'bg-[#8b7355]', confirmed: 'bg-[#d2691e]' };
                  return (
                    <div key={order.order_id} className="flex items-center justify-between p-4 bg-[#fff8f0] rounded-xl hover:bg-[#fff0e0] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#d2691e] flex items-center justify-center text-white font-black">{table?.table_number}</div>
                        <div>
                          <p className="font-bold text-[#2c1810]">Order #{order.order_id}</p>
                          <p className="text-sm text-[#8b7355]">{formatCurrency(order.total_amount)} · {order.placed_at ? new Date(order.placed_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusColors[order.order_status] || 'bg-[#8b7355]'}`}>{order.order_status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── MENU MANAGEMENT ─── */}
        {currentView === 'menu' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Menu Management</h1>
              <button onClick={openAddMenu} className="bg-[#d2691e] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#8b4513] transition-colors flex items-center gap-2 shadow-[0_4px_12px_rgba(210,105,30,0.3)]">
                <Plus className="w-5 h-5" /> Add Menu Item
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 flex items-center gap-2 bg-white border border-[#e8d5c4] rounded-xl px-4 py-3">
                <Search className="w-5 h-5 text-[#8b7355]" />
                <input value={menuSearch} onChange={e => setMenuSearch(e.target.value)} placeholder="Search items..." className="flex-1 bg-transparent outline-none text-sm" />
              </div>
              <button onClick={() => setActiveMenuCategory(null)} className={`px-4 py-2 rounded-xl font-semibold text-sm border transition-colors ${!activeMenuCategory ? 'bg-[#8b4513] text-white border-[#8b4513]' : 'bg-white text-[#8b7355] border-[#e8d5c4]'}`}>All</button>
              {mockCategories.map(cat => (
                <button key={cat.category_id} onClick={() => setActiveMenuCategory(activeMenuCategory === cat.category_id ? null : cat.category_id)} className={`px-4 py-2 rounded-xl font-semibold text-sm border transition-colors whitespace-nowrap ${activeMenuCategory === cat.category_id ? 'bg-[#8b4513] text-white border-[#8b4513]' : 'bg-white text-[#8b7355] border-[#e8d5c4]'}`}>
                  {cat.emoji} {cat.category_name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-5">
              {filteredMenuItems.map(item => (
                <div key={item.item_id} className="bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(44,24,16,0.08)] hover:shadow-[0_8px_24px_rgba(44,24,16,0.12)] transition-all">
                  <div className="relative">
                    <img src={item.image_url} alt={item.item_name} className="w-full h-48 object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${item.destination_station === 'kitchen' ? 'bg-[#ff8c00] text-white' : 'bg-[#4169e1] text-white'}`}>{item.destination_station}</span>
                    </div>
                    <button onClick={() => toggleItemAvailability(item.item_id)} className="absolute top-3 right-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${item.is_available ? 'bg-[#228b22] text-white' : 'bg-[#b22222] text-white'}`}>
                        {item.is_available ? '● Live' : '● Off'}
                      </div>
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-[#2c1810] flex-1 leading-tight">{item.item_name}</h3>
                    </div>
                    <p className="text-sm text-[#8b7355] mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-black text-[#8b4513]">{formatCurrency(item.price)}</p>
                      <div className="flex gap-1">
                        <button onClick={() => openEditMenu(item)} className="p-2 text-[#8b4513] hover:bg-[#fff0e0] rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(item.item_id)} className="p-2 text-[#b22222] hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {item.is_vegetarian && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">Vegetarian</span>}
                      {item.is_popular && <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">🔥 Popular</span>}
                    </div>
                  </div>
                </div>
              ))}
              {filteredMenuItems.length === 0 && (
                <div className="col-span-3 bg-white rounded-xl p-12 text-center shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                  <Utensils className="w-14 h-14 text-[#e8d5c4] mx-auto mb-4" />
                  <p className="text-xl font-bold text-[#2c1810] mb-2">No items found</p>
                  <p className="text-[#8b7355] mb-4">Try different filters or add a new item</p>
                  <button onClick={openAddMenu} className="bg-[#d2691e] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#8b4513] transition-colors">Add First Item</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── ORDERS ─── */}
        {currentView === 'orders' && (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-[#2c1810] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Orders</h1>
            <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
              <table className="w-full">
                <thead><tr className="border-b border-[#e8d5c4] bg-[#fff8f0]">
                  {['Order #', 'Table', 'Status', 'Items', 'Total', 'Time', 'Action'].map(h => (
                    <th key={h} className="text-left py-4 px-5 text-sm font-bold text-[#8b7355]">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockOrders.map(order => {
                    const table = tables.find(t => t.table_id === order.table_id);
                    const itemCount = mockOrderItems.filter(oi => oi.order_id === order.order_id).length;
                    const statusColors: Record<string, string> = { preparing: 'bg-[#ff8c00]', ready: 'bg-[#228b22]', placed: 'bg-[#4169e1]', completed: 'bg-[#8b7355]', confirmed: 'bg-[#d2691e]', cancelled: 'bg-[#b22222]' };
                    return (
                      <tr key={order.order_id} className="border-b border-[#f5f0ea] hover:bg-[#fff8f0] transition-colors">
                        <td className="py-4 px-5 font-bold text-[#2c1810]">#{order.order_id}</td>
                        <td className="py-4 px-5"><span className="w-9 h-9 rounded-lg bg-[#d2691e] text-white font-bold flex items-center justify-center text-sm">{table?.table_number}</span></td>
                        <td className="py-4 px-5"><span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusColors[order.order_status] || 'bg-[#8b7355]'}`}>{order.order_status}</span></td>
                        <td className="py-4 px-5 text-[#8b7355]">{itemCount} items</td>
                        <td className="py-4 px-5 font-bold text-[#8b4513]">{formatCurrency(order.total_amount)}</td>
                        <td className="py-4 px-5 text-sm text-[#8b7355]">{order.placed_at ? new Date(order.placed_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                        <td className="py-4 px-5">
                          <button
                            onClick={() => setSelectedOrder(order.order_id)}
                            className="text-sm text-[#d2691e] font-semibold hover:text-[#8b4513] transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TABLES & QR ─── */}
        {currentView === 'tables' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Tables & QR Codes</h1>
              <button
                onClick={() => {
                  setEditingTable(null);
                  setTableForm({ table_number: '', section: '', seating_capacity: 2 });
                  setShowTableModal(true);
                }}
                className="bg-[#d2691e] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#8b4513] transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Table
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
              <table className="w-full">
                <thead><tr className="border-b border-[#e8d5c4] bg-[#fff8f0]">
                  {['Table', 'Section', 'Capacity', 'QR Token', 'Status', 'Active', 'Actions'].map(h => (
                    <th key={h} className="text-left py-4 px-5 text-sm font-bold text-[#8b7355]">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {tables.map(table => (
                    <tr key={table.table_id} className="border-b border-[#f5f0ea] hover:bg-[#fff8f0] transition-colors">
                      <td className="py-4 px-5 font-black text-xl text-[#2c1810]">{table.table_number}</td>
                      <td className="py-4 px-5 text-[#8b7355]">{table.section}</td>
                      <td className="py-4 px-5 text-[#8b7355]">{table.seating_capacity} seats</td>
                      <td className="py-4 px-5">
                        <code className="text-xs bg-[#fff8f0] px-2 py-1 rounded font-mono text-[#8b4513] border border-[#e8d5c4]">{table.qr_code_token}</code>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${table.status === 'available' ? 'bg-[#228b22] text-white' : table.status === 'occupied' ? 'bg-[#ff8c00] text-white' : table.status === 'reserved' ? 'bg-[#4169e1] text-white' : 'bg-[#9ca3af] text-white'}`}>{table.status}</span>
                      </td>
                      <td className="py-4 px-5">
                        <button onClick={() => setTables(prev => prev.map(t => t.table_id === table.table_id ? { ...t, is_active: !t.is_active } : t))} className={`w-10 h-6 rounded-full transition-colors flex items-center ${table.is_active ? 'bg-[#228b22]' : 'bg-[#d1d5db]'}`}>
                          <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${table.is_active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                        </button>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex gap-2">
                          <button onClick={() => setShowQRModal(table)} className="p-2 text-[#8b4513] hover:bg-[#fff0e0] rounded-lg transition-colors" title="View QR Code">
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingTable(table);
                              setTableForm({ table_number: table.table_number, section: table.section, seating_capacity: table.seating_capacity });
                              setShowTableModal(true);
                            }}
                            className="p-2 text-[#4169e1] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => {
                            const newToken = generateQRToken();
                            setTables(prev => prev.map(t => t.table_id === table.table_id ? { ...t, qr_code_token: newToken } : t));
                            showToast(`New QR token generated for ${table.table_number}`);
                          }} className="p-2 text-[#ff8c00] hover:bg-orange-50 rounded-lg transition-colors" title="Regenerate QR">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete table ${table.table_number}?`)) {
                                setTables(prev => prev.filter(t => t.table_id !== table.table_id));
                                showToast(`Table ${table.table_number} deleted`);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Table"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── BILLING ─── */}
        {currentView === 'billing' && (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-[#2c1810] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Billing & Payments</h1>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Today's Revenue", value: formatCurrency(todayRevenue), color: "#228b22" },
                { label: "Pending Bills", value: pendingBills, color: "#ff8c00" },
                { label: "Bills Paid Today", value: mockBills.filter(b => b.bill_status === 'paid').length, color: "#8b4513" },
                { label: "Avg Bill Size", value: formatCurrency(15890), color: "#4169e1" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                  <p className="text-sm text-[#8b7355] mb-2">{label}</p>
                  <p className="text-2xl font-black" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
              <table className="w-full">
                <thead><tr className="border-b border-[#e8d5c4] bg-[#fff8f0]">
                  {['Bill #', 'Order #', 'Subtotal', 'Tax', 'Total', 'Status', 'Generated'].map(h => (
                    <th key={h} className="text-left py-4 px-5 text-sm font-bold text-[#8b7355]">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockBills.map(bill => (
                    <tr key={bill.bill_id} className="border-b border-[#f5f0ea] hover:bg-[#fff8f0] transition-colors">
                      <td className="py-4 px-5 font-mono text-sm text-[#2c1810]">{bill.bill_number}</td>
                      <td className="py-4 px-5 font-semibold text-[#2c1810]">#{bill.order_id}</td>
                      <td className="py-4 px-5 text-[#8b7355]">{formatCurrency(bill.subtotal)}</td>
                      <td className="py-4 px-5 text-[#8b7355]">{formatCurrency(bill.tax_amount)}</td>
                      <td className="py-4 px-5 font-black text-[#8b4513]">{formatCurrency(bill.total_amount)}</td>
                      <td className="py-4 px-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${bill.bill_status === 'paid' ? 'bg-[#228b22] text-white' : bill.bill_status === 'ready' ? 'bg-[#ff8c00] text-white' : 'bg-[#8b7355] text-white'}`}>{bill.bill_status}</span>
                      </td>
                      <td className="py-4 px-5 text-sm text-[#8b7355]">{new Date(bill.generated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── STAFF ─── */}
        {currentView === 'staff' && (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-[#2c1810] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Staff Management</h1>
            <StaffManagement isAdmin={isAdmin} />
          </div>
        )}

        {/* ─── NOTIFICATIONS ─── */}
        {currentView === 'notifications' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Notifications</h1>
              <button onClick={() => setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))} className="text-sm text-[#d2691e] font-semibold border border-[#d2691e] px-4 py-2 rounded-xl hover:bg-[#fff0e0] transition-colors">Mark All Read</button>
            </div>
            <div className="space-y-3">
              {notifs.map(notif => (
                <div key={notif.notification_id} className={`bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(44,24,16,0.08)] flex items-start gap-4 ${!notif.is_read ? 'border-l-4 border-l-[#d2691e]' : ''}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.type === 'order_ready' ? 'bg-[#4169e1]/10' : notif.type === 'new_order' ? 'bg-[#228b22]/10' : notif.type === 'system' ? 'bg-[#ff8c00]/10' : 'bg-[#8b7355]/10'}`}>
                    <Bell className={`w-6 h-6 ${notif.type === 'order_ready' ? 'text-[#4169e1]' : notif.type === 'new_order' ? 'text-[#228b22]' : 'text-[#ff8c00]'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-[#2c1810]">{notif.title}</p>
                      {!notif.is_read && <span className="w-2 h-2 rounded-full bg-[#d2691e] mt-1.5 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-[#8b7355] mt-1">{notif.message}</p>
                    <p className="text-xs text-[#c4a882] mt-2">{new Date(notif.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <button onClick={() => setNotifs(prev => prev.filter(n => n.notification_id !== notif.notification_id))} className="text-[#c4a882] hover:text-[#8b7355]"><X className="w-5 h-5" /></button>
                </div>
              ))}
              {notifs.length === 0 && (
                <div className="bg-white rounded-xl p-12 text-center shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                  <Bell className="w-14 h-14 text-[#e8d5c4] mx-auto mb-4" />
                  <p className="text-xl font-bold text-[#2c1810] mb-2">All Clear!</p>
                  <p className="text-[#8b7355]">No new notifications</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── SETTINGS ─── */}
        {currentView === 'settings' && (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-[#2c1810] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Settings</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                <h3 className="text-lg font-bold text-[#2c1810] mb-4">Restaurant Information</h3>
                {[
                  { label: "Restaurant Name", value: "La Ta Bhore", type: "text" },
                  { label: "Address", value: "KG 12 Ave, Kigali, Rwanda", type: "text" },
                  { label: "Phone", value: "+250 788 000 111", type: "tel" },
                  { label: "Email", value: "info@latabhore.rw", type: "email" },
                ].map(({ label, value, type }) => (
                  <div key={label} className="mb-4">
                    <label className="block text-sm font-semibold text-[#2c1810] mb-1">{label}</label>
                    <input type={type} defaultValue={value} className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513] text-sm" />
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(44,24,16,0.08)]">
                <h3 className="text-lg font-bold text-[#2c1810] mb-4">Business Settings</h3>
                {[
                  { label: "Tax Rate (%)", value: "18" },
                  { label: "Currency", value: "RWF (Rwandan Franc)" },
                  { label: "Opening Hours", value: "07:00 AM" },
                  { label: "Closing Hours", value: "10:00 PM" },
                ].map(({ label, value }) => (
                  <div key={label} className="mb-4">
                    <label className="block text-sm font-semibold text-[#2c1810] mb-1">{label}</label>
                    <input defaultValue={value} className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513] text-sm" />
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-4 bg-[#d2691e] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#8b4513] transition-colors shadow-[0_4px_12px_rgba(210,105,30,0.3)]">
              Save Settings
            </button>
          </div>
        )}
      </div>

      {/* ─── MENU ITEM MODAL ─── */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#e8d5c4]">
              <h2 className="text-xl font-bold text-[#2c1810]">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
              <button onClick={() => setShowMenuModal(false)} className="text-[#8b7355] hover:text-[#2c1810]"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#2c1810] mb-1">Item Name *</label>
                <input value={menuForm.item_name} onChange={e => setMenuForm(f => ({ ...f, item_name: e.target.value }))} className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513]" placeholder="e.g. Chocolate Croissant" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2c1810] mb-1">Description</label>
                <textarea value={menuForm.description} onChange={e => setMenuForm(f => ({ ...f, description: e.target.value }))} className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513] resize-none" rows={2} placeholder="Describe the item..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#2c1810] mb-1">Price (RWF) *</label>
                  <input type="number" value={menuForm.price} onChange={e => setMenuForm(f => ({ ...f, price: e.target.value }))} className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513]" placeholder="5000" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2c1810] mb-1">Category</label>
                  <select value={menuForm.category_id} onChange={e => setMenuForm(f => ({ ...f, category_id: e.target.value }))} className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513] bg-white">
                    {mockCategories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.emoji} {cat.category_name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#2c1810] mb-1">Station</label>
                  <div className="flex gap-2">
                    {(['kitchen', 'bar'] as const).map(s => (
                      <button key={s} onClick={() => setMenuForm(f => ({ ...f, destination_station: s }))} className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-colors capitalize ${menuForm.destination_station === s ? 'bg-[#d2691e] text-white border-[#d2691e]' : 'border-[#e8d5c4] text-[#8b7355]'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2c1810] mb-1">Allergens</label>
                  <input value={menuForm.contains_allergens} onChange={e => setMenuForm(f => ({ ...f, contains_allergens: e.target.value }))} className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513]" placeholder="Dairy, Gluten, Nuts..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2c1810] mb-1">Image URL</label>
                <input value={menuForm.image_url} onChange={e => setMenuForm(f => ({ ...f, image_url: e.target.value }))} className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513]" placeholder="https://..." />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={menuForm.is_vegetarian} onChange={e => setMenuForm(f => ({ ...f, is_vegetarian: e.target.checked }))} className="w-4 h-4" />
                  <span className="text-sm font-semibold text-[#2c1810]">Vegetarian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={menuForm.is_available} onChange={e => setMenuForm(f => ({ ...f, is_available: e.target.checked }))} className="w-4 h-4" />
                  <span className="text-sm font-semibold text-[#2c1810]">Available Now</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowMenuModal(false)} className="flex-1 border-2 border-[#e8d5c4] text-[#8b7355] py-3 rounded-xl font-semibold hover:bg-[#fff8f0]">Cancel</button>
                <button onClick={saveMenuItem} disabled={!menuForm.item_name || !menuForm.price} className="flex-1 bg-[#d2691e] text-white py-3 rounded-xl font-bold hover:bg-[#8b4513] transition-colors disabled:opacity-40">
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRM ─── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-[#b22222]" />
            </div>
            <h3 className="text-xl font-bold text-[#2c1810] text-center mb-2">Delete Item?</h3>
            <p className="text-[#8b7355] text-center mb-5">This action cannot be undone. The item will be permanently removed from the menu.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 border-2 border-[#e8d5c4] text-[#8b7355] py-3 rounded-xl font-semibold">Cancel</button>
              <button onClick={() => deleteMenuItem(showDeleteConfirm)} className="flex-1 bg-[#b22222] text-white py-3 rounded-xl font-bold hover:bg-[#8b0000] transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── QR CODE MODAL ─── */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#2c1810]">QR Code — {showQRModal.table_number}</h3>
              <button onClick={() => setShowQRModal(null)} className="text-[#8b7355] hover:text-[#2c1810]"><X className="w-6 h-6" /></button>
            </div>
            <div className="bg-[#fff8f0] rounded-xl p-6 mb-4 flex flex-col items-center gap-3">
              <p className="text-xs text-[#8b7355] font-semibold uppercase tracking-widest">La Ta Bhore</p>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <QRCodeDisplay
                  value={getQRCodeURL(showQRModal)}
                  size={180}
                  fgColor="#2c1810"
                  bgColor="#ffffff"
                />
              </div>
              <p className="text-lg font-black text-[#2c1810]">Table {showQRModal.table_number}</p>
              <p className="text-sm text-[#8b7355]">Capacity: {showQRModal.seating_capacity} persons</p>
              <p className="text-xs text-[#c4a882]">Scan to view menu & order</p>
            </div>
            <div className="bg-[#fff0e0] rounded-xl p-3 mb-4">
              <p className="text-xs text-[#8b7355] mb-1 font-semibold">QR URL:</p>
              <p className="text-xs text-[#8b4513] font-mono break-all">{getQRCodeURL(showQRModal)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => {
                const newToken = generateQRToken();
                setTables(prev => prev.map(t => t.table_id === showQRModal.table_id ? { ...t, qr_code_token: newToken } : t));
                setShowQRModal(prev => prev ? { ...prev, qr_code_token: newToken } : null);
                showToast(`QR regenerated for ${showQRModal.table_number}`);
              }} className="flex items-center justify-center gap-2 border-2 border-[#e8d5c4] text-[#8b7355] py-3 rounded-xl font-semibold hover:bg-[#fff8f0]">
                <RefreshCw className="w-4 h-4" /> Regenerate
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#d2691e] text-white py-3 rounded-xl font-bold hover:bg-[#8b4513] transition-colors">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
            <button className="w-full mt-2 flex items-center justify-center gap-2 border-2 border-[#e8d5c4] text-[#8b7355] py-3 rounded-xl font-semibold hover:bg-[#fff8f0]">
              <Printer className="w-4 h-4" /> Print QR Code
            </button>
          </div>
        </div>
      )}

      {/* ─── ADD TABLE MODAL ─── */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#2c1810]">{editingTable ? 'Edit Table' : 'Add New Table'}</h3>
              <button onClick={() => { setShowTableModal(false); setEditingTable(null); }} className="text-[#8b7355]"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#2c1810] mb-1">Table Number</label>
                <input
                  value={tableForm.table_number}
                  onChange={(e) => setTableForm({ ...tableForm, table_number: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513]"
                  placeholder="e.g. T9"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2c1810] mb-1">Section</label>
                <input
                  value={tableForm.section}
                  onChange={(e) => setTableForm({ ...tableForm, section: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513]"
                  placeholder="e.g. Window, Terrace..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2c1810] mb-1">Seating Capacity</label>
                <select
                  value={tableForm.seating_capacity}
                  onChange={(e) => setTableForm({ ...tableForm, seating_capacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-[#e8d5c4] rounded-xl focus:outline-none focus:border-[#8b4513] bg-white"
                >
                  {[2, 4, 6, 8, 10, 12].map(n => <option key={n} value={n}>{n} persons</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowTableModal(false); setEditingTable(null); }} className="flex-1 border-2 border-[#e8d5c4] text-[#8b7355] py-3 rounded-xl font-semibold">Cancel</button>
              <button
                onClick={() => {
                  if (editingTable) {
                    setTables(prev => prev.map(t => t.table_id === editingTable.table_id
                      ? { ...t, table_number: tableForm.table_number, section: tableForm.section, seating_capacity: tableForm.seating_capacity }
                      : t
                    ));
                    showToast('Table updated successfully!');
                  } else {
                    const newTable: RestaurantTable = {
                      table_id: Math.max(...tables.map(t => t.table_id)) + 1,
                      table_number: tableForm.table_number,
                      section: tableForm.section,
                      seating_capacity: tableForm.seating_capacity,
                      qr_code_token: generateQRToken(),
                      status: 'available',
                      is_active: true,
                    };
                    setTables(prev => [...prev, newTable]);
                    showToast('New table added successfully!');
                  }
                  setShowTableModal(false);
                  setEditingTable(null);
                }}
                className="flex-1 bg-[#d2691e] text-white py-3 rounded-xl font-bold hover:bg-[#8b4513]"
              >
                {editingTable ? 'Update Table' : 'Add Table'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ORDER DETAILS MODAL ─── */}
      {selectedOrder && (() => {
        const order = mockOrders.find(o => o.order_id === selectedOrder);
        if (!order) return null;
        const orderItems = mockOrderItems.filter(oi => oi.order_id === selectedOrder);
        const table = tables.find(t => t.table_id === order.table_id);
        return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-[#e8d5c4] px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Order #{order.order_id}
                  </h3>
                  <p className="text-sm text-[#8b7355]">Table {table?.table_number} • {order.placed_at ? new Date(order.placed_at).toLocaleString() : ''}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-[#8b7355] hover:text-[#2c1810]">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-[#fff8f0] rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-[#8b7355] mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                        order.order_status === 'preparing' ? 'bg-[#ff8c00]' :
                        order.order_status === 'ready' ? 'bg-[#228b22]' :
                        order.order_status === 'placed' ? 'bg-[#4169e1]' :
                        order.order_status === 'completed' ? 'bg-[#8b7355]' : 'bg-[#d2691e]'
                      }`}>{order.order_status}</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#8b7355] mb-1">Items</p>
                      <p className="text-lg font-bold text-[#2c1810]">{orderItems.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#8b7355] mb-1">Total</p>
                      <p className="text-lg font-bold text-[#8b4513]">{formatCurrency(order.total_amount)}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-[#2c1810] mb-2">Order Items</h4>
                  {orderItems.map((item) => {
                    const menuItem = mockMenuItems.find(mi => mi.item_id === item.item_id);
                    return (
                      <div key={item.order_item_id} className="border border-[#e8d5c4] rounded-xl p-4 flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-bold text-[#2c1810]">{menuItem?.item_name || 'Unknown Item'}</h5>
                          <p className="text-sm text-[#8b7355]">Qty: {item.quantity} × {formatCurrency(item.price_at_order || 0)}</p>
                          {item.special_notes && (
                            <p className="text-sm text-[#d2691e] mt-1">Note: {item.special_notes}</p>
                          )}
                          <div className="mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              item.item_status === 'ready' ? 'bg-[#228b22] text-white' :
                              item.item_status === 'preparing' ? 'bg-[#ff8c00] text-white' :
                              'bg-[#e8d5c4] text-[#8b7355]'
                            }`}>{item.item_status}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#8b4513]">{formatCurrency((item.price_at_order || 0) * item.quantity)}</p>
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                            item.destination_station === 'kitchen' ? 'bg-[#ff8c00] text-white' : 'bg-[#0288d1] text-white'
                          }`}>{item.destination_station === 'kitchen' ? 'Kitchen' : 'Bar'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 pt-4 border-t border-[#e8d5c4]">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b7355]">Subtotal:</span>
                      <span className="font-semibold text-[#2c1810]">{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b7355]">Tax (18%):</span>
                      <span className="font-semibold text-[#2c1810]">{formatCurrency(order.tax_amount)}</span>
                    </div>
                    <div className="flex justify-between text-lg pt-2 border-t border-[#e8d5c4]">
                      <span className="font-bold text-[#2c1810]">Total:</span>
                      <span className="font-bold text-[#8b4513]">{formatCurrency(order.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}


      <style>{`@keyframes slideIn { from { transform: translateX(20px); opacity:0; } to { transform: translateX(0); opacity:1; } }`}</style>
    </div>
  );
}
