import { useQuery } from '@tanstack/react-query'
import { staffApi } from '../../api/staff'
import { PageHeader } from '../../components/common/PageHeader'
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton'

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'kitchen'],
    queryFn: () => staffApi.getKitchenStats(),
  })

  if (isLoading) return <LoadingSkeleton className="h-32" />

  return (
    <div>
      <PageHeader title="Kitchen & bar overview" />
      <pre className="rounded-2xl border border-deus-border bg-white p-4 text-xs">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default DashboardPage
