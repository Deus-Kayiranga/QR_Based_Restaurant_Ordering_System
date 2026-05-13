import { Link } from 'react-router-dom'

export function ServerErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-deus-bg px-4">
      <p className="font-display text-3xl text-deus-text">Something went wrong</p>
      <Link className="mt-4 text-deus-primary underline" to="/login">
        Home
      </Link>
    </div>
  )
}
