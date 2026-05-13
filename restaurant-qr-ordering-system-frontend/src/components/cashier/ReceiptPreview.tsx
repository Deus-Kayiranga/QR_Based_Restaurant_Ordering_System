export function ReceiptPreview({ lines }: { lines: string[] }) {
  return (
    <pre className="rounded-xl border border-deus-border bg-deus-bg p-4 font-mono text-xs text-deus-text">
      {lines.join('\n')}
    </pre>
  )
}
