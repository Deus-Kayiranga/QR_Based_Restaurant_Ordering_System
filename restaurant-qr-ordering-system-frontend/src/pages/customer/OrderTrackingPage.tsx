import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, Timer, Utensils, ChefHat,
  Plus, Receipt, X, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useOrder } from '../../hooks/useOrders';
import { ordersApi } from '../../api/orders';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/classNames';

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const orderIdNum = orderId ? parseInt(orderId, 10) : 0;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  // Use the existing hook which polls every 10s
  const { data: order, isLoading } = useOrder(orderIdNum);

  useEffect(() => {
    if (orderId) localStorage.setItem('lastOrderId', orderId);
  }, [orderId]);

  // Live timer counting up from when order was placed
  useEffect(() => {
    const placedAt = (order as any)?.placedAt;
    if (!placedAt) return;
    const placed = new Date(placedAt).getTime();
    const update = () => setElapsedSeconds(Math.max(0, Math.floor((Date.now() - placed) / 1000)));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [(order as any)?.placedAt]);

  const formatElapsed = (s: number) => {
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const sec = s % 60;
    if (m < 60) return `${m}m ${sec}s`;
    return `${Math.floor(m / 60)}h ${m % 60}m`;
  };

  const handleCancel = async () => {
    setCancelling(true);
    setCancelError('');
    try {
      await ordersApi.cancelOrder(orderIdNum);
      queryClient.invalidateQueries({ queryKey: ['order', orderIdNum] });
      navigate('../menu');
    } catch (err: any) {
      setCancelError(err?.response?.data?.message || 'Cannot cancel. Please ask a waiter.');
      setCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#111111]">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <Utensils size={20} className="absolute inset-0 m-auto text-primary animate-pulse" />
        </div>
        <p className="font-bold text-white uppercase tracking-widest text-sm animate-pulse">Tracking your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#111111] p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display' }}>Order not found</h2>
        <p className="text-white/50 mb-8">We couldn't locate your order.</p>
        <button onClick={() => navigate('../menu')} className="bg-primary text-white py-3 px-8 rounded-full font-bold">Return to Menu</button>
      </div>
    );
  }

  const orderData = order as any;
  const statuses = [
    { key: 'PLACED',    label: 'Order Received',  sub: 'Your order is confirmed!',         icon: Clock,    color: 'bg-primary border-primary shadow-[0_0_15px_rgba(210,105,30,0.5)]' },
    { key: 'PREPARING', label: 'Preparing',        sub: 'Chefs are working their magic...', icon: ChefHat,  color: 'bg-warning border-warning shadow-[0_0_15px_rgba(234,179,8,0.5)]' },
    { key: 'READY',     label: 'Ready to Serve',   sub: 'Hot & ready — waiter coming!',    icon: Timer,    color: 'bg-success border-success shadow-[0_0_15px_rgba(34,197,94,0.5)]' },
    { key: 'COMPLETED', label: 'Served',            sub: 'Enjoy your meal! 🍽️',            icon: Utensils, color: 'bg-white border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' },
  ];

  const currentIdx = statuses.findIndex(s => s.key === orderData.orderStatus);
  const canCancel  = orderData.orderStatus === 'PLACED';
  const isServed   = orderData.orderStatus === 'COMPLETED' || currentIdx >= 3;

  return (
    <div className="flex flex-col min-h-screen bg-[#111111] text-white pb-36">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-xl px-4 py-4 border-b border-white/10 flex items-center gap-4 sticky top-0 z-30 shadow-2xl">
        <button onClick={() => navigate('../menu')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display' }}>
            Order #{orderData.orderId?.toString().padStart(3, '0')}
          </h1>
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-0.5">Live Tracking</p>
        </div>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['order', orderIdNum] })}
          className="p-2 hover:bg-white/10 rounded-full transition-colors mr-1"
          title="Refresh"
        >
          <RefreshCw size={17} className="text-white/50" />
        </button>
        <div className="bg-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-black border border-primary/30">
          Table {orderData.tableNumber}
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Live Timer Card */}
        <div className="bg-gradient-to-br from-primary to-orange-700 rounded-[2rem] p-6 text-white shadow-[0_10px_30px_rgba(210,105,30,0.3)] relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">
                {isServed ? '✅ Order Complete' : 'Time Since Order'}
              </p>
              <div className="text-4xl font-black tabular-nums">{formatElapsed(elapsedSeconds)}</div>
              <p className="text-white/60 text-xs mt-1">
                {isServed ? 'Ready to pay your bill!' : 'Updating live every 10s'}
              </p>
            </div>
            <Timer size={64} className="text-white/15 rotate-12" />
          </div>
        </div>

        {/* Status Stepper */}
        <div className="bg-white/5 rounded-[2rem] p-7 border border-white/10 shadow-xl backdrop-blur-md">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-white/10" />
            <div className="space-y-9 relative z-10">
              {statuses.map((status, index) => {
                const isCompleted = index <= currentIdx;
                const isCurrent   = index === currentIdx;
                const Icon = status.icon;
                return (
                  <div key={status.key} className="flex gap-5 items-start">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center border-[3px] relative flex-shrink-0 transition-all duration-700",
                      isCompleted ? status.color : "bg-black border-white/20"
                    )}>
                      {isCurrent && <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping" />}
                      <Icon size={20} className={cn(
                        "transition-colors duration-500",
                        isCompleted ? (status.key === 'COMPLETED' ? 'text-black' : 'text-white') : "text-white/20",
                        isCurrent && "animate-pulse"
                      )} />
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className={cn("font-bold text-[15px]", isCompleted ? "text-white" : "text-white/30")}>
                        {status.label}
                      </h3>
                      {isCurrent && (
                        <p className="text-xs text-primary font-bold mt-0.5 animate-pulse">{status.sub}</p>
                      )}
                    </div>
                    {isCurrent && (
                      <div className="pt-2 flex items-center gap-1 bg-primary/20 border border-primary/30 rounded-full px-3 py-1">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Live</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 shadow-xl backdrop-blur-md">
          <h3 className="font-bold text-white mb-4 tracking-wide uppercase text-sm">Order Summary</h3>
          <div className="space-y-4">
            {orderData.items?.map((item: any) => (
              <div key={item.orderItemId} className="flex justify-between items-start">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-white">{item.itemName}</p>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      item.itemStatus === 'SERVED'    && 'text-green-400',
                      item.itemStatus === 'READY'     && 'text-yellow-400',
                      item.itemStatus === 'PREPARING' && 'text-blue-400',
                      item.itemStatus === 'PENDING'   && 'text-white/30',
                    )}>{item.itemStatus}</span>
                  </div>
                </div>
                <span className="text-[14px] font-black text-white/90">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
            <div className="pt-4 border-t border-dashed border-white/20 flex justify-between">
              <span className="font-bold text-white/60 text-sm uppercase tracking-widest">Total</span>
              <span className="text-2xl font-black text-primary">{formatCurrency(orderData.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Cancel Order — only when PLACED */}
        {canCancel && (
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="w-full flex items-center justify-center gap-2 bg-white/5 border border-red-500/30 text-red-400 py-3 rounded-2xl font-bold text-sm hover:bg-red-500/10 transition-colors"
          >
            <X size={15} /> Cancel Order
          </button>
        )}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 grid grid-cols-2 gap-3 bg-gradient-to-t from-black via-black/90 to-transparent pt-10 pb-8 z-40">
        <button
          onClick={() => navigate('../menu')}
          className="bg-white/5 border border-white/20 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors text-sm"
        >
          <Plus size={17} /> Add More
        </button>
        <Link
          to={`../bill?orderId=${orderData.orderId}`}
          className={cn(
            "py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-sm",
            isServed
              ? "bg-primary text-white shadow-[0_0_20px_rgba(210,105,30,0.5)]"
              : "bg-white/10 border border-white/20 text-white"
          )}
        >
          <Receipt size={17} />
          {isServed ? '💳 Pay Now' : 'View Bill'}
        </Link>
      </div>

      {/* Cancel Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-t-[2rem] p-8">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-red-400" />
            </div>
            <h3 className="text-xl font-black text-white text-center mb-2" style={{ fontFamily: 'Playfair Display' }}>Cancel Order?</h3>
            <p className="text-white/50 text-sm text-center mb-5">This will cancel your order and cannot be undone.</p>
            {cancelError && (
              <p className="text-red-400 text-xs text-center mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{cancelError}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setShowCancelConfirm(false); setCancelError(''); }}
                className="py-4 rounded-2xl font-bold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
              >Keep Order</button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="py-4 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelling
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <X size={15} />}
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
