import { useState, useEffect } from 'react';
import {
  Grid3x3, List, Bell, User, Clock, Utensils, CreditCard,
  AlertCircle, CheckCircle, ChevronRight, Phone, RefreshCw,
  X, Check, LayoutDashboard, Eye, ArrowLeft, MapPin, Users,
  Zap, Coffee, Star, TrendingUp, ClipboardList,
} from 'lucide-react';
import {
  mockTables, mockOrders, mockOrderItems, mockNotifications,
  mockTableSessions, RestaurantTable, Order, formatCurrency,
  getMenuItemById, getTableById, getUserById, mockMenuItems,
} from '../../../data/mockData';
import { StaffLayout } from '../layouts/StaffLayout';
import { motion, AnimatePresence } from 'motion/react';

type WaiterPage = 'dashboard' | 'tables' | 'orders' | 'notifications';

interface WaiterDashboardProps {
  waiterId: number;
  onTableSelect: (tableId: number) => void;
  onLogout?: () => void;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  available:  { bg: '#E8F5E9', text: '#228B22', dot: '#228B22', label: 'Available' },
  occupied:   { bg: '#FFF3E0', text: '#E65100', dot: '#FF8C00', label: 'Occupied' },
  ready:      { bg: '#E3F2FD', text: '#1565C0', dot: '#4169E1', label: 'Ready to Serve' },
  preparing:  { bg: '#FFF8F0', text: '#8B4513', dot: '#D2691E', label: 'Preparing' },
  reserved:   { bg: '#F3E5F5', text: '#6A1B9A', dot: '#9C27B0', label: 'Reserved' },
  blocked:    { bg: '#F5F5F5', text: '#9E9E9E', dot: '#BDBDBD', label: 'Blocked' },
};

