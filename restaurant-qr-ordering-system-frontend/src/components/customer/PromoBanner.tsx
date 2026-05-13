import { MOCK_PROMOS } from '../../utils/mockData'

export function PromoBanner({ index }: { index: number }) {
  const p = MOCK_PROMOS[index % MOCK_PROMOS.length]
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 text-white shadow-md"
      style={{ background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
    >
      <p className="text-xs uppercase tracking-wide text-white/80">{p.title}</p>
      <p className="font-display text-2xl">{p.sub}</p>
      <p className="mt-2 max-w-xl text-sm text-white/90">{p.body}</p>
    </div>
  )
}
