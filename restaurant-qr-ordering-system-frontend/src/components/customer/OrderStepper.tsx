const steps = ['Menu', 'Cart', 'Track', 'Pay']

export function OrderStepper({ step }: { step: number }) {
  return (
    <ol className="flex items-center justify-between gap-1 text-[11px] text-deus-muted md:text-xs">
      {steps.map((label, i) => (
        <li
          key={label}
          className={`flex-1 text-center ${i <= step ? 'font-semibold text-deus-primary' : ''}`}
        >
          {label}
        </li>
      ))}
    </ol>
  )
}
