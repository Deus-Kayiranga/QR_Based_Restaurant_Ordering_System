import type { RestaurantTable } from '../../types'

export function TableForm({
  value,
  onChange,
}: {
  value: Partial<RestaurantTable>
  onChange: (v: Partial<RestaurantTable>) => void
}) {
  return (
    <div className="grid gap-3">
      <label className="text-sm text-deus-muted">
        Table number
        <input
          className="mt-1 w-full rounded-lg border border-deus-border px-3 py-2"
          value={value.tableNumber}
          onChange={(e) => onChange({ ...value, tableNumber: e.target.value })}
        />
      </label>
      <label className="text-sm text-deus-muted">
        Section
        <input
          className="mt-1 w-full rounded-lg border border-deus-border px-3 py-2"
          value={value.section ?? ''}
          onChange={(e) => onChange({ ...value, section: e.target.value })}
        />
      </label>
      <label className="text-sm text-deus-muted">
        Seats
        <input
          type="number"
          min={1}
          className="mt-1 w-full rounded-lg border border-deus-border px-3 py-2"
          value={value.seatingCapacity}
          onChange={(e) => onChange({ ...value, seatingCapacity: Number(e.target.value) })}
        />
      </label>
    </div>
  )
}
