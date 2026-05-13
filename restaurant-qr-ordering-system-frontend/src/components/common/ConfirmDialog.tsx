import type { ReactNode } from 'react'
import { Modal } from './Modal'

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  danger,
}: {
  open: boolean
  title: string
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
  danger?: boolean
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      {children}
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          className="rounded-lg border border-deus-border px-4 py-2 text-sm"
          onClick={onClose}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`rounded-lg px-4 py-2 text-sm text-white ${
            danger ? 'bg-deus-danger' : 'bg-deus-primary'
          }`}
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
