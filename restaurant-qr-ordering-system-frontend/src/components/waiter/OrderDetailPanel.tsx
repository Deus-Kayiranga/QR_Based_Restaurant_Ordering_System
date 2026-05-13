import type { OrderResponse } from '../../types'
import { OrderTimeline } from '../manager/OrderTimeline'

export function OrderDetailPanel({ order }: { order: OrderResponse | null }) {
  if (!order) return <p className="text-sm text-deus-muted">Select a table with active orders.</p>
  return <OrderTimeline order={order} />
}
