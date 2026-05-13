import React from 'react';
import { useWaiter } from '../../contexts/WaiterContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Bell, 
  ChefHat, 
  Clock, 
  TrendingUp, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/classNames';
import { useNavigate } from 'react-router-dom';

const WaiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const { myTables, myOrders, isLoading } = useWaiter();
  const navigate = useNavigate();

  const readyOrders = myOrders.filter(o => o.items.some(i => i.itemStatus === 'READY'));
  const prepOrders = myOrders.filter(o => o.orderStatus === 'PREPARING');

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse text-textSecondary">Syncing your dashboard...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fadeIn pb-32">
      {/* Welcome Section */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>
            Hello, {user?.firstName}!
          </h1>
          <p className="text-textSecondary font-medium">Your shift is going great. Here's what needs attention.</p>
        </div>
        <button className="relative p-3 bg-white border border-border rounded-2xl text-textSecondary hover:bg-bg transition-colors group">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
        </button>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => navigate('/waiter/tables')}
          className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 flex flex-col gap-4 cursor-pointer hover:bg-primary/10 transition-all group"
        >
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-3xl font-black text-textPrimary">{myTables.length}</div>
            <div className="text-[10px] font-black text-textSecondary uppercase tracking-widest mt-1">My Tables</div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-[2rem] p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-success/10 border border-success/20 rounded-2xl flex items-center justify-center text-success">
            <ChefHat size={24} />
          </div>
          <div>
            <div className="text-3xl font-black text-textPrimary">{readyOrders.length}</div>
            <div className="text-[10px] font-black text-textSecondary uppercase tracking-widest mt-1">Ready to Serve</div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-[2rem] p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-warning/10 border border-warning/20 rounded-2xl flex items-center justify-center text-warning">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-3xl font-black text-textPrimary">{prepOrders.length}</div>
            <div className="text-[10px] font-black text-textSecondary uppercase tracking-widest mt-1">In Preparation</div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-[2rem] p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-500">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-3xl font-black text-textPrimary">12</div>
            <div className="text-[10px] font-black text-textSecondary uppercase tracking-widest mt-1">Served Today</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Critical Alerts */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-textSecondary ml-2">Urgent Attention</h2>
          <div className="space-y-4">
            {readyOrders.length === 0 ? (
               <div className="bg-white border border-border rounded-[2rem] p-8 text-center opacity-60">
                  <CheckCircle2 size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium text-textSecondary">All items have been served!</p>
               </div>
            ) : (
              readyOrders.map(order => (
                <div 
                  key={order.orderId}
                  onClick={() => navigate(`/waiter/tables/${order.table?.tableId}`)}
                  className="bg-primary border border-primary/20 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-all shadow-xl shadow-primary/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-primary border border-primary/20">
                      {order.table?.tableNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Order #{order.orderId} READY</h4>
                      <p className="text-white/80 text-xs">{order.items.filter(i => i.itemStatus === 'READY').length} items ready to serve</p>
                    </div>
                  </div>
                  <ChefHat size={24} className="text-white/60" />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Status Feed */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-textSecondary ml-2">Kitchen Status</h2>
          <div className="bg-white border border-border rounded-[2rem] p-2 overflow-hidden shadow-sm">
            {prepOrders.length === 0 ? (
               <div className="p-8 text-center opacity-60">
                  <p className="text-sm font-medium text-textSecondary">No orders currently in prep.</p>
               </div>
            ) : (
              prepOrders.map((order, idx) => (
                <div 
                  key={order.orderId}
                  className={cn(
                    "p-5 flex items-center justify-between transition-colors hover:bg-bg",
                    idx !== prepOrders.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-black text-textSecondary">#{order.table?.tableNumber}</span>
                     <div>
                       <div className="text-sm font-bold text-textPrimary">Preparation Started</div>
                       <div className="text-[10px] text-textSecondary uppercase tracking-widest font-black">Order #{order.orderId}</div>
                     </div>
                  </div>
                  <Clock size={16} className="text-warning animate-spin-slow" />
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Helpful Hint */}
      <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-6 flex items-center gap-4">
        <AlertCircle size={24} className="text-primary" />
        <p className="text-xs font-medium text-textSecondary leading-relaxed">
          <strong className="text-primary">Pro-tip:</strong> You can see your section's table status in the Tables tab. Tables will glow orange when a customer starts ordering.
        </p>
      </div>
    </div>
  );
};

export default WaiterDashboard;
