import type { TableResponse } from '../../types'
import { StatusBadge } from '../common/StatusBadge'

export function TableCard({ table, onSelect }: { table: TableResponse; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="rounded-2xl border border-deus-border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5"
    >
      <p className="font-display text-xl text-deus-text">T-{table.tableNumber}</p>
      <p className="text-xs text-deus-muted">{table.section}</p>
      <div className="mt-3">
        <StatusBadge status={String(table.status)} />
      </div>
    </button>
  )
}
