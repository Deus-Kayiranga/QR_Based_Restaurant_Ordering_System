import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Download, 
  Filter,
  ArrowUpDown,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react';
import { usePaymentHistory } from '../../hooks/usePayments';
import { formatCurrency, formatDate } from '../../utils/format';
import { cn } from '../../utils/classNames';

const PaymentHistoryPage: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: historyRes, isLoading } = usePaymentHistory(date);

  const payments = historyRes || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>Payment History</h2>
          <p className="text-sm text-textSecondary">View and export past transactions</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
          <input 
            type="text" 
            placeholder="Search by receipt or table..." 
            className="w-full bg-bg border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-bg border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="bg-bg p-2.5 rounded-xl text-textSecondary hover:text-primary transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-bg border-b border-border">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Receipt #</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Time</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Table</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Method</th>
              <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-10">Loading history...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-textSecondary">No payments found for this date.</td></tr>
            ) : payments.map((payment: any) => (
              <tr key={payment.paymentId} className="hover:bg-bg/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-textPrimary">{payment.receiptNumber || `RCP-${payment.paymentId}`}</span>
                </td>
                <td className="px-6 py-4 text-xs text-textSecondary">
                  {formatDate(payment.paymentDate)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-textPrimary">{payment.tableNumber}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-primary">{formatCurrency(payment.amount)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {payment.paymentMethod === 'CASH' ? <Banknote size={16} className="text-success" /> : 
                     payment.paymentMethod === 'MOMO' ? <Smartphone size={16} className="text-warning" /> : 
                     <CreditCard size={16} className="text-primary" />}
                    <span className="text-xs font-medium text-textSecondary">{payment.paymentMethod}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                    payment.paymentStatus === 'COMPLETED' ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                  )}>
                    {payment.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
