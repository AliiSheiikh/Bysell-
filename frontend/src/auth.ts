const TOKEN_KEY = 'bysell_token'
const USER_ID_KEY = 'bysell_user_id'

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveUserId(userId: number): void {
  localStorage.setItem(USER_ID_KEY, String(userId))
}

export function getUserId(): number | null {
  const value = localStorage.getItem(USER_ID_KEY)
  return value ? Number(value) : null
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_ID_KEY)
}

export function isLoggedIn(): boolean {
  return getToken() !== null
}
