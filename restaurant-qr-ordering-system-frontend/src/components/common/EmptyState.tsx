export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-deus-border bg-white px-6 py-12 text-center">
      <p className="font-display text-lg text-deus-text">{title}</p>
      {hint && <p className="mt-2 text-sm text-deus-muted">{hint}</p>}
    </div>
  )
}
