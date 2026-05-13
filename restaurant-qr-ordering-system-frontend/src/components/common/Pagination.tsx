export function Pagination({
  page,
  pageCount,
  onPrev,
  onNext,
}: {
  page: number
  pageCount: number
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="flex items-center justify-end gap-2 text-sm">
      <button
        type="button"
        className="rounded-lg border border-deus-border px-3 py-1 disabled:opacity-40"
        disabled={page <= 0}
        onClick={onPrev}
      >
        Prev
      </button>
      <span className="text-deus-muted">
        {page + 1} / {pageCount}
      </span>
      <button
        type="button"
        className="rounded-lg border border-deus-border px-3 py-1 disabled:opacity-40"
        disabled={page >= pageCount - 1}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  )
}
