import type { TableResponse } from '../../types'
import { TableCard } from './TableCard'

export function TableGrid({ tables, onSelect }: { tables: TableResponse[]; onSelect: (t: TableResponse) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tables.map((t) => (
        <TableCard key={t.tableId} table={t} onSelect={() => onSelect(t)} />
      ))}
    </div>
  )
}
