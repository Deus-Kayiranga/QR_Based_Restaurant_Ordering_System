const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export const localStorageService = {
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  setAccessToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  clearAuth() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
  setUserSnapshot(json: string) {
    localStorage.setItem(USER_KEY, json)
  },
  getUserSnapshot(): string | null {
    return localStorage.getItem(USER_KEY)
  },
}
