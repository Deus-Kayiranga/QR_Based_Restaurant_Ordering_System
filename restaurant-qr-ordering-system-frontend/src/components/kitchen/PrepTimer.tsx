export function PrepTimer({ seconds }: { seconds: number }) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return (
    <span className="rounded-full bg-deus-bg px-2 py-0.5 font-mono text-xs text-deus-text">
      {m}:{s.toString().padStart(2, '0')}
    </span>
  )
}
