import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        style={{ boxShadow: '0 20px 60px rgb(44 24 16 / 0.20)' }}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-xl text-deus-text">{title}</h2>
          <button type="button" className="rounded-full p-1 hover:bg-deus-bg" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
