import React from 'react';
import { 
  ClipboardList, 
  Search, 
  Clock, 
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWaiterOrders, useWaiterOrdersHistory } from '../../hooks/useOrders';
import { useAuth } from '../../hooks/useAuth';
import { ordersApi } from '../../api/orders';
import { formatCurrency, formatDate } from '../../utils/format';
import { cn } from '../../utils/classNames';

const MyOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: ordersRes, isLoading, refetch } = useWaiterOrders(user?.userId);
  const { data: historyRes } = useWaiterOrdersHistory(!!user);

  const handleServe = async (orderId: number) => {
    try {
      await ordersApi.updateOrderStatus(orderId, 'COMPLETED');
      refetch();
    } catch (error) {
      console.error('Failed to serve order', error);
    }
  };

  const orders = ordersRes || [];
  const history = historyRes || [];

  // Calculate today's stats
  const todayTotal = history.reduce((sum, o) => sum + o.totalAmount, 0);
  const todayCount = history.length;
  const avgOrder = todayCount > 0 ? todayTotal / todayCount : 0;

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-[#E8D5C4] shadow-sm">
          <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest mb-1">Today's Sales</p>
          <p className="text-2xl font-black text-[#2C1810]">{formatCurrency(todayTotal)}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#E8D5C4] shadow-sm">
          <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest mb-1">Orders Taken</p>
          <p className="text-2xl font-black text-[#2C1810]">{todayCount}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#E8D5C4] shadow-sm">
          <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest mb-1">Avg. Order</p>
          <p className="text-2xl font-black text-[#2C1810]">{formatCurrency(avgOrder)}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display' }}>My Active Orders</h2>
          <p className="text-sm text-[#8B7355]">Track and serve your tables</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-[#8B7355]">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-[#E8D5C4]">
          <ClipboardList size={64} className="mx-auto text-[#E8D5C4] mb-4" />
          <h3 className="text-xl font-bold text-[#2C1810]">No active orders</h3>
          <p className="text-[#8B7355]">You aren't currently serving any active tables.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-white rounded-[2.5rem] border border-[#E8D5C4] overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-bold text-[#2C1810]">Table {order.tableNumber}</h3>
                    </div>
                    <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest">Order #{order.orderId}</p>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                      order.orderStatus === 'READY' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    )}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#6F4E37]">{item.quantity}x</span>
                        <span className={cn(
                            "font-bold",
                            item.itemStatus === 'READY' ? "text-green-700" : "text-[#2C1810]"
                        )}>{item.itemName}</span>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        item.itemStatus === 'READY' ? "text-green-500" : "text-[#8B7355]/50"
                      )}>
                        {item.itemStatus}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E8D5C4] gap-4">
                  <div className="flex items-center gap-1 text-[#8B7355]">
                    <Clock size={14} />
                    <span className="text-xs font-bold">
                      {Math.floor((Date.now() - new Date(order.placedAt).getTime()) / 60000)}m
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    {order.orderStatus === 'READY' && (
                        <button 
                            onClick={() => handleServe(order.orderId)}
                            className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-600/20 active:scale-95 transition-all"
                        >
                            Serve Now
                        </button>
                    )}
                    <button 
                        onClick={() => navigate(`/waiter/tables/${order.tableId}`)}
                        className="text-[#6F4E37] font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline"
                    >
                        Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
