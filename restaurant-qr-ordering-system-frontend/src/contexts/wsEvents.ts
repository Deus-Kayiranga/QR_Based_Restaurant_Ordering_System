export const WS_UI_EVENT = 'deus-ws-notification'

export type WsUiPayload = {
  title: string
  message: string
  topic?: string
}

export function emitWsNotification(payload: WsUiPayload) {
  window.dispatchEvent(new CustomEvent(WS_UI_EVENT, { detail: payload }))
}
