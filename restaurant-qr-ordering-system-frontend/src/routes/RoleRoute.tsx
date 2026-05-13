import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types'

export function RoleRoute({ roles }: { roles: UserRole[] }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div className="p-8 text-center text-deus-muted">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to="/unauthorized" replace />
  return <Outlet />
}
