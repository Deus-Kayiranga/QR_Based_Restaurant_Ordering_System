import React from 'react';
import { 
  Receipt, 
  Search, 
  Clock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { usePendingBills } from '../../hooks/usePayments';
import { formatCurrency } from '../../utils/format';

const CashierBillsPage: React.FC = () => {
  const { data: billsRes, isLoading } = usePendingBills();

  const bills = billsRes || [];

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
          <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-1">Pending Bills</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-textPrimary">{bills.length}</span>
            <span className="text-xs font-bold text-danger">Waiting</span>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
          <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-1">Today Revenue</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-success">RWF 420K</span>
            <span className="text-xs font-bold text-success">+8.2%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>Billing Queue</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
            <input 
              type="text" 
              placeholder="Search table or bill #" 
              className="bg-white border border-border rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : bills.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-border">
          <Receipt size={64} className="mx-auto text-border mb-4" />
          <h3 className="text-xl font-bold text-textPrimary">No pending bills</h3>
          <p className="text-textSecondary">All customers have cleared their payments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {bills.map((bill: any) => (
            <div key={bill.billId} className="bg-white rounded-[2.5rem] border border-border overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-bold text-textPrimary">Table {bill.tableNumber}</h3>
                      <div className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase">Active</div>
                    </div>
                    <p className="text-xs font-bold text-textSecondary uppercase tracking-widest">Bill #{bill.billNumber}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-danger mb-1">
                      <Clock size={14} />
                      <span className="text-sm font-bold">5:20</span>
                    </div>
                    <p className="text-[10px] font-bold text-textSecondary uppercase tracking-tighter">Wait Time</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {bill.items.slice(0, 3).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-textSecondary"><span className="font-bold text-textPrimary">{item.quantity}x</span> {item.itemName}</span>
                      <span className="font-bold text-textPrimary">{formatCurrency(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                  {bill.items.length > 3 && (
                    <p className="text-xs text-primary font-bold">+ {bill.items.length - 3} more items</p>
                  )}
                </div>

                <div className="pt-4 border-t border-border flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-textSecondary uppercase tracking-widest">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(bill.totalAmount)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="py-3 bg-bg hover:bg-border rounded-2xl text-[10px] font-bold uppercase text-textPrimary flex items-center justify-center gap-2 transition-colors">
                    <AlertCircle size={14} /> Notify
                  </button>
                  <button className="py-3 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform">
                    Pay <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CashierBillsPage;
