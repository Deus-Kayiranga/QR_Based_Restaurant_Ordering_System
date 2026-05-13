export function MoMoPaymentForm({
  phone,
  onPhone,
  onSubmit,
}: {
  phone: string
  onPhone: (v: string) => void
  onSubmit: () => void
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm text-deus-muted">
        MTN MoMo number
        <input
          className="mt-1 w-full rounded-lg border border-deus-border px-3 py-2"
          value={phone}
          onChange={(e) => onPhone(e.target.value)}
        />
      </label>
      <button type="button" className="w-full rounded-xl bg-amber-600 py-3 text-white" onClick={onSubmit}>
        Charge MoMo
      </button>
    </div>
  )
}
