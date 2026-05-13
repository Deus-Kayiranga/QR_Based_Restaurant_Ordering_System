import React, { useState, useEffect } from 'react';
import { ordersApi } from '../../api/orders';
import { dashboardApi } from '../../api/dashboard';
import type { Order } from '../../types';
import { 
  Clock, 
  Beer, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  CheckCircle,
  Wine,
  Volume2,
  LayoutGrid,
  History,
  Timer,
  Info,
  Search,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../utils/classNames';
import { formatTime } from '../../utils/format';

const BarDisplayPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayDrinks: 0,
    todayReady: 0,
    todayPending: 0
  });

  const fetchData = async () => {
    try {
      const [queueData, dashboardStats] = await Promise.all([
        ordersApi.getBarQueue(),
        dashboardApi.getBarStats()
      ]);
      setOrders(queueData);
      
      if (dashboardStats) {
        setStats({
          todayOrders: dashboardStats.todayTotal || 0,
          todayDrinks: (dashboardStats.ready || 0) + (dashboardStats.preparing || 0),
          todayReady: dashboardStats.ready || 0,
          todayPending: dashboardStats.placed || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch bar data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
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
    return orders.filter(o => o.items.some(i => i.itemStatus === status && (i as any).destinationStation === 'BAR'));
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
            <Beer size={28} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black uppercase tracking-tighter" style={{ fontFamily: 'Playfair Display' }}>
                Bar Station
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
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Mixology Live
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="hidden lg:grid grid-cols-2 gap-3">
                <div className="bg-[#FFF8F0] border border-[#E8D5C4] rounded-xl px-4 py-2 flex flex-col justify-center">
                    <span className="text-[9px] font-black text-[#8B7355] uppercase tracking-widest">Today's Drinks</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-[#8B4513]">{stats.todayDrinks}</span>
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
                station="BAR"
                onStart={(orderId, itemId) => handleUpdateStatus(orderId, itemId, 'PREPARING')}
              />
            ))}
            {pendingOrders.length === 0 && (
                <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-[#E8D5C4] rounded-[2rem] flex items-center justify-center">
                        <Beer size={32} className="text-[#8B7355]" />
                    </div>
                    <p className="font-black text-xs uppercase tracking-[0.2em] text-[#8B7355]">Bar Clear</p>
                </div>
            )}
          </div>
        </div>

        {/* MIXING Column */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                    <Play size={16} className="fill-current" />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B7355]">Mixing</h3>
            </div>
            <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-black">{preparingOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10 scrollbar-thin">
            {preparingOrders.map((order) => (
              <OrderCard 
                key={order.orderId} 
                order={order} 
                station="BAR"
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
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B7355]">On Counter</h3>
            </div>
            <span className="bg-green-600 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-black">{readyOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10 scrollbar-thin">
            {readyOrders.map((order) => (
              <OrderCard 
                key={order.orderId} 
                order={order} 
                station="BAR"
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
                  <span className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest">{preparingOrders.length} Mixing</span>
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
    <div className="bg-white rounded-[1.5rem] border border-[#E8D5C4] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group border-l-4 border-l-[#8B4513]">
      <div className="p-4 bg-[#FFF8F0]/50 flex items-center justify-between border-b border-[#E8D5C4]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center font-black text-[#8B4513] border border-[#E8D5C4] shadow-sm text-lg">
            {order.tableNumber || '?'}
          </div>
          <div>
            <div className="text-[9px] font-black text-[#8B7355] uppercase tracking-widest">Order #{String(order.orderId).padStart(3, '0')}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
                <Clock size={10} className="text-red-500" />
                <span className="text-[10px] font-black text-red-600">{(order as any).timeSinceOrdered || formatTime(order.placedAt)}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
            <span className="text-[9px] font-black text-[#8B7355] uppercase block">Waiter</span>
            <span className="text-[10px] font-bold text-[#2C1810]">{(order as any).waiterName || 'Staff'}</span>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {stationItems.map((item: any) => (
          <div key={item.orderItemId} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3 flex-1">
                <div className="mt-0.5 w-6 h-6 rounded-lg bg-[#8B4513] flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-sm">
                    {item.quantity}
                </div>
                <div className="flex-1">
                    <p className={cn(
                        "text-sm font-bold text-[#2C1810] leading-tight",
                        item.itemStatus === 'READY' && "text-green-600 line-through opacity-40"
                    )}>
                        {item.menuItem?.itemName || item.itemName}
                    </p>
                    {item.specialNotes && (
                        <div className="flex items-start gap-2 mt-2 bg-orange-50 p-2 rounded-xl border border-orange-100">
                           <AlertTriangle size={12} className="text-orange-600 shrink-0 mt-0.5" />
                           <p className="text-[10px] text-orange-700 font-bold italic leading-relaxed">
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
                    className="bg-[#8B4513] text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md shadow-[#8B4513]/20 active:scale-95 flex items-center gap-1.5 hover:bg-[#6B3410] transition-colors"
                  >
                    <Play size={10} className="fill-current" />
                    Start
                  </button>
                )}
                {item.itemStatus === 'PREPARING' && onComplete && (
                  <button 
                    onClick={() => onComplete(order.orderId, item.orderItemId)}
                    className="bg-green-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md shadow-green-600/20 active:scale-95 flex items-center gap-1.5 hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={10} />
                    Ready
                  </button>
                )}
                {item.itemStatus === 'READY' && (
                  <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100 shadow-sm">
                    <CheckCircle2 size={20} />
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

export default BarDisplayPage;
