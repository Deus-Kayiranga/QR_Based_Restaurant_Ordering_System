import type { UserResponse } from '../../types'
import { DataTable, type Column } from '../common/DataTable'
import { StatusBadge } from '../common/StatusBadge'

export function StaffTable({
  users,
  onDeactivate,
}: {
  users: UserResponse[]
  onDeactivate: (id: number) => void
}) {
  const columns: Column<UserResponse>[] = [
    { key: 'n', header: 'Name', render: (u) => `${u.firstName} ${u.lastName}` },
    { key: 'e', header: 'Email', render: (u) => u.email },
    { key: 'r', header: 'Role', render: (u) => u.role },
    {
      key: 'a',
      header: 'Status',
      render: (u) => <StatusBadge status={u.isActive ? 'AVAILABLE' : 'CANCELLED'} />,
    },
    {
      key: 'x',
      header: '',
      render: (u) => (
        <button
          type="button"
          className="text-xs text-deus-danger hover:underline"
          disabled={!u.isActive}
          onClick={() => onDeactivate(u.userId)}
        >
          Deactivate
        </button>
      ),
    },
  ]
  return <DataTable columns={columns} rows={users} rowKey={(u) => String(u.userId)} />
}
