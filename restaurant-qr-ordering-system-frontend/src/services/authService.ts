import type { AuthResponse, UserResponse } from '../types'
import { localStorageService } from './localStorageService'

export const authService = {
  persistSession(auth: AuthResponse) {
    localStorageService.setAccessToken(auth.token)
    const snapshot: UserResponse = {
      userId: auth.userId,
      email: auth.email,
      firstName: auth.firstName,
      lastName: auth.lastName,
      role: auth.role,
      isActive: true,
    } as any
    localStorageService.setUserSnapshot(JSON.stringify(snapshot))
  },
  clearSession() {
    localStorageService.clearAuth()
  },
  setUserSnapshot(user: UserResponse) {
    localStorageService.setUserSnapshot(JSON.stringify(user))
  },
  readSnapshot(): UserResponse | null {
    const raw = localStorageService.getUserSnapshot()
    if (!raw) return null
    try {
      return JSON.parse(raw) as UserResponse
    } catch {
      return null
    }
  },
}
