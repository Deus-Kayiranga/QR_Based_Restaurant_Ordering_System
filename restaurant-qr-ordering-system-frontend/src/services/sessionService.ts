const SESSION = 'deus_table_session'

export type TableSessionPayload = {
  sessionToken: string
  tableNumber: string
  tableId?: number
  customerCount?: number
}

export const sessionService = {
  get(): TableSessionPayload | null {
    const raw = sessionStorage.getItem(SESSION)
    if (!raw) return null
    try {
      return JSON.parse(raw) as TableSessionPayload
    } catch {
      return null
    }
  },
  set(payload: TableSessionPayload) {
    sessionStorage.setItem(SESSION, JSON.stringify(payload))
  },
  clear() {
    sessionStorage.removeItem(SESSION)
  },
}
