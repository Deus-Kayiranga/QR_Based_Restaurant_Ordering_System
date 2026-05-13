export function MobileHeader({ title }: { title: string }) {
  return (
    <div className="sticky top-0 z-30 border-b border-deus-border bg-white/95 px-4 py-3 backdrop-blur md:hidden">
      <h1 className="font-display text-lg font-semibold text-deus-text">{title}</h1>
    </div>
  )
}
