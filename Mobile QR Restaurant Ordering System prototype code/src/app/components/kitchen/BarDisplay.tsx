import { useState, useEffect } from 'react';
import {
  Coffee, Clock, CheckCircle, AlertTriangle, X, Zap,
  BarChart2, RefreshCw, Volume2, VolumeX,
  Bell, Timer, TrendingUp, Check,
  LayoutDashboard, ClipboardList, RotateCcw,
  Info, Archive, ArrowRight, Droplets,
} from 'lucide-react';
import {
  mockOrderItems, mockOrders, getMenuItemById, getTableById,
  mockMenuItems, OrderItem,
} from '../../../data/mockData';
import { StaffLayout } from '../layouts/StaffLayout';
import { motion, AnimatePresence } from 'motion/react';

type BarPage = 'kds' | 'history' | 'stats' | 'alerts';

interface BarDisplayProps {
  onLogout: () => void;
}

interface CompletedDrinkOrder {
  orderId: number;
  table: string;
  items: string;
  completedAt: string;
  itemCount: number;
}


function getElapsedSeconds(placedAt: string | null): number {
  if (!placedAt) return 0;
  return Math.floor((Date.now() - new Date(placedAt).getTime()) / 1000);
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

function isUrgent(placedAt: string | null): boolean {
  if (!placedAt) return false;
  return (Date.now() - new Date(placedAt).getTime()) > 12 * 60 * 1000;
}

const ALLERGEN_COLORS: Record<string, { bg: string; text: string }> = {
  'Nuts': { bg: '#FFF3CD', text: '#856404' },
  'Dairy': { bg: '#E8F4FD', text: '#0C63E4' },
  'Gluten': { bg: '#FDE2E4', text: '#B02A37' },
  'Eggs': { bg: '#FFF8E1', text: '#B8860B' },
  'Soy': { bg: '#E8F5E9', text: '#2E7D32' },
};

export function BarDisplay({ onLogout }: BarDisplayProps) {
  const [activePage, setActivePage] = useState<BarPage>('kds');
  const [itemStatuses, setItemStatuses] = useState<Record<number, string>>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [show86Modal, setShow86Modal] = useState(false);
  const [selected86Item, setSelected86Item] = useState<number | null>(null);
  const [unavailableItems, setUnavailableItems] = useState<Set<number>>(new Set());
  const [sound, setSound] = useState(true);
  const [completedToday, setCompletedToday] = useState(34);
  const [drinksPreparedToday, setDrinksPreparedToday] = useState(56);
  const [avgTime] = useState(5);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [completedOrders, setCompletedOrders] = useState<CompletedDrinkOrder[]>([
    { orderId: 51, table: 'T1', items: 'Espresso x2, Cappuccino', completedAt: '08:18 AM', itemCount: 3 },
    { orderId: 50, table: 'T3', items: 'Mango Smoothie x2', completedAt: '08:05 AM', itemCount: 2 },
    { orderId: 49, table: 'T6', items: 'Caramel Latte x2, Orange Juice', completedAt: '07:50 AM', itemCount: 3 },
    { orderId: 48, table: 'T2', items: 'Cappuccino x3', completedAt: '07:35 AM', itemCount: 3 },
    { orderId: 47, table: 'T7', items: 'Fresh Orange Juice x2', completedAt: '07:20 AM', itemCount: 2 },
    { orderId: 46, table: 'T4', items: 'Espresso, Caramel Latte', completedAt: '07:05 AM', itemCount: 2 },
  ]);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'new', title: 'New Order #57', message: 'Table T5 — 2 drinks pending', time: '2 min ago', read: false },
    { id: 2, type: 'urgent', title: 'Order #56 Waiting', message: 'Table T4 — Serving for 10 minutes!', time: '4 min ago', read: false },
    { id: 3, type: 'served', title: 'Order #53 Served', message: 'Table T3 — Waiter marked as served', time: '15 min ago', read: true },
    { id: 4, type: 'info', title: 'Low Stock Alert', message: 'Passion fruit running low — notify manager', time: '25 min ago', read: true },
  ]);


  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // BAR ONLY items
  const barItems = mockOrderItems.filter(i => i.destination_station === 'bar');
  const getStatus = (item: OrderItem) => itemStatuses[item.order_item_id] || item.item_status;

  const newItems = barItems.filter(i => getStatus(i) === 'pending');
  const preparingItems = barItems.filter(i => getStatus(i) === 'preparing');
  const readyItems = barItems.filter(i => getStatus(i) === 'ready');

  const unreadAlerts = alerts.filter(a => !a.read).length;

  const updateStatus = (itemId: number, newStatus: string) => {
    setItemStatuses(prev => ({ ...prev, [itemId]: newStatus }));
    if (newStatus === 'ready') {
      setCompletedToday(c => c + 1);
      setDrinksPreparedToday(c => c + 1);
      showToast('Drinks ready — notifying waiter!', 'success');
    } else if (newStatus === 'preparing') {
      showToast('Started preparing drinks', 'info');
    }
  };

  const startAllForOrder = (items: OrderItem[]) => {
    items.forEach(i => updateStatus(i.order_item_id, 'preparing'));
    showToast(`Started ${items.length} drink${items.length > 1 ? 's' : ''} for order`, 'info');
  };

  const markAllReadyForOrder = (items: OrderItem[]) => {
    items.forEach(i => updateStatus(i.order_item_id, 'ready'));
    showToast('All drinks ready — waiter notified!', 'success');
  };

  const mark86 = () => {
    if (selected86Item !== null) {
      setUnavailableItems(prev => new Set([...prev, selected86Item]));
      setShow86Modal(false);
      setSelected86Item(null);
      showToast('Item marked 86 — menu updated, manager notified', 'warning');
    }
  };

  const groupByOrder = (items: OrderItem[]) => {
    const groups: Record<number, OrderItem[]> = {};
    items.forEach(item => {
      if (!groups[item.order_id]) groups[item.order_id] = [];
      groups[item.order_id].push(item);
    });
    return groups;
  };

  const markAlertRead = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const navItems = [
    { id: 'kds', label: 'Bar Display', icon: LayoutDashboard },
    { id: 'history', label: 'Drink History', icon: Archive },
    { id: 'stats', label: 'Statistics', icon: BarChart2 },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadAlerts },
  ];

  // ── ORDER TICKET COMPONENT ──
  const DrinkTicket = ({ orderId, items, colType }: { orderId: number; items: OrderItem[]; colType: 'pending' | 'preparing' | 'ready' }) => {
    const order = mockOrders.find(o => o.order_id === orderId);
    const table = order ? getTableById(order.table_id) : null;
    const elapsedSec = getElapsedSeconds(order?.placed_at || null);
    const urgent = isUrgent(order?.placed_at || null);

    const borderColor = urgent && colType !== 'ready' ? '#9C27B0' : colType === 'pending' ? '#0288D1' : colType === 'preparing' ? '#7B1FA2' : '#00897B';
    const headerBg = urgent && colType !== 'ready' ? '#9C27B0' : colType === 'pending' ? '#0288D1' : colType === 'preparing' ? '#7B1FA2' : '#00897B';
    const cardBg = urgent && colType !== 'ready' ? '#F3E5F5' : colType === 'pending' ? '#E1F5FE' : colType === 'preparing' ? '#F3E5F5' : '#E0F2F1';

    const allAllergens = [...new Set(
      items.flatMap(item => {
        const mi = getMenuItemById(item.menu_item_id);
        return mi?.contains_allergens !== 'None' ? (mi?.contains_allergens || '').split(', ').filter(Boolean) : [];
      })
    )];

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: -8 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border-2 overflow-hidden shadow-sm"
        style={{ borderColor, background: cardBg }}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: headerBg }}>
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm">Order #{orderId}</span>
            {urgent && colType !== 'ready' && (
              <span className="flex items-center gap-1 bg-white/25 rounded-full px-2 py-0.5 text-[10px] font-bold text-white">
                <Zap className="w-3 h-3" /> RUSH
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 rounded-full px-2.5 py-1">
            <Timer className="w-3 h-3 text-white" />
            <span className="text-xs font-bold text-white">{formatElapsed(elapsedSec)}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Table */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/5">
            <div className="w-7 h-7 rounded-lg bg-[#0288D1]/10 flex items-center justify-center flex-shrink-0">
              <Coffee className="w-3.5 h-3.5 text-[#0288D1]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#8B7355] uppercase tracking-wide">
                Table {table?.table_number || '—'} · {table?.section || 'N/A'}
              </p>
              <p className="text-[10px] text-[#C4A882]">{items.length} drink{items.length > 1 ? 's' : ''} for this station</p>
            </div>
          </div>

          {/* Drink Items */}
          <div className="space-y-2 mb-3">
            {items.map(item => {
              const mi = getMenuItemById(item.menu_item_id);
              const is86 = unavailableItems.has(item.menu_item_id);
              return (
                <div key={item.order_item_id}
                  className={`rounded-xl p-2.5 ${is86 ? 'opacity-50 bg-gray-100' : 'bg-white/70'}`}>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: headerBg }}>
                      {item.quantity}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm text-[#2C1810] ${is86 ? 'line-through' : ''}`}>
                        {mi?.item_name}
                        {is86 && <span className="ml-1 text-[10px] text-[#C62828] font-black">[86]</span>}
                      </p>
                      {item.special_notes && (
                        <p className="text-[10px] text-[#7B1FA2] mt-0.5 flex items-center gap-1">
                          <Info className="w-3 h-3" /> {item.special_notes}
                        </p>
                      )}
                    </div>
                    {!is86 && (
                      <button
                        onClick={e => { e.stopPropagation(); setSelected86Item(item.menu_item_id); setShow86Modal(true); }}
                        className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-black text-[#C62828] bg-[#C62828]/10 hover:bg-[#C62828]/20 transition-colors border border-[#C62828]/20"
                        title="Mark 86 (unavailable)">
                        86
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Allergen warnings */}
          {allAllergens.length > 0 && (
            <div className="bg-[#FFF3CD] border border-[#FFD966] rounded-xl px-3 py-2 mb-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#856404]" />
                <span className="text-[10px] font-bold text-[#856404] uppercase tracking-wide">Allergen Warning</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {allAllergens.map(a => {
                  const c = ALLERGEN_COLORS[a] || { bg: '#F5F5F5', text: '#666' };
                  return (
                    <span key={a} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>
                      {a}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special instructions */}
          {order?.special_instructions && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 mb-3 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-700 font-medium">{order.special_instructions}</p>
            </div>
          )}

          {/* Action Buttons */}
          {colType === 'pending' && (
            <button
              onClick={() => startAllForOrder(items)}
              className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #0288D1, #29B6F6)' }}
            >
              <Droplets className="w-4 h-4" /> Start Making Drinks
            </button>
          )}

          {colType === 'preparing' && (
            <div className="flex gap-2">
              <button
                onClick={() => items.forEach(i => updateStatus(i.order_item_id, 'pending'))}
                className="py-2.5 px-3 rounded-xl border-2 border-[#E8D5C4] text-[#8B7355] hover:bg-[#F5F0EA] transition-colors flex items-center justify-center"
                title="Move back to New">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => markAllReadyForOrder(items)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #00897B, #26A69A)' }}
              >
                <Check className="w-4 h-4" /> Drinks Ready
              </button>
            </div>
          )}

          {colType === 'ready' && (
            <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl border"
              style={{ background: '#00897B15', borderColor: '#00897B33' }}>
              <CheckCircle className="w-4 h-4" style={{ color: '#00897B' }} />
              <span className="text-sm font-bold" style={{ color: '#00897B' }}>Awaiting Pickup</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <StaffLayout
      role="bar_staff"
      userName="Bar Team"
      userInitials="BT"
      activeTab={activePage}
      setActiveTab={(tab) => setActivePage(tab as BarPage)}
      navItems={navItems}
      onLogout={onLogout}
      pageTitle={
        activePage === 'kds' ? 'Bar Display System' :
        activePage === 'history' ? 'Drink History' :
        activePage === 'stats' ? 'Bar Statistics' : 'Bar Alerts'
      }
      unreadCount={unreadAlerts}
    >

      <div className="p-6">

        {/* ── KDS ── */}
        {activePage === 'kds' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Controls */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                {/* Station badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #0288D1, #29B6F6)' }}>
                  <Coffee className="w-4 h-4" />
                  Bar Station
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: '#0288D1' }}>
                    {Object.keys(groupByOrder(newItems)).length} New
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: '#7B1FA2' }}>
                    {Object.keys(groupByOrder(preparingItems)).length} Preparing
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: '#00897B' }}>
                    {Object.keys(groupByOrder(readyItems)).length} Ready
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-[#E8D5C4] rounded-xl px-4 py-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00897B' }} />
                  <span className="text-sm font-bold text-[#2C1810]">
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <button onClick={() => setSound(!sound)}
                  className="w-10 h-10 rounded-xl bg-white border border-[#E8D5C4] flex items-center justify-center hover:border-[#0288D1] transition-colors">
                  {sound ? <Volume2 className="w-4 h-4 text-[#8B7355]" /> : <VolumeX className="w-4 h-4 text-[#C4A882]" />}
                </button>
                <button
                  className="w-10 h-10 rounded-xl bg-white border border-[#E8D5C4] flex items-center justify-center hover:border-[#0288D1] transition-colors"
                  onClick={() => showToast('Display refreshed', 'info')}>
                  <RefreshCw className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>
            </div>

            {/* 3-Column Kanban */}
            <div className="grid grid-cols-3 gap-5">
              {/* NEW */}
              <div>
                <div className="flex items-center gap-2 mb-4 rounded-xl px-3 py-2" style={{ background: '#E1F5FE', border: '1px solid #B3E5FC' }}>
                  <Zap className="w-4 h-4" style={{ color: '#0288D1' }} />
                  <span className="font-black text-sm uppercase tracking-wide flex-1" style={{ color: '#0288D1' }}>New Orders</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#0288D1' }}>
                    {Object.keys(groupByOrder(newItems)).length}
                  </span>
                </div>
                <div className="space-y-4">
                  <AnimatePresence>
                    {Object.entries(groupByOrder(newItems)).map(([orderId, items]) => (
                      <DrinkTicket key={orderId} orderId={parseInt(orderId)} items={items} colType="pending" />
                    ))}
                  </AnimatePresence>
                  {newItems.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-[#E8D5C4]">
                      <CheckCircle className="w-10 h-10 text-[#E8D5C4] mx-auto mb-2" />
                      <p className="text-sm font-semibold text-[#C4A882]">No new drink orders</p>
                      <p className="text-xs text-[#C4A882] mt-1">All caught up at the bar!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* PREPARING */}
              <div>
                <div className="flex items-center gap-2 mb-4 rounded-xl px-3 py-2" style={{ background: '#F3E5F5', border: '1px solid #E1BEE7' }}>
                  <Droplets className="w-4 h-4" style={{ color: '#7B1FA2' }} />
                  <span className="font-black text-sm uppercase tracking-wide flex-1" style={{ color: '#7B1FA2' }}>In Progress</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#7B1FA2' }}>
                    {Object.keys(groupByOrder(preparingItems)).length}
                  </span>
                </div>
                <div className="space-y-4">
                  <AnimatePresence>
                    {Object.entries(groupByOrder(preparingItems)).map(([orderId, items]) => (
                      <DrinkTicket key={orderId} orderId={parseInt(orderId)} items={items} colType="preparing" />
                    ))}
                  </AnimatePresence>
                  {preparingItems.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-[#E8D5C4]">
                      <Coffee className="w-10 h-10 text-[#E8D5C4] mx-auto mb-2" />
                      <p className="text-sm font-semibold text-[#C4A882]">Nothing being made</p>
                      <p className="text-xs text-[#C4A882] mt-1">Start an order from New</p>
                    </div>
                  )}
                </div>
              </div>

              {/* READY */}
              <div>
                <div className="flex items-center gap-2 mb-4 rounded-xl px-3 py-2" style={{ background: '#E0F2F1', border: '1px solid #B2DFDB' }}>
                  <CheckCircle className="w-4 h-4" style={{ color: '#00897B' }} />
                  <span className="font-black text-sm uppercase tracking-wide flex-1" style={{ color: '#00897B' }}>Ready</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#00897B' }}>
                    {Object.keys(groupByOrder(readyItems)).length}
                  </span>
                </div>
                <div className="space-y-4">
                  <AnimatePresence>
                    {Object.entries(groupByOrder(readyItems)).map(([orderId, items]) => (
                      <DrinkTicket key={orderId} orderId={parseInt(orderId)} items={items} colType="ready" />
                    ))}
                  </AnimatePresence>
                  {readyItems.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-[#E8D5C4]">
                      <CheckCircle className="w-10 h-10 text-[#E8D5C4] mx-auto mb-2" />
                      <p className="text-sm font-semibold text-[#C4A882]">None ready yet</p>
                      <p className="text-xs text-[#C4A882] mt-1">Mark drinks complete</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Stats Bar */}
            <div className="mt-6 bg-white rounded-2xl border border-[#E8D5C4] p-4">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Received Today', value: completedToday + newItems.length + preparingItems.length, icon: ClipboardList, color: '#0288D1' },
                  { label: 'Drinks Served', value: drinksPreparedToday, icon: Check, color: '#00897B' },
                  { label: 'Currently Pending', value: newItems.length + preparingItems.length, icon: Clock, color: '#7B1FA2' },
                  { label: 'Avg Make Time', value: `${avgTime}m`, icon: Timer, color: '#8B4513' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '15' }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <p className="text-xl font-black text-[#2C1810]">{value}</p>
                      <p className="text-xs text-[#8B7355]">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── HISTORY ── */}
        {activePage === 'history' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#2C1810]">Completed Drink Orders — Bar</h2>
                <p className="text-sm text-[#8B7355]">Today, May 1, 2026 · {completedOrders.length + completedToday} total</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border" style={{ background: '#E0F2F1', borderColor: '#B2DFDB' }}>
                <CheckCircle className="w-4 h-4" style={{ color: '#00897B' }} />
                <span className="text-sm font-bold" style={{ color: '#00897B' }}>{completedToday} completed today</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Orders Completed', value: completedToday, color: '#00897B', bg: '#E0F2F1' },
                { label: 'Drinks Prepared', value: drinksPreparedToday, color: '#0288D1', bg: '#E1F5FE' },
                { label: 'Avg Make Time', value: `${avgTime} min`, color: '#7B1FA2', bg: '#F3E5F5' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-[#E8D5C4] text-center">
                  <p className="text-3xl font-black mb-1" style={{ color }}>{value}</p>
                  <p className="text-sm text-[#8B7355]">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#E8D5C4] overflow-hidden">
              <div className="px-5 py-3 border-b border-[#E8D5C4] bg-[#FFF8F0] grid grid-cols-5 gap-4">
                <span className="text-xs font-bold text-[#8B7355] uppercase tracking-wide">Order #</span>
                <span className="text-xs font-bold text-[#8B7355] uppercase tracking-wide">Table</span>
                <span className="text-xs font-bold text-[#8B7355] uppercase tracking-wide col-span-2">Drinks</span>
                <span className="text-xs font-bold text-[#8B7355] uppercase tracking-wide">Completed</span>
              </div>
              {completedOrders.map((order, idx) => (
                <div key={order.orderId}
                  className={`px-5 py-4 grid grid-cols-5 gap-4 items-center ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]'} hover:bg-[#FFF8F0] transition-colors`}>
                  <span className="font-bold text-[#2C1810] text-sm">#{order.orderId}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#E1F5FE' }}>
                      <Coffee className="w-3.5 h-3.5" style={{ color: '#0288D1' }} />
                    </div>
                    <span className="font-semibold text-[#2C1810] text-sm">{order.table}</span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-[#2C1810] truncate">{order.items}</p>
                    <p className="text-xs text-[#8B7355] mt-0.5">{order.itemCount} drinks</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: '#00897B' }} />
                    <span className="text-sm font-semibold" style={{ color: '#00897B' }}>{order.completedAt}</span>
                  </div>
                </div>
              ))}
              <div className="px-5 py-3 bg-[#FFF8F0] border-t border-[#E8D5C4] flex items-center justify-between">
                <span className="text-sm font-bold text-[#8B7355]">Total Today: {completedToday} orders · {drinksPreparedToday} drinks served</span>
                <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#0288D1' }}>
                  <TrendingUp className="w-4 h-4" /> Excellent bar service!
                </div>
              </div>
            </div>

            {/* Popular drinks */}
            <div className="mt-5 bg-white rounded-2xl border border-[#E8D5C4] p-5">
              <h3 className="font-bold text-[#2C1810] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: '#0288D1' }} /> Most Served Drinks Today
              </h3>
              <div className="space-y-3">
                {mockMenuItems.filter(m => m.destination_station === 'bar').map((item, idx) => {
                  const counts = [22, 18, 12, 10, 8];
                  const count = counts[idx] || 5;
                  const maxCount = 22;
                  const pct = (count / maxCount) * 100;
                  return (
                    <div key={item.item_id} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#8B7355] w-4 flex-shrink-0">{idx + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-[#2C1810]">{item.item_name}</span>
                          <span className="text-xs font-bold" style={{ color: '#0288D1' }}>{count} served</span>
                        </div>
                        <div className="h-2 bg-[#E1F5FE] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: idx * 0.1, duration: 0.7 }}
                            className="h-full rounded-full"
                            style={{ background: idx === 0 ? '#0288D1' : '#29B6F6' }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STATS ── */}
        {activePage === 'stats' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-lg font-bold text-[#2C1810] mb-6">Bar Performance — Today</h2>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Completed Today', value: completedToday, icon: CheckCircle, color: '#00897B', bg: '#E0F2F1' },
                { label: 'Being Made Now', value: preparingItems.length, icon: Droplets, color: '#0288D1', bg: '#E1F5FE' },
                { label: 'Avg Make Time', value: `${avgTime}m`, icon: Timer, color: '#7B1FA2', bg: '#F3E5F5' },
                { label: 'Items 86\'d', value: unavailableItems.size, icon: X, color: '#C62828', bg: '#FFEBEE' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <motion.div key={label} whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D5C4]">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <p className="text-3xl font-black text-[#2C1810]">{value}</p>
                  <p className="text-sm text-[#8B7355] mt-1">{label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl p-6 border border-[#E8D5C4]">
                <h3 className="font-bold text-[#2C1810] mb-4 flex items-center gap-2">
                  <Timer className="w-5 h-5 text-[#0288D1]" /> Make Time by Drink
                </h3>
                <div className="space-y-4">
                  {mockMenuItems.filter(m => m.destination_station === 'bar').map((item, idx) => {
                    const times = [3, 5, 4, 2, 3, 6];
                    const t = times[idx] || 4;
                    const maxTime = 6;
                    const pct = (t / maxTime) * 100;
                    return (
                      <div key={item.item_id}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-[#2C1810] truncate pr-2">{item.item_name}</span>
                          <span className="text-[#8B7355] flex-shrink-0">{t}m avg</span>
                        </div>
                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#E1F5FE' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.3 + idx * 0.1, duration: 0.7 }}
                            className="h-full rounded-full"
                            style={{ background: '#0288D1' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E8D5C4]">
                <h3 className="font-bold text-[#2C1810] mb-4 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-[#0288D1]" /> Drink Volume by Hour
                </h3>
                <div className="space-y-2.5">
                  {[
                    { hour: '07:00', count: 4, pct: 18 },
                    { hour: '08:00', count: 10, pct: 45 },
                    { hour: '09:00', count: 22, pct: 100 },
                    { hour: '10:00', count: 15, pct: 68 },
                    { hour: '11:00', count: 12, pct: 55 },
                    { hour: '12:00', count: 18, pct: 82 },
                  ].map(({ hour, count, pct }) => (
                    <div key={hour} className="flex items-center gap-3">
                      <span className="text-xs text-[#8B7355] w-12 flex-shrink-0 font-medium">{hour}</span>
                      <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: '#E1F5FE' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          className="h-full rounded-full flex items-center px-2"
                          style={{ background: pct > 80 ? '#0288D1' : '#29B6F6' }}
                        >
                          <span className="text-[10px] text-white font-bold">{count}</span>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#8B7355] mt-3 flex items-center gap-1">
                  <Coffee className="w-3 h-3 text-[#0288D1]" /> Busiest hour: 09:00 — 10:00 (22 drinks)
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── ALERTS ── */}
        {activePage === 'alerts' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#2C1810]">Bar Alerts</h2>
                <p className="text-sm text-[#8B7355]">{unreadAlerts} unread notification{unreadAlerts !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => setAlerts(prev => prev.map(a => ({ ...a, read: true })))}
                className="px-4 py-2 text-sm font-semibold text-[#0288D1] border border-[#E8D5C4] rounded-xl hover:bg-[#E1F5FE] transition-colors">
                Mark all read
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {alerts.map(alert => {
                const colors = {
                  new: { border: '#0288D1', bg: '#E1F5FE', icon: Bell, iconColor: '#0288D1' },
                  urgent: { border: '#9C27B0', bg: '#F3E5F5', icon: AlertTriangle, iconColor: '#9C27B0' },
                  served: { border: '#00897B', bg: '#E0F2F1', icon: CheckCircle, iconColor: '#00897B' },
                  info: { border: '#D97706', bg: '#FFF8E1', icon: Info, iconColor: '#D97706' },
                };
                const c = colors[alert.type as keyof typeof colors] || colors.new;
                const IconComp = c.icon;
                return (
                  <div key={alert.id}
                    className={`rounded-2xl border-l-4 p-4 flex items-start gap-3 transition-all ${alert.read ? 'opacity-60' : ''}`}
                    style={{ background: c.bg, borderLeftColor: c.border }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.border + '20' }}>
                      <IconComp className="w-4 h-4" style={{ color: c.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-[#2C1810] text-sm">{alert.title}</p>
                        {!alert.read && <span className="w-2 h-2 rounded-full bg-[#C62828] flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-[#8B7355]">{alert.message}</p>
                      <p className="text-xs text-[#C4A882] mt-1">{alert.time}</p>
                    </div>
                    {!alert.read && (
                      <button onClick={() => markAlertRead(alert.id)}
                        className="text-xs font-semibold text-[#0288D1] hover:underline flex-shrink-0">
                        Mark read
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {newItems.length > 0 && (
              <div className="rounded-2xl border-l-4 p-4 flex items-start gap-3" style={{ background: '#E1F5FE', borderLeftColor: '#0288D1' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#0288D115' }}>
                  <Zap className="w-4 h-4" style={{ color: '#0288D1' }} />
                </div>
                <div>
                  <p className="font-bold text-[#2C1810] text-sm">{newItems.length} drink{newItems.length > 1 ? 's' : ''} waiting to be made</p>
                  <p className="text-sm text-[#8B7355] mt-0.5">Go to Bar Display and click "Start Making Drinks" on pending orders</p>
                  <button
                    onClick={() => setActivePage('kds')}
                    className="mt-2 flex items-center gap-1 text-xs font-bold hover:underline" style={{ color: '#0288D1' }}>
                    Go to Bar Display <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {unavailableItems.size > 0 && (
              <div className="mt-3 rounded-2xl border-l-4 p-4 flex items-start gap-3 bg-[#FFEBEE]" style={{ borderLeftColor: '#C62828' }}>
                <div className="w-9 h-9 rounded-xl bg-[#C62828]/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-[#C62828]" />
                </div>
                <div>
                  <p className="font-bold text-[#2C1810] text-sm">{unavailableItems.size} item{unavailableItems.size > 1 ? 's' : ''} marked 86 (unavailable)</p>
                  <p className="text-sm text-[#8B7355] mt-0.5">These items are hidden from the customer menu. Manager has been notified.</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* 86 Confirm Modal */}
      <AnimatePresence>
        {show86Modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#C62828]/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#C62828]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2C1810]">Mark Drink as 86</h3>
                  <p className="text-xs text-[#8B7355]">This will remove it from the customer menu</p>
                </div>
                <button onClick={() => setShow86Modal(false)} className="ml-auto text-[#8B7355] hover:text-[#2C1810]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-[#FFF8F0] border border-[#E8D5C4] rounded-xl p-3 mb-5">
                <p className="text-sm text-[#8B7355]">
                  Marking this drink as <strong className="text-[#C62828]">86</strong> means it is out of stock or unavailable.
                  The manager and customers will be notified automatically.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShow86Modal(false)}
                  className="flex-1 border-2 border-[#E8D5C4] text-[#8B7355] py-2.5 rounded-xl font-semibold hover:border-[#8B7355] transition-colors text-sm">
                  Cancel
                </button>
                <button onClick={mark86}
                  className="flex-1 bg-[#C62828] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#A81E1E] transition-colors">
                  Confirm 86
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </StaffLayout>
  );
}
