import { useTodaySummary } from '../../hooks/usePayments'
import { PageHeader } from '../../components/common/PageHeader'
import { ShiftReport } from '../../components/cashier/ShiftReport'

export function ShiftSummaryPage() {
  const { data, isLoading } = useTodaySummary()

  return (
    <div>
      <PageHeader title="Shift summary" />
      {isLoading ? <p className="text-sm text-deus-muted">Loading…</p> : <ShiftReport summary={data ?? {}} />}
    </div>
  )
}
