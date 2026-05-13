import { Outlet } from 'react-router-dom'
import { ProtectedRoute as Guard } from '../components/common/ProtectedRoute'

export function ProtectedRoute() {
  return (
    <Guard>
      <Outlet />
    </Guard>
  )
}
