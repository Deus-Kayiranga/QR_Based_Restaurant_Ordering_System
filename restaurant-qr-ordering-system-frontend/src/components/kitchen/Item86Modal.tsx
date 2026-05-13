import { Modal } from '../common/Modal'

export function Item86Modal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Modal open={open} title="86 item?" onClose={onClose}>
      <p className="text-sm text-deus-muted">Mark this item unavailable for this service period.</p>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="rounded-lg bg-deus-danger px-3 py-2 text-sm text-white"
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          Confirm
        </button>
      </div>
    </Modal>
  )
}
