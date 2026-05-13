import { formatCurrency } from '../../utils/format'
import { Banknote, Smartphone, Receipt, Printer } from 'lucide-react'

export function ShiftReport({ summary }: { summary: Record<string, unknown> }) {
  const total = Number(summary.total ?? 0)
  const count = Number(summary.count ?? 0)
  const cash = Number(summary.cash ?? 0)
  const momo = Number(summary.momo ?? 0)
  const airtel = Number(summary.airtel ?? 0)

  return (
    <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-border/50">
        <div>
          <h2 className="text-2xl font-black text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>Shift Summary</h2>
          <p className="text-textSecondary text-sm font-medium mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-bg border border-border text-textPrimary px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all font-bold text-sm shadow-sm"
        >
          <Printer size={18} />
          Print Report
        </button>
      </div>

      {/* Grand Total */}
      <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Receipt size={120} />
        </div>
        <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-2 relative z-10">Total Collected</p>
        <h1 className="text-5xl md:text-6xl font-black text-textPrimary relative z-10">{formatCurrency(total)}</h1>
        <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-textSecondary border border-border/50 shadow-sm relative z-10">
          <Receipt size={14} />
          {count} Transactions Processed
        </div>
      </div>

      {/* Breakdown */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-textSecondary mb-4 ml-2">Revenue Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:border-success/30 transition-colors">
            <div className="w-10 h-10 bg-success/10 text-success rounded-xl flex items-center justify-center">
              <Banknote size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Cash</p>
              <p className="text-xl font-black text-textPrimary">{formatCurrency(cash)}</p>
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:border-warning/30 transition-colors">
            <div className="w-10 h-10 bg-warning/10 text-warning rounded-xl flex items-center justify-center">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">MTN MoMo</p>
              <p className="text-xl font-black text-textPrimary">{formatCurrency(momo)}</p>
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:border-danger/30 transition-colors">
            <div className="w-10 h-10 bg-danger/10 text-danger rounded-xl flex items-center justify-center">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Airtel Money</p>
              <p className="text-xl font-black text-textPrimary">{formatCurrency(airtel)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
