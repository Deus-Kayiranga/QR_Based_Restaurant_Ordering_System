import type { LucideIcon } from 'lucide-react'

export function StatsCard({
  label,
  value,
  icon: Icon,
  tone = 'primary',
}: {
  label: string
  value: string | number
  icon: LucideIcon
  tone?: 'primary' | 'success' | 'warning'
}) {
  const ring =
    tone === 'success'
      ? 'text-deus-success'
      : tone === 'warning'
        ? 'text-deus-warning'
        : 'text-deus-primary'
  return (
    <div className="rounded-2xl border border-deus-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-deus-muted">{label}</p>
          <p className="mt-1 font-display text-2xl text-deus-text">{value}</p>
        </div>
        <div className={`rounded-xl bg-deus-bg p-2 ${ring}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
