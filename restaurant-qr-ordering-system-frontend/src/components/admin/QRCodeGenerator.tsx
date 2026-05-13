export function QRCodeGenerator({ payload }: { payload: string | null }) {
  if (!payload) return <p className="text-sm text-deus-muted">Generate a QR from table management.</p>
  return (
    <div className="rounded-xl border border-deus-border bg-deus-bg p-4 text-center text-sm break-all">
      {payload}
    </div>
  )
}
