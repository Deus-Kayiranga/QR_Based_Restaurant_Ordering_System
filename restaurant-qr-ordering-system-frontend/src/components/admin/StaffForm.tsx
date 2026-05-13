import type { RegisterRequest } from '../../types'

export function StaffForm({
  value,
  onChange,
}: {
  value: RegisterRequest
  onChange: (next: RegisterRequest) => void
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <label className="text-sm text-deus-muted">
        First name
        <input
          className="mt-1 w-full rounded-lg border border-deus-border px-3 py-2"
          value={value.firstName}
          onChange={(e) => onChange({ ...value, firstName: e.target.value })}
        />
      </label>
      <label className="text-sm text-deus-muted">
        Last name
        <input
          className="mt-1 w-full rounded-lg border border-deus-border px-3 py-2"
          value={value.lastName}
          onChange={(e) => onChange({ ...value, lastName: e.target.value })}
        />
      </label>
      <label className="text-sm text-deus-muted md:col-span-2">
        Email
        <input
          type="email"
          className="mt-1 w-full rounded-lg border border-deus-border px-3 py-2"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
        />
      </label>
      <label className="text-sm text-deus-muted">
        Phone
        <input
          className="mt-1 w-full rounded-lg border border-deus-border px-3 py-2"
          value={value.phoneNumber ?? ''}
          onChange={(e) => onChange({ ...value, phoneNumber: e.target.value })}
        />
      </label>
      <label className="text-sm text-deus-muted">
        Role
        <select
          className="mt-1 w-full rounded-lg border border-deus-border px-3 py-2"
          value={value.role}
          onChange={(e) => onChange({ ...value, role: e.target.value as RegisterRequest['role'] })}
        >
          {['MANAGER', 'WAITER', 'CASHIER', 'KITCHEN_STAFF', 'BAR_STAFF'].map((r) => (
            <option key={r} value={r}>
              {r.replace('_', ' ')}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-deus-muted md:col-span-2">
        Temporary password
        <input
          type="password"
          className="mt-1 w-full rounded-lg border border-deus-border px-3 py-2"
          value={value.password}
          onChange={(e) => onChange({ ...value, password: e.target.value })}
        />
      </label>
    </div>
  )
}
