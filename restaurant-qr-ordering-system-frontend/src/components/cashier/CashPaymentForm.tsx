export function CashPaymentForm({
  total,
  tendered,
  onTendered,
  onSubmit,
}: {
  total: number
  tendered: string
  onTendered: (v: string) => void
  onSubmit: () => void
}) {
  const change = Math.max(0, Number(tendered || 0) - total)
  return (
    <div className="space-y-3">
      <label className="text-sm text-deus-muted">
        Amount tendered
        <input
          className="mt-1 w-full rounded-lg border border-deus-border px-3 py-2"
          value={tendered}
          onChange={(e) => onTendered(e.target.value)}
          inputMode="decimal"
        />
      </label>
      <p className="text-sm text-deus-muted">Change: {change.toFixed(0)} RWF</p>
      <button type="button" className="w-full rounded-xl bg-deus-primary py-3 text-white" onClick={onSubmit}>
        Confirm cash
      </button>
    </div>
  )
}
