/** Build customer entry URL for printed QR (table number + token from backend). */
export function buildCustomerMenuPath(tableNumber: string, token: string) {
  const q = new URLSearchParams({ token })
  return `/t/${encodeURIComponent(tableNumber)}?${q.toString()}`
}
