import { formatCurrency } from '../../utils/format'

export function BillSummary({ subtotal, tax, total }: { subtotal: number; tax: number; total: number }) {
  return (
    <div className="space-y-2 rounded-2xl border border-deus-border bg-white p-4 text-sm">
      <div className="flex justify-between text-deus-muted">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-deus-muted">
        <span>Tax</span>
        <span>{formatCurrency(tax)}</span>
      </div>
      <div className="flex justify-between border-t border-deus-border pt-2 font-semibold text-deus-text">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
