import type { MenuItemResponse } from '../../types'
import { formatCurrency } from '../../utils/format'

export function MenuGrid({ items }: { items: MenuItemResponse[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.itemId}
          className="overflow-hidden rounded-2xl border border-deus-border bg-white shadow-sm"
        >
          <div className="aspect-video bg-deus-bg" />
          <div className="p-4">
            <p className="font-medium text-deus-text">{item.itemName}</p>
            <p className="text-xs text-deus-muted">{item.categoryName}</p>
            <p className="mt-2 font-display text-lg text-deus-primary">
              {formatCurrency(Number(item.price))}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}
