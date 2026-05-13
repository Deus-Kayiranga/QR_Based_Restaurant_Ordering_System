import { useQuery } from '@tanstack/react-query'
import { staffApi } from '../../api/staff'
import { CreditCard, Receipt, TrendingUp, CheckCircle2, Clock } from 'lucide-react'
import { usePendingBills, usePaymentHistory } from '../../hooks/usePayments'
import { formatCurrency } from '../../utils/format'
import { cn } from '../../utils/classNames'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function DashboardPage() {
  const { user } = useAuth()
  const { data: stats } = useQuery({ queryKey: ['dashboard', 'cashier'], queryFn: () => staffApi.getCashierSummary() })
  const { data: pendingBills } = usePendingBills()
  const { data: recentPayments } = usePaymentHistory(new Date().toISOString().split('T')[0])
  const navigate = useNavigate()
  
  const pending = pendingBills ?? []
  const totalPending = pending.reduce((s, b) => s + Number(b.totalAmount), 0)
  const payments = recentPayments ?? []

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fadeIn pb-32">
      {/* Welcome Section */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>
            Hello, {user?.firstName}!
          </h1>
          <p className="text-textSecondary font-medium">Your shift snapshot for today.</p>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          onClick={() => navigate('/cashier/bills')}
          className="bg-warning/5 border border-warning/20 rounded-[2rem] p-6 flex flex-col gap-4 cursor-pointer hover:bg-warning/10 transition-all group"
        >
          <div className="w-12 h-12 bg-warning rounded-2xl flex items-center justify-center text-white shadow-lg shadow-warning/20 group-hover:scale-110 transition-transform">
            <Receipt size={24} />
          </div>
          <div>
            <div className="text-3xl font-black text-textPrimary">{pending.length}</div>
            <div className="text-[10px] font-black text-textSecondary uppercase tracking-widest mt-1">Pending Bills</div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <CreditCard size={24} />
          </div>
          <div>
            <div className="text-3xl font-black text-textPrimary">{formatCurrency(totalPending)}</div>
            <div className="text-[10px] font-black text-textSecondary uppercase tracking-widest mt-1">Pending Amount</div>
          </div>
        </div>

        <div className="bg-success/5 border border-success/20 rounded-[2rem] p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-success rounded-2xl flex items-center justify-center text-white shadow-lg shadow-success/20">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-3xl font-black text-textPrimary">{stats?.todayPayments ?? 0}</div>
            <div className="text-[10px] font-black text-textSecondary uppercase tracking-widest mt-1">Completed Payments Today</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Urgent Attention: Pending Bills */}
        <section className="space-y-4">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-textSecondary ml-2">Awaiting Payment</h2>
            <button onClick={() => navigate('/cashier/bills')} className="text-xs font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {pending.length === 0 ? (
               <div className="bg-white border border-border rounded-[2rem] p-8 text-center opacity-60 shadow-sm">
                  <CheckCircle2 size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium text-textSecondary">All bills are settled!</p>
               </div>
            ) : (
              pending.slice(0, 3).map(bill => (
                <div 
                  key={bill.billId}
                  onClick={() => navigate('/cashier/pay', { state: { bill } })}
                  className="bg-white border border-border rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-bg rounded-2xl flex items-center justify-center font-black text-textPrimary border border-border">
                      {bill.tableNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-textPrimary">Bill #{bill.billNumber || bill.billId}</h4>
                      <p className="text-textSecondary text-xs flex items-center gap-1 mt-0.5">
                        <Clock size={10} /> Pending
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-primary">{formatCurrency(bill.totalAmount)}</div>
                    <button className="text-[9px] font-bold uppercase tracking-widest text-primary/70 hover:text-primary mt-1">
                      Process &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent Completed Payments */}
        <section className="space-y-4">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-textSecondary ml-2">Recent Payments</h2>
            <button onClick={() => navigate('/cashier/history')} className="text-xs font-bold text-primary hover:underline">View History</button>
          </div>
          <div className="bg-white border border-border rounded-[2rem] p-2 overflow-hidden shadow-sm">
            {payments.length === 0 ? (
               <div className="p-8 text-center opacity-60">
                  <p className="text-sm font-medium text-textSecondary">No payments processed yet today.</p>
               </div>
            ) : (
              payments.slice(0, 5).map((payment, idx) => (
                <div 
                  key={payment.paymentId}
                  className={cn(
                    "p-4 flex items-center justify-between transition-colors hover:bg-bg",
                    idx !== Math.min(payments.length, 5) - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                       <CheckCircle2 size={18} />
                     </div>
                     <div>
                       <div className="text-sm font-bold text-textPrimary">{payment.receiptNumber || `RCP-${payment.paymentId}`}</div>
                       <div className="text-[10px] text-textSecondary uppercase tracking-widest font-bold mt-0.5">{payment.paymentMethod}</div>
                     </div>
                  </div>
                  <div className="text-right font-black text-textPrimary">
                    {formatCurrency(payment.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default DashboardPage

