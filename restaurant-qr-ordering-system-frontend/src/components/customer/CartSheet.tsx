import { formatCurrency } from '../../utils/format'
import type { CartItem } from '../../types'
import { COLORS } from '../../styles/theme'

export function CartSheet({
  lines,
  subtotal,
  tax,
  total,
  onCheckout,
}: {
  lines: CartItem[]
  subtotal: number
  tax: number
  total: number
  onCheckout: () => void
}) {
  return (
    <div className="cart-slide rounded-t-3xl border bg-white p-4 shadow-2xl" style={{ borderColor: COLORS.border }}>
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-deus-border" />
      <p className="font-display text-lg text-deus-text">Your order</p>
      <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto text-sm deus-scrollbar">
        {lines.map((l) => (
          <li key={l.menuItem.itemId} className="flex justify-between gap-2 border-b border-deus-border/60 pb-2">
            <span>
              {l.quantity}× {l.menuItem.itemName}
            </span>
            <span className="text-deus-muted">{formatCurrency(l.menuItem.price * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 space-y-1 border-t border-deus-border pt-3 text-xs text-deus-muted">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (18%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-deus-border pt-3 font-semibold text-deus-text">
        <span>Total</span>
        <span style={{ color: COLORS.primary }}>{formatCurrency(total)}</span>
      </div>
      <button
        type="button"
        className="mt-4 w-full rounded-xl py-3 font-semibold text-white shadow"
        style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` }}
        disabled={!lines.length}
        onClick={onCheckout}
      >
        Review & place order
      </button>
    </div>
  )
}
