import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Utensils, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  DollarSign,
  ShoppingCart,
  CheckCircle2
} from 'lucide-react';
import { useTables } from '../../hooks/useTables';
import { useOrders } from '../../hooks/useOrders';
import { useManagerDashboard } from '../../hooks/useDashboard';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/classNames';
import { Link } from 'react-router-dom';

const ManagerDashboard: React.FC = () => {
  const { data: tablesRes } = useTables();
  const { data: ordersRes } = useOrders();
  const { data: dashboardRes } = useManagerDashboard();

  const totalRevenue = dashboardRes?.totalRevenue || 0;
  const activeTablesCount = tablesRes?.filter(t => t.status === 'OCCUPIED').length || 0;
  const totalTables = tablesRes?.length || 0;
  const totalOrders = dashboardRes?.totalOrders || 0;
  
  const stats = [
    { label: 'Today Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-success', bg: 'bg-success/10', trend: 'Live' },
    { label: 'Active Tables', value: `${activeTablesCount} / ${totalTables}`, icon: Utensils, color: 'text-primary', bg: 'bg-primary/10', trend: 'Occupied' },
    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingCart, color: 'text-secondary', bg: 'bg-secondary/10', trend: 'Today' },
  ];

  const recentOrders = ordersRes?.content?.slice(0, 5) || [];
  const popularItems = dashboardRes?.popularItems || [];

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-full",
                stat.trend === 'Live' ? "bg-success/10 text-success" : "bg-textSecondary/10 text-textSecondary"
              )}>
                {stat.trend}
              </span>
            </div>
            <p className="text-textSecondary text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-textPrimary mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Floor Plan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>Floor Plan Status</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-success rounded-full" />
                <span className="text-[10px] font-bold text-textSecondary uppercase tracking-tighter">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-warning rounded-full" />
                <span className="text-[10px] font-bold text-textSecondary uppercase tracking-tighter">Occupied</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] p-8 border border-border shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {tablesRes?.map((table: any) => (
                <div 
                  key={table.tableId}
                  className={cn(
                    "aspect-square rounded-[2rem] border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group hover:scale-105",
                    table.status === 'AVAILABLE' 
                      ? "bg-success/5 border-success/20 hover:bg-success/10" 
                      : "bg-warning/5 border-warning/20 hover:bg-warning/10"
                  )}
                >
                  <span className={cn(
                    "text-xl font-bold",
                    table.status === 'AVAILABLE' ? "text-success" : "text-warning"
                  )}>
                    {table.tableNumber}
                  </span>
                  <span className="text-[10px] font-bold text-textSecondary/60 uppercase">
                    {table.seatingCapacity} Seats
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 border border-border shadow-sm">
             <h2 className="text-xl font-bold text-textPrimary mb-4" style={{ fontFamily: 'Playfair Display' }}>Most Popular Items</h2>
             <div className="space-y-4">
               {popularItems.length > 0 ? popularItems.map((item: any, i: number) => (
                 <div key={i} className="flex justify-between items-center bg-bg p-4 rounded-2xl border border-border">
                   <div className="flex items-center gap-4">
                     <span className="text-sm font-black text-textSecondary uppercase tracking-widest w-4">#{i+1}</span>
                     <span className="font-bold text-textPrimary">{item.itemName}</span>
                   </div>
                   <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{item.quantity} orders</span>
                 </div>
               )) : (
                 <p className="text-sm text-textSecondary">No data available yet.</p>
               )}
             </div>
          </div>
        </div>

        {/* Recent Activity / Notifications */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>Recent Activity</h2>
          <div className="bg-white rounded-[2.5rem] p-6 border border-border shadow-sm divide-y divide-border/50">
            {recentOrders.length > 0 ? (
              recentOrders.map((order: any, i: number) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-textSecondary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-textPrimary">Order #{order.orderId} - Table {(order as any).tableNumber || order.table?.tableNumber || '?'}</p>
                    <p className="text-xs text-textSecondary">{order.items.length} items • {formatCurrency(order.totalAmount)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                      <span className="text-[10px] font-bold text-warning uppercase tracking-tighter">{order.orderStatus}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <AlertCircle size={32} className="mx-auto text-border mb-2" />
                <p className="text-sm text-textSecondary">No recent orders found.</p>
              </div>
            )}
            <Link to="/manager/orders" className="w-full pt-4 text-xs font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-2 hover:underline">
              View All Orders <ArrowRight size={14} />
            </Link>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-danger/5 border border-danger/20 rounded-[2rem] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-danger">
                <AlertCircle size={20} />
                <h3 className="font-bold text-sm uppercase tracking-widest">Stock Alerts</h3>
              </div>
              <Link to="/manager/stock" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Manage</Link>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-textPrimary">Rwandan Single Origin Coffee</span>
                <span className="font-bold text-danger">4 left</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-textPrimary">Almond Milk</span>
                <span className="font-bold text-danger">2 units</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
