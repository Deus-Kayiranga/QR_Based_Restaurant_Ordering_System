import React from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  ChevronRight,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency, formatDate } from '../../utils/format';
import { cn } from '../../utils/classNames';

const ManagerOrdersPage: React.FC = () => {
  const { data: ordersRes, isLoading } = useOrders();

  const orders = ordersRes?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>All Orders</h2>
          <p className="text-sm text-textSecondary">Monitor real-time and historical orders</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
          <Download size={20} />
          Export Orders
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
          <input 
            type="text" 
            placeholder="Search by order ID, table, or waiter..." 
            className="w-full bg-bg border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="bg-bg border-none rounded-xl py-2.5 px-4 text-sm font-bold text-textSecondary focus:ring-2 focus:ring-primary/20">
            <option>All Statuses</option>
            <option>Placed</option>
            <option>Confirmed</option>
            <option>Preparing</option>
            <option>Ready</option>
            <option>Completed</option>
          </select>
          <button className="bg-bg p-2.5 rounded-xl text-textSecondary hover:text-primary transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-bg border-b border-border">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Order ID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Table</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Time</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Items</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Total</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              <tr><td colSpan={7} className="text-center py-10">Loading orders...</td></tr>
            ) : orders.map((order) => (
              <tr key={order.orderId} className="hover:bg-bg/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-textPrimary">#{order.orderId}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-textPrimary">{(order as any).tableNumber || order.table?.tableNumber || '?'}</span>
                </td>
                <td className="px-6 py-4 text-xs text-textSecondary">
                  {formatDate(order.placedAt)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-textSecondary">{order.items.length} items</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                    order.orderStatus === 'COMPLETED' ? "bg-success/10 text-success" : 
                    order.orderStatus === 'CANCELLED' ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"
                  )}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-primary hover:underline flex items-center gap-1 text-xs font-bold uppercase">
                    View <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerOrdersPage;
