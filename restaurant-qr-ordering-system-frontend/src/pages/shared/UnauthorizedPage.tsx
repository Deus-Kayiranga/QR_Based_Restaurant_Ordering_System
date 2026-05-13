import { Link } from 'react-router-dom'

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-deus-bg px-4 text-center">
      <p className="font-display text-3xl text-deus-text">Unauthorized</p>
      <p className="mt-2 text-sm text-deus-muted">You do not have access to this area.</p>
      <Link className="mt-6 text-deus-primary underline" to="/login">
        Sign in
      </Link>
    </div>
  )
}
