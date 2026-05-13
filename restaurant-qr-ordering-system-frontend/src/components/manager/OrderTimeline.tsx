import type { OrderResponse } from '../../types'
import { formatTime } from '../../utils/format'
import { StatusBadge } from '../common/StatusBadge'

export function OrderTimeline({ order }: { order: OrderResponse }) {
  return (
    <div className="rounded-2xl border border-deus-border bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="font-medium">Order #{order.orderId}</p>
        <StatusBadge status={order.orderStatus} />
      </div>
      <p className="mt-1 text-xs text-deus-muted">{formatTime(order.placedAt ?? order.completedAt ?? new Date().toISOString())}</p>
      <ul className="mt-3 space-y-1 text-sm">
        {order.items.map((it, i) => (
          <li key={i}>
            {it.quantity}× {it.itemName}
          </li>
        ))}
      </ul>
    </div>
  )
}
