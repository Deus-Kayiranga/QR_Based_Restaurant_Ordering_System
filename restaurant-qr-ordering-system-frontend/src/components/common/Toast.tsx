import { useEffect } from 'react'

export function Toast({
  message,
  onDone,
}: {
  message: string | null
  onDone: () => void
}) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [message, onDone])

  if (!message) return null
  return (
    <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-deus-text px-5 py-2 text-sm text-white shadow-lg">
      {message}
    </div>
  )
}
