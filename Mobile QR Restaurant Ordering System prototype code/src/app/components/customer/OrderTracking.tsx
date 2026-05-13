import { useState, useEffect } from 'react';
import {
  ArrowLeft, CheckCircle, Clock, ChefHat, BellRing,
  CreditCard, Phone, RotateCcw, Utensils, Coffee, Leaf,
} from 'lucide-react';
import { formatCurrency, Order, OrderItem, mockMenuItems } from '../../../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface OrderTrackingProps {
  order: Order;
  orderItems: OrderItem[];
  onBack: () => void;
  onViewBill: () => void;
  onCallWaiter: () => void;
}

const STATUS_STEPS = [
  { key: 'placed',     label: 'Order Placed',   desc: 'We received your order', icon: CheckCircle },
  { key: 'confirmed',  label: 'Confirmed',       desc: 'Kitchen confirmed order', icon: CheckCircle },
  { key: 'preparing',  label: 'Preparing',       desc: 'Your food is being made', icon: ChefHat },
  { key: 'ready',      label: 'Ready to Serve',  desc: 'Waiter is bringing it now', icon: BellRing },
];

const STATUS_ORDER = ['placed', 'confirmed', 'preparing', 'ready', 'completed'];

export function OrderTracking({ order, orderItems, onBack, onViewBill, onCallWaiter }: OrderTrackingProps) {
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!order.placed_at) return;
    const update = () => {
      const seconds = Math.floor((Date.now() - new Date(order.placed_at!).getTime()) / 1000);
      setElapsedTime(seconds);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [order.placed_at]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  const handleCallWaiter = () => {
    setWaiterCalled(true);
    onCallWaiter();
    setTimeout(() => setWaiterCalled(false), 5000);
  };

  const currentStatusIdx = STATUS_ORDER.indexOf(order.order_status);

  const estimatedTime =
    order.order_status === 'ready' ? 'Ready now!' :
    order.order_status === 'preparing' ? '8–15 min' :
    order.order_status === 'confirmed' ? '15–20 min' : '20–25 min';

  const allReady = orderItems.every(oi => oi.item_status === 'ready');

  const ITEM_STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
    pending:   { bg: '#FFF3E0', text: '#FF8C00', label: 'Pending' },
    preparing: { bg: '#EEF2FF', text: '#4169E1', label: 'Cooking' },
    ready:     { bg: '#E8F5E9', text: '#228B22', label: 'Ready' },
    served:    { bg: '#F5F5F5', text: '#8B7355', label: 'Served' },
  };

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes ripple { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.5); opacity: 0; } }
        .ripple { animation: ripple 1.5s ease-out infinite; }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8D5C4] shadow-sm">
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[#FFF8F0] border border-[#E8D5C4] flex items-center justify-center hover:border-[#8B4513] transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#8B4513]" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif', fontSize: 18 }}>
              Order Status
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4169E1]/10 border border-[#4169E1]/20">
            <div className="w-2 h-2 rounded-full bg-[#4169E1] animate-pulse" />
            <span className="text-xs font-bold text-[#4169E1]">Live</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 pb-8">

        {/* Hero: Order Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 mb-5 border border-[#E8D5C4] shadow-sm text-center relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 80% 20%, #8B4513 0%, transparent 60%)' }} />

          <div className="relative">
            {/* Order number + status icon */}
            <div className="flex items-center justify-center mb-3">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white font-black text-2xl"
                  style={{
                    background: order.order_status === 'ready'
                      ? 'linear-gradient(135deg, #228B22, #34A853)'
                      : 'linear-gradient(135deg, #8B4513, #D2691E)',
                    fontFamily: 'Playfair Display, serif',
                  }}
                >
                  #{order.order_id}
                </div>
                {order.order_status === 'preparing' && (
                  <div className="absolute inset-0 rounded-full border-2 border-[#D2691E]/30 ripple" />
                )}
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
              style={{
                background: order.order_status === 'ready' ? '#E8F5E9' : '#FFF0E0',
                border: `1px solid ${order.order_status === 'ready' ? '#228B22' : '#D2691E'}30`,
              }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: order.order_status === 'ready' ? '#228B22' : '#FF8C00' }} />
              <span className="text-xs font-bold capitalize" style={{ color: order.order_status === 'ready' ? '#228B22' : '#8B4513' }}>
                {order.order_status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center justify-center gap-6">
              <div>
                <p className="text-2xl font-black text-[#8B4513]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {estimatedTime}
                </p>
                <p className="text-xs text-[#8B7355] mt-0.5">Estimated wait</p>
              </div>
              <div className="w-px h-10 bg-[#E8D5C4]" />
              <div>
                <p className="text-2xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {formatTime(elapsedTime)}
                </p>
                <p className="text-xs text-[#8B7355] mt-0.5">Time elapsed</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 mb-5 border border-[#E8D5C4] shadow-sm"
        >
          <h3 className="font-bold text-[#2C1810] mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D2691E]" /> Order Progress
          </h3>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-[#E8D5C4]" />
            <div
              className="absolute left-[19px] top-5 w-0.5 transition-all duration-700"
              style={{
                background: 'linear-gradient(to bottom, #228B22, #D2691E)',
                height: `${Math.min(100, (currentStatusIdx / (STATUS_STEPS.length - 1)) * 100)}%`,
              }}
            />

            <div className="space-y-5">
              {STATUS_STEPS.map((step, idx) => {
                const reached = STATUS_ORDER.indexOf(order.order_status) >= STATUS_ORDER.indexOf(step.key);
                const isActive = STATUS_ORDER.indexOf(order.order_status) === STATUS_ORDER.indexOf(step.key);
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex items-start gap-4 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-500 ${
                      reached
                        ? 'text-white shadow-md'
                        : 'bg-[#F5EFE8] text-[#C4A882] border-2 border-[#E8D5C4]'
                    }`} style={reached ? { background: isActive ? 'linear-gradient(135deg, #FF8C00, #FFB84D)' : 'linear-gradient(135deg, #228B22, #34A853)' } : {}}>
                      {isActive ? (
                        <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className={`font-bold text-sm ${reached ? 'text-[#2C1810]' : 'text-[#C4A882]'}`}>
                        {step.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${reached ? 'text-[#8B7355]' : 'text-[#D4C4B0]'}`}>
                        {step.desc}
                      </p>
                    </div>
                    {reached && !isActive && (
                      <CheckCircle className="w-4 h-4 text-[#228B22] flex-shrink-0 mt-2.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 mb-5 border border-[#E8D5C4] shadow-sm"
        >
          <h3 className="font-bold text-[#2C1810] mb-4 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#D2691E]" /> Your Items ({orderItems.length})
          </h3>
          <div className="space-y-3">
            {orderItems.map(oi => {
              const mi = mockMenuItems.find(m => m.item_id === oi.menu_item_id);
              if (!mi) return null;
              const sc = ITEM_STATUS_COLORS[oi.item_status] || ITEM_STATUS_COLORS.pending;
              return (
                <div key={oi.order_item_id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAFAF8]">
                  <img src={mi.image_url} alt={mi.item_name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#2C1810] text-sm truncate">{mi.item_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#8B7355]">×{oi.quantity}</span>
                      {mi.destination_station === 'bar' ? (
                        <div className="flex items-center gap-0.5">
                          <Coffee className="w-2.5 h-2.5 text-sky-500" />
                          <span className="text-[9px] text-sky-500 font-bold">Bar</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5">
                          <ChefHat className="w-2.5 h-2.5 text-[#FF8C00]" />
                          <span className="text-[9px] text-[#FF8C00] font-bold">Kitchen</span>
                        </div>
                      )}
                      {mi.is_vegetarian && <Leaf className="w-2.5 h-2.5 text-[#228B22]" />}
                    </div>
                    {oi.special_notes && (
                      <p className="text-[10px] text-[#D2691E] mt-0.5 italic">Note: {oi.special_notes}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="font-bold text-[#8B4513] text-xs">{formatCurrency(oi.unit_price * oi.quantity)}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>
                      {sc.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#E8D5C4] mt-4 pt-3 flex items-center justify-between">
            <span className="font-bold text-[#2C1810]">Total</span>
            <span className="font-black text-[#8B4513] text-lg">{formatCurrency(order.total_amount)}</span>
          </div>
        </motion.div>

        {/* Special instructions */}
        {order.special_instructions && (
          <div className="bg-[#FFF8E1] border border-[#FFD966] rounded-2xl px-4 py-3 mb-5 flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-[#E07B00]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px] font-black text-[#E07B00]">!</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#856404]">Special Instructions</p>
              <p className="text-xs text-[#856404] mt-0.5">{order.special_instructions}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Call Waiter */}
          <AnimatePresence mode="wait">
            {waiterCalled ? (
              <motion.div
                key="called"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full py-4 rounded-2xl bg-[#228B22]/10 border-2 border-[#228B22] flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5 text-[#228B22]" />
                <span className="font-bold text-[#228B22]">Waiter Notified!</span>
              </motion.div>
            ) : (
              <motion.button
                key="call"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleCallWaiter}
                className="w-full py-4 rounded-2xl bg-white border-2 border-[#E8D5C4] flex items-center justify-center gap-2 font-bold text-[#2C1810] text-sm hover:border-[#8B4513] transition-all active:scale-98"
              >
                <Phone className="w-5 h-5 text-[#8B4513]" />
                Call Waiter
              </motion.button>
            )}
          </AnimatePresence>

          {/* View Bill */}
          <button
            onClick={onViewBill}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-98"
            style={{ background: 'linear-gradient(135deg, #8B4513, #D2691E)', boxShadow: '0 6px 20px rgba(139,69,19,0.3)' }}
          >
            <CreditCard className="w-5 h-5" />
            View Bill & Pay
          </button>

          <button
            onClick={onBack}
            className="w-full py-3 rounded-2xl text-sm font-semibold text-[#8B4513] flex items-center justify-center gap-1.5 hover:bg-[#F5EFE8] transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
