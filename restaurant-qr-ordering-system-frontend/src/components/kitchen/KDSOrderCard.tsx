import type { KitchenOrderResponse } from '../../types'
import { StatusBadge } from '../common/StatusBadge'

export function KDSOrderCard({ order }: { order: KitchenOrderResponse }) {
  return (
    <div className="rounded-2xl border border-deus-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-semibold">#{order.orderId}</p>
        <StatusBadge status={order.orderStatus} />
      </div>
      <p className="text-xs text-deus-muted">{order.tableNumber}</p>
    </div>
  )
}
