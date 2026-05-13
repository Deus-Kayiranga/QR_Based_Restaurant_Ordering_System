import type { BillResponse } from '../../types'
import { formatCurrency } from '../../utils/format'
import { Receipt, Clock } from 'lucide-react'

export function BillCard({ bill, onSelect }: { bill: BillResponse; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-[1.5rem] border border-border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/50 group"
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-bg rounded-xl flex items-center justify-center border border-border text-textPrimary group-hover:bg-primary/5 group-hover:text-primary transition-colors">
            <Receipt size={20} />
          </div>
          <div>
            <p className="font-bold text-textPrimary text-sm">Table {bill.tableNumber ?? 'N/A'}</p>
            <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest flex items-center gap-1 mt-0.5">
              <Clock size={10} /> {bill.billStatus}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between pt-4 border-t border-border/50">
        <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Total Due</span>
        <p className="font-black text-2xl text-primary font-display">{formatCurrency(Number(bill.totalAmount))}</p>
      </div>
    </button>
  )
}