export function WaiterDashboard({ waiterId, onTableSelect, onLogout }: WaiterDashboardProps) {
  const [activePage, setActivePage] = useState<WaiterPage>('dashboard');
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notifications, setNotifications] = useState(mockNotifications.filter(n => n.target_role === 'waiter'));
  const [itemStatuses, setItemStatuses] = useState<Record<number, string>>({});
  const [showCallModal, setShowCallModal] = useState(false);
  const [callReason, setCallReason] = useState('');
  const [callSent, setCallSent] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifFilter, setNotifFilter] = useState<'all' | 'orders' | 'ready' | 'calls'>('all');

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const waiter = getUserById(waiterId);
  const assignedOrders = mockOrders.filter(o => o.assigned_waiter_id === waiterId);
  const assignedTableIds = new Set(assignedOrders.map(o => o.table_id));

  const activeTables = mockTables.filter(t => assignedTableIds.has(t.table_id) && t.status === 'occupied').length;
  const pendingOrders = assignedOrders.filter(o => ['placed', 'confirmed'].includes(o.order_status)).length;
  const readyToServe = mockOrderItems.filter(oi => assignedOrders.some(o => o.order_id === oi.order_id) && oi.item_status === 'ready').length;
  const readyToPay = assignedOrders.filter(o => o.order_status === 'ready').length;
  const unreadNotifs = notifications.filter(n => !n.is_read).length;

  const getTableStatus = (table: RestaurantTable) => {
    if (table.status === 'available') return 'available';
    if (table.status === 'reserved') return 'reserved';
    if (table.status === 'blocked') return 'blocked';
    const order = assignedOrders.find(o => o.table_id === table.table_id && o.order_status !== 'completed');
    if (!order) return 'occupied';
    const hasReady = mockOrderItems.some(oi => oi.order_id === order.order_id && oi.item_status === 'ready');
    if (hasReady) return 'ready';
    if (['preparing', 'confirmed'].includes(order.order_status)) return 'preparing';
    return 'occupied';
  };

  const filteredNotifs = notifications.filter(n => {
    if (notifFilter === 'orders') return n.type === 'new_order';
    if (notifFilter === 'ready') return n.type === 'order_ready';
    if (notifFilter === 'calls') return n.type === 'call_waiter';
    return true;
  });

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  const dismissNotif = (id: number) => setNotifications(prev => prev.filter(n => n.notification_id !== id));
  const markItemServed = (itemId: number) => setItemStatuses(prev => ({ ...prev, [itemId]: 'served' }));

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tables', label: 'Tables', icon: Grid3x3 },
    { id: 'orders', label: 'Active Orders', icon: ClipboardList, badge: pendingOrders },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs },
  ];

  const stats = [
    { label: 'Active Tables', value: activeTables, icon: Grid3x3, color: '#8B4513', bg: '#FFF0E0' },
    { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: '#FF8C00', bg: '#FFF3E0' },
    { label: 'Ready to Serve', value: readyToServe, icon: Bell, color: '#4169E1', bg: '#EEF2FF' },
    { label: 'Ready to Pay', value: readyToPay, icon: CreditCard, color: '#228B22', bg: '#E8F5E9' },
  ];

  // ── TABLE DETAIL PANEL ──
  if (selectedTable) {
    const tableOrders = assignedOrders.filter(o => o.table_id === selectedTable.table_id && o.order_status !== 'completed');
    const session = mockTableSessions.find(s => s.table_id === selectedTable.table_id && s.is_active);
    const status = getTableStatus(selectedTable);
    const sc = STATUS_CONFIG[status] || STATUS_CONFIG.available;

    return (
      <StaffLayout
        role="waiter" userName={`${waiter?.first_name || 'Waiter'} ${waiter?.last_name || ''}`}
        userInitials={`${waiter?.first_name?.[0] || 'W'}${waiter?.last_name?.[0] || 'A'}`}
        activeTab="tables" setActiveTab={(tab) => { setActivePage(tab as WaiterPage); setSelectedTable(null); }}
        navItems={navItems} onLogout={onLogout || (() => {})}
        pageTitle={`Table ${selectedTable.table_number} — Details`}
        unreadCount={unreadNotifs}
      >
        <div className="p-6">
          <button onClick={() => setSelectedTable(null)}
            className="flex items-center gap-2 text-[#8B4513] font-semibold mb-6 hover:gap-3 transition-all">
            <ArrowLeft className="w-5 h-5" /> Back to Tables
          </button>

          <div className="grid grid-cols-3 gap-5">
            {/* Left: Table Info */}
            <div className="col-span-2 space-y-5">
              {/* Table Header */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D5C4]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Table {selectedTable.table_number}
                    </h2>
                    <p className="text-[#8B7355] flex items-center gap-1.5 mt-1">
                      <MapPin className="w-4 h-4" /> {selectedTable.section} · {selectedTable.seating_capacity} seats
                    </p>
                  </div>
                  <span className="px-4 py-2 rounded-full text-sm font-bold"
                    style={{ background: sc.bg, color: sc.text }}>
                    <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: sc.dot }} />
                    {sc.label}
                  </span>
                </div>

                {session && (
                  <div className="flex items-center gap-4 p-3 bg-[#FFF8F0] rounded-xl border border-[#E8D5C4]">
                    <div className="w-10 h-10 rounded-full bg-[#D2691E]/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#D2691E]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#2C1810]">{session.customer_count} guest{session.customer_count > 1 ? 's' : ''}</p>
                      <p className="text-xs text-[#8B7355]">Session started {new Date(session.started_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#228B22] animate-pulse" />
                      <span className="text-xs font-semibold text-[#228B22]">Active</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Orders */}
              {tableOrders.length > 0 ? tableOrders.map(order => {
                const items = mockOrderItems.filter(oi => oi.order_id === order.order_id);
                const readyCount = items.filter(oi => oi.item_status === 'ready').length;
                return (
                  <div key={order.order_id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D5C4]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-[#2C1810] text-lg">Order #{order.order_id}</h3>
                        <p className="text-sm text-[#8B7355]">{items.length} items · {formatCurrency(order.total_amount)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.order_status === 'ready' ? 'bg-[#228B22] text-white' :
                        order.order_status === 'preparing' ? 'bg-[#FF8C00] text-white' :
                        'bg-[#8B7355] text-white'}`}>
                        {order.order_status.toUpperCase()}
                      </span>
                    </div>

                    {readyCount > 0 && (
                      <div className="flex items-center gap-2 bg-[#4169E1]/10 rounded-xl px-4 py-3 mb-4 border border-[#4169E1]/20">
                        <Bell className="w-4 h-4 text-[#4169E1]" />
                        <span className="text-sm font-bold text-[#4169E1]">{readyCount} item{readyCount > 1 ? 's' : ''} ready to serve!</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      {items.map(oi => {
                        const mi = getMenuItemById(oi.menu_item_id);
                        const st = itemStatuses[oi.order_item_id] || oi.item_status;
                        return (
                          <div key={oi.order_item_id} className="flex items-center justify-between py-2 border-b border-[#F5EFE8] last:border-0">
                            <div className="flex-1">
                              <p className="font-semibold text-[#2C1810]">{mi?.item_name}</p>
                              <p className="text-xs text-[#8B7355]">Qty {oi.quantity} · {formatCurrency(oi.unit_price * oi.quantity)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                st === 'ready' ? 'bg-[#228B22] text-white' :
                                st === 'served' ? 'bg-[#4169E1] text-white' :
                                st === 'preparing' ? 'bg-[#FF8C00] text-white' :
                                'bg-[#E8D5C4] text-[#8B7355]'}`}>{st}</span>
                              {st === 'ready' && (
                                <button onClick={() => markItemServed(oi.order_item_id)}
                                  className="px-3 py-1 bg-[#228B22] text-white text-xs font-bold rounded-lg hover:bg-[#1A6B1A] transition-colors flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Serve
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button onClick={() => setSelectedOrder(order)}
                      className="mt-4 w-full border-2 border-[#D2691E] text-[#D2691E] py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#FFF0E0] transition-colors">
                      View Full Order Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              }) : (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#E8D5C4]">
                  <Utensils className="w-12 h-12 text-[#E8D5C4] mx-auto mb-3" />
                  <p className="font-semibold text-[#8B7355]">No active orders for this table</p>
                </div>
              )}
            </div>

            {/* Right: Quick Actions */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8D5C4]">
                <h3 className="font-bold text-[#2C1810] mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button onClick={() => setShowCallModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#EEF2FF] rounded-xl hover:bg-[#E0E7FF] transition-colors text-left">
                    <Phone className="w-5 h-5 text-[#4169E1]" />
                    <span className="font-semibold text-sm text-[#2C1810]">Call Manager</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#E8F5E9] rounded-xl hover:bg-[#D5EED7] transition-colors text-left">
                    <CheckCircle className="w-5 h-5 text-[#228B22]" />
                    <span className="font-semibold text-sm text-[#2C1810]">Mark All Served</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#FFF0E0] rounded-xl hover:bg-[#FFE4CC] transition-colors text-left">
                    <CreditCard className="w-5 h-5 text-[#D2691E]" />
                    <span className="font-semibold text-sm text-[#2C1810]">Request Bill</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8D5C4]">
                <h3 className="font-bold text-[#2C1810] mb-3">Table QR Code</h3>
                <div className="bg-[#FFF8F0] rounded-xl p-4 text-center">
                  <div className="w-20 h-20 bg-[#2C1810] rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Grid3x3 className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-xs text-[#8B7355] font-medium">Table {selectedTable.table_number}</p>
                  <p className="text-xs text-[#C4A882] mt-1 break-all">{selectedTable.qr_code_token.slice(0, 20)}...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call Manager Modal */}
        <AnimatePresence>
          {showCallModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
                {callSent ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-16 h-16 text-[#228B22] mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-[#2C1810]">Alert Sent!</h3>
                    <p className="text-[#8B7355] text-sm mt-1">Manager has been notified</p>
                    <button onClick={() => { setShowCallModal(false); setCallSent(false); setCallReason(''); }}
                      className="mt-4 px-6 py-2 bg-[#228B22] text-white rounded-xl font-bold">Done</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-[#2C1810]">Call Manager</h3>
                      <button onClick={() => setShowCallModal(false)} className="text-[#8B7355] hover:text-[#2C1810]"><X className="w-5 h-5" /></button>
                    </div>
                    <p className="text-sm text-[#8B7355] mb-4">Notify manager for Table {selectedTable.table_number}</p>
                    <textarea value={callReason} onChange={e => setCallReason(e.target.value)}
                      placeholder="Reason (optional)..."
                      className="w-full border border-[#E8D5C4] rounded-xl px-4 py-3 text-sm text-[#2C1810] mb-4 focus:outline-none focus:border-[#8B4513] resize-none"
                      rows={3} />
                    <div className="flex gap-3">
                      <button onClick={() => setShowCallModal(false)}
                        className="flex-1 border-2 border-[#E8D5C4] text-[#8B7355] py-2.5 rounded-xl font-semibold hover:border-[#8B7355] transition-colors">
                        Cancel
                      </button>
                      <button onClick={() => setCallSent(true)}
                        className="flex-1 bg-[#4169E1] text-white py-2.5 rounded-xl font-semibold hover:bg-[#3558C8] transition-colors flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" /> Send Alert
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </StaffLayout>
    );
  }

  // ── ORDER DETAIL ──
  if (selectedOrder) {
    const orderItems = mockOrderItems.filter(oi => oi.order_id === selectedOrder.order_id);
    const table = getTableById(selectedOrder.table_id);

    return (
      <StaffLayout
        role="waiter" userName={`${waiter?.first_name || 'Waiter'} ${waiter?.last_name || ''}`}
        userInitials={`${waiter?.first_name?.[0] || 'W'}${waiter?.last_name?.[0] || 'A'}`}
        activeTab="orders" setActiveTab={(tab) => { setActivePage(tab as WaiterPage); setSelectedOrder(null); }}
        navItems={navItems} onLogout={onLogout || (() => {})}
        pageTitle={`Order #${selectedOrder.order_id} — Details`}
        unreadCount={unreadNotifs}
      >
        <div className="p-6">
          <button onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-[#8B4513] font-semibold mb-6 hover:gap-3 transition-all">
            <ArrowLeft className="w-5 h-5" /> Back to Orders
          </button>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 space-y-5">
              {selectedOrder.special_instructions && (
                <div className="bg-[#FFF3CD] border border-[#FFC107] rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#E07B00] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#8B5E00] text-sm">Special Instructions</p>
                    <p className="text-sm text-[#8B5E00] mt-0.5">{selectedOrder.special_instructions}</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D5C4]">
                <h3 className="font-bold text-[#2C1810] mb-4">Order Items</h3>
                <div className="space-y-4">
                  {orderItems.map(oi => {
                    const mi = getMenuItemById(oi.menu_item_id);
                    const st = itemStatuses[oi.order_item_id] || oi.item_status;
                    return (
                      <div key={oi.order_item_id} className="flex items-start gap-4 p-3 bg-[#FFF8F0] rounded-xl">
                        <div className="flex-1">
                          <p className="font-bold text-[#2C1810]">{mi?.item_name}</p>
                          <p className="text-sm text-[#8B7355]">Qty: {oi.quantity} · {formatCurrency(oi.unit_price * oi.quantity)}</p>
                          {oi.special_notes && <p className="text-xs text-[#D2691E] italic mt-1">{oi.special_notes}</p>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            st === 'ready' ? 'bg-[#228B22] text-white' :
                            st === 'served' ? 'bg-[#4169E1] text-white' :
                            st === 'preparing' ? 'bg-[#FF8C00] text-white' :
                            'bg-[#E8D5C4] text-[#8B7355]'}`}>{st}</span>
                          {st === 'ready' && (
                            <button onClick={() => markItemServed(oi.order_item_id)}
                              className="px-3 py-1 bg-[#228B22] text-white text-xs font-bold rounded-lg hover:bg-[#1A6B1A] transition-colors flex items-center gap-1">
                              <Check className="w-3 h-3" /> Serve
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D5C4]">
                <h3 className="font-bold text-[#2C1810] mb-3">Activity Log</h3>
                <div className="space-y-3">
                  {[
                    { time: '08:45', text: 'Order placed by customer', color: '#8B7355' },
                    { time: '08:46', text: 'Order confirmed by kitchen', color: '#228B22' },
                    { time: '08:47', text: 'Items sent to kitchen & bar', color: '#4169E1' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-[#8B7355] w-12 flex-shrink-0">{log.time}</span>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: log.color }} />
                      <span className="text-sm text-[#2C1810]">{log.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8D5C4]">
                <h3 className="font-bold text-[#2C1810] mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-[#8B7355]">Table</span><span className="font-semibold text-[#2C1810]">{table?.table_number}</span></div>
                  <div className="flex justify-between"><span className="text-[#8B7355]">Subtotal</span><span className="font-semibold text-[#2C1810]">{formatCurrency(selectedOrder.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-[#8B7355]">Tax (18%)</span><span className="font-semibold text-[#2C1810]">{formatCurrency(selectedOrder.tax_amount)}</span></div>
                  <div className="border-t border-[#E8D5C4] pt-2 flex justify-between">
                    <span className="font-bold text-[#2C1810]">Total</span>
                    <span className="font-bold text-[#8B4513] text-lg">{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8D5C4]">
                <h3 className="font-bold text-[#2C1810] mb-3">Status</h3>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  selectedOrder.order_status === 'ready' ? 'bg-[#228B22] text-white' :
                  selectedOrder.order_status === 'preparing' ? 'bg-[#FF8C00] text-white' :
                  'bg-[#8B7355] text-white'}`}>
                  {selectedOrder.order_status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </StaffLayout>
    );
  }

  // ── MAIN VIEWS ──
  return (
    <StaffLayout
      role="waiter"
      userName={`${waiter?.first_name || 'Waiter'} ${waiter?.last_name || ''}`}
      userInitials={`${waiter?.first_name?.[0] || 'W'}${waiter?.last_name?.[0] || 'A'}`}
      activeTab={activePage}
      setActiveTab={(tab) => setActivePage(tab as WaiterPage)}
      navItems={navItems}
      onLogout={onLogout || (() => {})}
      pageTitle={activePage === 'dashboard' ? 'Waiter Dashboard' : activePage === 'tables' ? 'Tables Overview' : activePage === 'orders' ? 'Active Orders' : 'Notifications'}
      unreadCount={unreadNotifs}
    >
      <div className="p-6">
        {/* ── DASHBOARD ── */}
        {activePage === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {/* Welcome */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Welcome, {waiter?.first_name || 'Waiter'}
                </h1>
                <p className="text-[#8B7355] mt-1">Friday, May 1, 2026 · Morning Shift · 07:00–15:00</p>
              </div>
              <div className="flex items-center gap-2 bg-[#E8F5E9] border border-[#228B22]/20 rounded-xl px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-[#228B22] animate-pulse" />
                <span className="text-sm font-bold text-[#228B22]">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {stats.map(({ label, value, icon: Icon, color, bg }) => (
                <motion.div key={label} whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8D5C4]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <span className="text-sm font-semibold text-[#8B7355]">{label}</span>
                  </div>
                  <p className="text-3xl font-bold text-[#2C1810]">{value}</p>
                </motion.div>
              ))}
            </div>

            {/* Tables + Notifications side by side */}
            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-2">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D5C4]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-[#2C1810] text-lg">My Tables</h2>
                    <button onClick={() => setActivePage('tables')} className="text-sm text-[#D2691E] font-semibold hover:underline flex items-center gap-1">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {mockTables.slice(0, 8).map(table => {
                      const status = getTableStatus(table);
                      const sc = STATUS_CONFIG[status] || STATUS_CONFIG.available;
                      const order = assignedOrders.find(o => o.table_id === table.table_id && o.order_status !== 'completed');
                      return (
                        <motion.button key={table.table_id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedTable(table)}
                          className="rounded-xl p-3 text-center border-2 transition-colors relative"
                          style={{ borderColor: sc.dot + '40', background: sc.bg }}>
                          <p className="text-2xl font-bold mb-1" style={{ color: sc.text }}>{table.table_number}</p>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                            <span className="text-[10px] font-bold" style={{ color: sc.text }}>
                              {status === 'ready' ? 'Ready!' : sc.label.split(' ')[0]}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#8B7355]">{table.seating_capacity}p</p>
                          {order && <p className="text-[10px] text-[#C4A882]">#{order.order_id}</p>}
                          {status === 'ready' && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#4169E1] rounded-full flex items-center justify-center animate-pulse">
                              <Bell className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8D5C4]">
                  <h2 className="font-bold text-[#2C1810] mb-3">Recent Orders</h2>
                  <div className="space-y-3">
                    {assignedOrders.slice(0, 3).map(order => {
                      const table = getTableById(order.table_id);
                      return (
                        <button key={order.order_id} onClick={() => setSelectedOrder(order)}
                          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#FFF8F0] transition-colors text-left">
                          <div className="w-9 h-9 rounded-full bg-[#FFF0E0] flex items-center justify-center flex-shrink-0">
                            <Utensils className="w-4 h-4 text-[#D2691E]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#2C1810]">#{order.order_id} — Tbl {table?.table_number}</p>
                            <p className="text-xs text-[#8B7355]">{formatCurrency(order.total_amount)}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            order.order_status === 'ready' ? 'bg-[#228B22] text-white' :
                            order.order_status === 'preparing' ? 'bg-[#FF8C00] text-white' :
                            'bg-[#E8D5C4] text-[#8B7355]'}`}>{order.order_status}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8D5C4]">
                  <h2 className="font-bold text-[#2C1810] mb-3">Quick Actions</h2>
                  <div className="space-y-2">
                    <button onClick={() => setActivePage('notifications')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors text-left">
                      <Bell className="w-4 h-4 text-[#4169E1]" />
                      <span className="text-sm font-semibold text-[#2C1810]">Notifications</span>
                      {unreadNotifs > 0 && <span className="ml-auto px-1.5 py-0.5 bg-[#C62828] text-white text-xs rounded-full font-bold">{unreadNotifs}</span>}
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#FFF0E0] hover:bg-[#FFE4CC] transition-colors text-left">
                      <RefreshCw className="w-4 h-4 text-[#D2691E]" />
                      <span className="text-sm font-semibold text-[#2C1810]">Refresh Data</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TABLES ── */}
        {activePage === 'tables' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-[#2C1810]">All Tables</h1>
                <p className="text-sm text-[#8B7355]">{mockTables.filter(t => t.status !== 'blocked').length} active tables in the restaurant</p>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                {Object.entries(STATUS_CONFIG).slice(0, 4).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: val.dot }} />
                    <span className="text-[#8B7355]">{val.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {mockTables.map(table => {
                const status = getTableStatus(table);
                const sc = STATUS_CONFIG[status] || STATUS_CONFIG.available;
                const order = assignedOrders.find(o => o.table_id === table.table_id && o.order_status !== 'completed');
                return (
                  <motion.button key={table.table_id} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedTable(table)}
                    className="bg-white rounded-2xl p-5 shadow-sm border-2 text-center relative cursor-pointer transition-all"
                    style={{ borderColor: sc.dot + '30', opacity: table.status === 'blocked' ? 0.5 : 1 }}>
                    <div className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: sc.bg }}>
                      <span className="text-2xl font-bold" style={{ color: sc.text, fontFamily: 'Playfair Display, serif' }}>
                        {table.table_number}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: sc.dot }} />
                      <span className="text-xs font-bold" style={{ color: sc.text }}>{status === 'ready' ? 'Ready!' : sc.label}</span>
                    </div>
                    <p className="text-xs text-[#8B7355]">{table.seating_capacity} seats · {table.section}</p>
                    {order && <p className="text-xs text-[#D2691E] font-semibold mt-1">#{order.order_id}</p>}
                    {status === 'ready' && (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-[#4169E1] rounded-full flex items-center justify-center">
                        <Bell className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── ACTIVE ORDERS ── */}
        {activePage === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-[#2C1810]">Active Orders</h1>
              <span className="px-3 py-1 bg-[#FFF0E0] text-[#D2691E] rounded-full text-sm font-bold">
                {assignedOrders.filter(o => o.order_status !== 'completed').length} orders
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {assignedOrders.filter(o => o.order_status !== 'completed').map(order => {
                const table = getTableById(order.table_id);
                const items = mockOrderItems.filter(oi => oi.order_id === order.order_id);
                const readyCount = items.filter(oi => oi.item_status === 'ready').length;
                return (
                  <motion.div key={order.order_id} whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8D5C4] cursor-pointer"
                    onClick={() => setSelectedOrder(order)}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold text-[#2C1810]">Order #{order.order_id}</p>
                        <p className="text-sm text-[#8B7355]">Table {table?.table_number} · {items.length} items</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        order.order_status === 'ready' ? 'bg-[#228B22] text-white' :
                        order.order_status === 'preparing' ? 'bg-[#FF8C00] text-white' :
                        'bg-[#8B7355] text-white'}`}>{order.order_status}</span>
                    </div>
                    {readyCount > 0 && (
                      <div className="flex items-center gap-2 bg-[#4169E1]/10 rounded-lg px-3 py-2 mb-3">
                        <Bell className="w-3.5 h-3.5 text-[#4169E1]" />
                        <span className="text-xs font-bold text-[#4169E1]">{readyCount} item{readyCount > 1 ? 's' : ''} ready!</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#8B4513] text-lg">{formatCurrency(order.total_amount)}</span>
                      <ChevronRight className="w-5 h-5 text-[#C4A882]" />
                    </div>
                  </motion.div>
                );
              })}
              {assignedOrders.filter(o => o.order_status !== 'completed').length === 0 && (
                <div className="col-span-3 bg-white rounded-2xl p-12 text-center shadow-sm border border-[#E8D5C4]">
                  <Utensils className="w-16 h-16 text-[#E8D5C4] mx-auto mb-3" />
                  <p className="text-lg font-semibold text-[#8B7355]">No active orders</p>
                  <p className="text-sm text-[#C4A882] mt-1">All tables are currently quiet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {activePage === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-[#2C1810]">Notifications</h1>
              <button onClick={markAllRead} className="px-4 py-2 bg-[#FFF0E0] text-[#D2691E] text-sm font-semibold rounded-xl hover:bg-[#FFE4CC] transition-colors">
                Mark All Read
              </button>
            </div>

            <div className="flex gap-2 mb-5">
              {(['all', 'orders', 'ready', 'calls'] as const).map(f => (
                <button key={f} onClick={() => setNotifFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${notifFilter === f ? 'bg-[#8B4513] text-white shadow-sm' : 'bg-white text-[#8B7355] border border-[#E8D5C4] hover:border-[#8B4513]'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredNotifs.map(notif => (
                <motion.div key={notif.notification_id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className={`bg-white rounded-2xl p-5 shadow-sm border flex items-start gap-4 ${!notif.is_read ? 'border-l-4 border-l-[#D2691E] border-[#E8D5C4]' : 'border-[#E8D5C4]'}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'order_ready' ? 'bg-[#EEF2FF]' :
                    notif.type === 'new_order' ? 'bg-[#E8F5E9]' :
                    notif.type === 'call_waiter' ? 'bg-[#FFF3E0]' : 'bg-[#FFF8F0]'}`}>
                    {notif.type === 'order_ready' && <Bell className="w-5 h-5 text-[#4169E1]" />}
                    {notif.type === 'new_order' && <Utensils className="w-5 h-5 text-[#228B22]" />}
                    {notif.type === 'call_waiter' && <AlertCircle className="w-5 h-5 text-[#FF8C00]" />}
                    {notif.type === 'payment_request' && <CreditCard className="w-5 h-5 text-[#8B7355]" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-[#2C1810]">{notif.title}</p>
                      <button onClick={() => dismissNotif(notif.notification_id)} className="text-[#C4A882] hover:text-[#8B7355] flex-shrink-0 ml-2">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-[#8B7355] mt-0.5">{notif.message}</p>
                    {!notif.is_read && <span className="inline-block mt-1 w-2 h-2 rounded-full bg-[#D2691E]" />}
                  </div>
                </motion.div>
              ))}
              {filteredNotifs.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#E8D5C4]">
                  <Bell className="w-16 h-16 text-[#E8D5C4] mx-auto mb-3" />
                  <p className="text-lg font-semibold text-[#8B7355]">No notifications</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </StaffLayout>
  );
}
