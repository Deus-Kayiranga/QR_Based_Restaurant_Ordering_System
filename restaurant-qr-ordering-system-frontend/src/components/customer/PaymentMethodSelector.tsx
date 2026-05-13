import { cn } from '../../utils/classNames'

const methods = [
  { id: 'CASH', label: 'Cash at counter' },
  { id: 'MOMO', label: 'MTN MoMo' },
  { id: 'AIRTEL', label: 'Airtel Money' },
] as const

export function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div className="grid gap-2">
      {methods.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={cn(
            'rounded-xl border px-4 py-3 text-left text-sm',
            value === m.id ? 'border-deus-primary bg-deus-bg' : 'border-deus-border bg-white',
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
