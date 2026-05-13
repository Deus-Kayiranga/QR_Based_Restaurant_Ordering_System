import type { KitchenOrderResponse } from '../../types'
import { KDSOrderCard } from './KDSOrderCard'

export function KDSKanbanBoard({ orders }: { orders: KitchenOrderResponse[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {orders.map((o) => (
        <KDSOrderCard key={o.orderId} order={o} />
      ))}
    </div>
  )
}
