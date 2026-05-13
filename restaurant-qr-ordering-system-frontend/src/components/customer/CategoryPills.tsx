import { cn } from '../../utils/classNames'

export function CategoryPills({
  labels,
  active,
  onChange,
}: {
  labels: string[]
  active: string
  onChange: (label: string) => void
}) {
  return (
    <div className="scroll-hide flex gap-2 overflow-x-auto pb-1">
      {labels.map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(label)}
          className={cn(
            'whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition',
            active === label
              ? 'border-deus-primary bg-deus-primary text-white shadow'
              : 'border-deus-border bg-white text-deus-text hover:bg-deus-bg',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
