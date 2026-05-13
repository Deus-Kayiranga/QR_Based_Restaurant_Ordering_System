import { useNavigate } from 'react-router-dom'
import { usePendingBills } from '../../hooks/usePayments'
import { BillCard } from '../../components/cashier/BillCard'
import { Receipt, CheckCircle2 } from 'lucide-react'

export function PendingBillsPage() {
  const nav = useNavigate()
  const { data, isLoading } = usePendingBills()
  const bills = data ?? []

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fadeIn pb-32">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>
            Pending Bills
          </h1>
          <p className="text-textSecondary font-medium">Select a bill to process payment.</p>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-2xl px-4 py-2 text-right">
          <div className="text-[10px] font-bold text-warning uppercase tracking-widest">Awaiting</div>
          <div className="text-xl font-black text-warning">{bills.length}</div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-textSecondary font-bold uppercase tracking-widest text-xs">Loading Bills...</p>
        </div>
      ) : bills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-white border border-border rounded-[2.5rem] shadow-sm">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center text-success mb-2">
            <CheckCircle2 size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-1 text-textPrimary" style={{ fontFamily: 'Playfair Display' }}>All Caught Up</h3>
            <p className="text-textSecondary text-sm">There are no pending bills right now.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bills.map((b) => (
            <BillCard key={b.billId} bill={b} onSelect={() => nav('/cashier/pay', { state: { bill: b } })} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PendingBillsPage
