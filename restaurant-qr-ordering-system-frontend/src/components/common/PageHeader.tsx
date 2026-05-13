import type { ReactNode } from 'react'

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-deus-text">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-deus-muted">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}
