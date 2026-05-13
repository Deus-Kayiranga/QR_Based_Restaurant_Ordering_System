import React, { useState, useEffect } from 'react';
import { ordersApi } from '../../api/orders';
import { dashboardApi } from '../../api/dashboard';
import type { Order } from '../../types';
import { 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  CheckCircle,
  TrendingUp,
  Volume2,
  Utensils,
  LayoutGrid,
  History,
  Timer,
  Info,
  UtensilsCrossed,
  Flame
} from 'lucide-react';
import { cn } from '../../utils/classNames';
import { formatTime } from '../../utils/format';

const KitchenDisplayPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayItems: 0,
    todayReady: 0,
    efficiency: 98
  });

  const fetchData = async () => {
    try {
      const [queueData, dashboardStats] = await Promise.all([
        ordersApi.getKitchenQueue(),
        dashboardApi.getKitchenStats()
      ]);
      setOrders(queueData);
      
      if (dashboardStats) {
        setStats({
          todayOrders: dashboardStats.todayTotal || 0,
          todayItems: (dashboardStats.ready || 0) + (dashboardStats.preparing || 0),
          todayReady: dashboardStats.ready || 0,
          efficiency: 98
        });
      }
    } catch (error) {
      console.error('Failed to fetch kitchen data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: number, itemId: number, newStatus: any) => {
    try {
      await ordersApi.updateOrderItemStatus(orderId, itemId, newStatus);
      fetchData();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const getOrdersByItemStatus = (status: string) => {
    return orders.filter(o => o.items.some(i => i.itemStatus === status && (i as any).destinationStation === 'KITCHEN'));
  };

  const pendingOrders = getOrdersByItemStatus('PENDING');
  const preparingOrders = getOrdersByItemStatus('PREPARING');
  const readyOrders = getOrdersByItemStatus('READY');

  return (
    <div className="flex flex-col min-h-full bg-[#FFF8F0] text-[#2C1810] font-sans">
      {/* Station Header */}
      <header className="p-4 md:p-6 bg-white border border-[#E8D5C4] rounded-[2rem] flex items-center justify-between shadow-sm mb-6">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-[#8B4513] rounded-2xl flex items-center justify-center shadow-lg shadow-[#8B4513]/20">
            <UtensilsCrossed size={28} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black uppercase tracking-tighter" style={{ fontFamily: 'Playfair Display' }}>
                Main Kitchen
              </h1>
              <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black border border-red-100 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                {pendingOrders.length} NEW ORDERS
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mt-1">
              <div className="flex items-center gap-1">
                <Clock size={12} /> {(new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <span className="w-1 h-1 rounded-full bg-[#E8D5C4]" />
              <div className="flex items-center gap-1 text-green-600">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> System Online
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="hidden lg:grid grid-cols-2 gap-3">
                <div className="bg-[#FFF8F0] border border-[#E8D5C4] rounded-xl px-4 py-2 flex flex-col justify-center">
                    <span className="text-[9px] font-black text-[#8B7355] uppercase tracking-widest">Today's Dishes</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-[#8B4513]">{stats.todayItems}</span>
                        <span className="text-[9px] font-bold text-[#8B7355]">PCS</span>
                    </div>
                </div>
                <div className="bg-[#FFF8F0] border border-[#E8D5C4] rounded-xl px-4 py-2 flex flex-col justify-center">
                    <span className="text-[9px] font-black text-[#8B7355] uppercase tracking-widest">Ready</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-green-600">{stats.todayReady}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="p-2.5 bg-[#FFF8F0] border border-[#E8D5C4] rounded-xl text-[#8B7355] hover:bg-white transition-all shadow-sm">
                    <Volume2 size={18} />
                </button>
                <button className="p-2.5 bg-[#FFF8F0] border border-[#E8D5C4] rounded-xl text-[#8B7355] hover:bg-white transition-all shadow-sm">
                    <LayoutGrid size={18} />
                </button>
            </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        
        {/* NEW Column */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600 border border-red-200">
                    <Timer size={16} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B7355]">In Queue</h3>
            </div>
            <span className="bg-red-500 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-black">{pendingOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10 scrollbar-thin">
            {pendingOrders.map((order) => (
              <OrderCard 
                key={order.orderId} 
                order={order} 
                station="KITCHEN"
                onStart={(orderId, itemId) => handleUpdateStatus(orderId, itemId, 'PREPARING')}
              />
            ))}
            {pendingOrders.length === 0 && (
                <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-[#E8D5C4] rounded-[2rem] flex items-center justify-center">
                        <UtensilsCrossed size={32} className="text-[#8B7355]" />
                    </div>
                    <p className="font-black text-xs uppercase tracking-[0.2em] text-[#8B7355]">Kitchen Clear</p>
                </div>
            )}
          </div>
        </div>

        {/* PREPARING Column */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                    <Flame size={16} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B7355]">Preparing</h3>
            </div>
            <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-black">{preparingOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10 scrollbar-thin">
            {preparingOrders.map((order) => (
              <OrderCard 
                key={order.orderId} 
                order={order} 
                station="KITCHEN"
                onComplete={(orderId, itemId) => handleUpdateStatus(orderId, itemId, 'READY')}
              />
            ))}
          </div>
        </div>

        {/* READY Column */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-green-600 border border-green-200">
                    <CheckCircle size={16} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B7355]">Ready</h3>
            </div>
            <span className="bg-green-600 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-black">{readyOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10 scrollbar-thin">
            {readyOrders.map((order) => (
              <OrderCard 
                key={order.orderId} 
                order={order} 
                station="KITCHEN"
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer Stats Bar */}
      <footer className="mt-6 p-4 bg-white border border-[#E8D5C4] rounded-[1.5rem] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest">{pendingOrders.length} Waiting</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest">{preparingOrders.length} Preparing</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest">{readyOrders.length} Finished</span>
              </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.1em] text-[#8B4513] flex items-center gap-2">
            <TrendingUp size={14} /> Total Today: <span className="text-[#2C1810] font-black text-xs">{stats.todayOrders} Tickets</span>
          </div>
      </footer>
    </div>
  );
};

interface OrderCardProps {
  order: Order;
  station: 'BAR' | 'KITCHEN';
  onStart?: (orderId: number, itemId: number) => void;
  onComplete?: (orderId: number, itemId: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, station, onStart, onComplete }) => {
  const stationItems = order.items.filter((i: any) => i.destinationStation === station);
  
  if (stationItems.length === 0) return null;

  return (
    <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl hover:bg-white/[0.07] transition-all duration-300 group border-l-4 border-l-orange-500/50">
      <div className="p-5 bg-white/5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-white border border-white/10 shadow-inner text-xl">
            {order.tableNumber || '?'}
          </div>
          <div>
            <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">TICKET #{String(order.orderId).padStart(3, '0')}</div>
            <div className="flex items-center gap-2 mt-0.5">
                <Clock size={12} className="text-red-500" />
                <span className="text-xs font-black text-red-500">{(order as any).timeSinceOrdered || formatTime(order.placedAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-0.5">Waiter</span>
            <span className="text-[11px] font-bold text-white/70">{(order as any).waiterName || 'Staff'}</span>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {stationItems.map((item: any) => (
          <div key={item.orderItemId} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="mt-0.5 w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-orange-500/20">
                    {item.quantity}
                </div>
                <div className="flex-1 pt-0.5">
                    <p className={cn(
                        "text-[15px] font-bold text-white leading-tight",
                        item.itemStatus === 'READY' && "text-green-500 line-through opacity-40"
                    )}>
                        {item.menuItem?.itemName || item.itemName}
                    </p>
                    {item.specialNotes && (
                        <div className="flex items-start gap-2 mt-2 bg-orange-500/10 p-3 rounded-2xl border border-orange-500/20">
                           <AlertTriangle size={14} className="text-orange-600 shrink-0 mt-0.5" />
                           <p className="text-[11px] text-orange-200/80 font-medium italic leading-relaxed">
                             "{item.specialNotes}"
                           </p>
                        </div>
                    )}
                </div>
              </div>

              <div className="flex-shrink-0 pt-0.5">
                {item.itemStatus === 'PENDING' && onStart && (
                  <button 
                    onClick={() => onStart(order.orderId, item.orderItemId)}
                    className="bg-orange-500 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-orange-500/20 active:scale-95 flex items-center gap-2 hover:bg-orange-600 transition-all"
                  >
                    <Play size={14} className="fill-current" />
                    Start
                  </button>
                )}
                {item.itemStatus === 'PREPARING' && onComplete && (
                  <button 
                    onClick={() => onComplete(order.orderId, item.orderItemId)}
                    className="bg-green-600 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-green-600/20 active:scale-95 flex items-center gap-2 hover:bg-green-700 transition-all"
                  >
                    <CheckCircle size={14} />
                    Done
                  </button>
                )}
                {item.itemStatus === 'READY' && (
                  <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 shadow-sm">
                    <CheckCircle2 size={24} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenDisplayPage;
