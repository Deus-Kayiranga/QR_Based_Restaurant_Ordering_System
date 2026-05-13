import type { ReactNode } from 'react'

export function BulkActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-deus-border bg-deus-bg px-3 py-2 text-sm">
      {children}
    </div>
  )
}
