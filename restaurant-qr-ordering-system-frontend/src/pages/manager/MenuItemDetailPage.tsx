import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { menuApi } from '../../api/menu'
import { PageHeader } from '../../components/common/PageHeader'
import { formatCurrency } from '../../utils/format'

export function MenuItemDetailPage() {
  const { id } = useParams()
  const itemId = Number(id)
  const { data } = useQuery({
    queryKey: ['menu', 'item', itemId],
    queryFn: () => menuApi.getItem(itemId),
    enabled: Number.isFinite(itemId),
  })

  return (
    <div>
      <PageHeader title={data?.itemName ?? 'Menu item'} />
      {data && (
        <div className="rounded-2xl border border-deus-border bg-white p-6">
          <p className="text-deus-muted">{data.description}</p>
          <p className="mt-4 font-display text-2xl text-deus-primary">{formatCurrency(Number(data.price))}</p>
        </div>
      )}
      <Link to="/manager/menu" className="mt-4 inline-block text-deus-primary underline">
        Back to menu
      </Link>
    </div>
  )
}
