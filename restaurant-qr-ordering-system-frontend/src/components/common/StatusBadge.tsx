import { cn } from '../../utils/classNames'

const tone: Record<string, string> = {
  PLACED: 'bg-amber-100 text-amber-900',
  PREPARING: 'bg-orange-100 text-orange-900',
  READY: 'bg-emerald-100 text-emerald-900',
  COMPLETED: 'bg-slate-100 text-slate-800',
  CANCELLED: 'bg-red-100 text-red-800',
  AVAILABLE: 'bg-emerald-50 text-emerald-800',
  OCCUPIED: 'bg-rose-50 text-rose-800',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        tone[status] ?? 'bg-deus-bg text-deus-text',
      )}
    >
      {status.toLowerCase().replace(/_/g, ' ')}
    </span>
  )
}
