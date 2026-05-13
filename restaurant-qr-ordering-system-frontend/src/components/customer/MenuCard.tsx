import { Heart, Plus } from 'lucide-react'
import type { MenuItem } from '../../types'
import { formatCurrency } from '../../utils/format'
import { cn } from '../../utils/classNames'
import { COLORS } from '../../styles/theme'

export function MenuCard({
  item,
  favorite,
  onToggleFavorite,
  onAdd,
  onQuickView,
}: {
  item: MenuItem
  favorite: boolean
  onToggleFavorite: () => void
  onAdd: () => void
  onQuickView: () => void
}) {
  const low = item.currentStock > 0 && item.currentStock < 10

  return (
    <article
      className="menu-card flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm"
      style={{ borderColor: COLORS.border }}
    >
      <button
        type="button"
        className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-deus-bg to-white text-left"
        onClick={onQuickView}
        aria-label={`Quick view ${item.itemName}`}
      >
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : null}
        <span
          className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase text-white"
          style={{
            background:
              item.destinationStation === 'BAR' ? 'linear-gradient(135deg,#0288D1,#1565C0)' : COLORS.secondary,
          }}
        >
          {item.destinationStation}
        </span>
        {low && (
          <span className="absolute bottom-2 left-2 rounded-full bg-deus-danger/90 px-2 py-0.5 text-[10px] font-medium text-white">
            Only {item.currentStock} left
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-deus-text">{item.itemName}</p>
            <p className="mt-1 line-clamp-2 text-xs text-deus-muted">{item.description ?? ''}</p>
          </div>
          <button
            type="button"
            className={cn('rounded-full p-1.5 transition', favorite ? 'text-deus-danger' : 'text-deus-muted')}
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('h-5 w-5', favorite && 'fill-current')} />
          </button>
        </div>
        {item.containsAllergens ? (
          <p className="mt-1 text-[10px] text-deus-warning">Allergens: {item.containsAllergens}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="font-display text-lg" style={{ color: COLORS.primary }}>
            {formatCurrency(item.price)}
          </p>
          <button
            type="button"
            disabled={!item.isAvailable || item.currentStock <= 0}
            className="btn-press flex h-10 w-10 items-center justify-center rounded-full bg-deus-primary text-white shadow-md disabled:cursor-not-allowed disabled:opacity-40"
            onClick={(e) => {
              e.stopPropagation()
              onAdd()
            }}
            aria-label={`Add ${item.itemName}`}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  )
}
