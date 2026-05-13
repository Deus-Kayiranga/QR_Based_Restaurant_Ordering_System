import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { staffApi } from '../../api/staff'
import { PageHeader } from '../../components/common/PageHeader'

export function StaffDetailPage() {
  const { id } = useParams()
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: () => staffApi.getAllUsers() })
  const user = users?.find((u) => String(u.userId) === id)

  return (
    <div>
      <PageHeader title={user ? `${user.firstName} ${user.lastName}` : 'Staff detail'} />
      {!user ? (
        <p className="text-sm text-deus-muted">User not found.</p>
      ) : (
        <div className="rounded-2xl border border-deus-border bg-white p-4 text-sm">
          <p>{user.email}</p>
          <p className="text-deus-muted">{user.role}</p>
        </div>
      )}
      <Link to="/admin/staff" className="mt-4 inline-block text-deus-primary underline">
        Back
      </Link>
    </div>
  )
}
