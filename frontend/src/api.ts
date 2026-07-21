import { getToken } from './auth'
import type { Item, LoginResponse } from './types'

const BASE = '/api'

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${body}`)
  }
  return response.json()
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function getItems(): Promise<Item[]> {
  return fetch(`${BASE}/items`).then((response) => handle<Item[]>(response))
}

interface CreateItemData {
  title: string
  description: string | null
  price: number
}

export function createItem(data: CreateItemData): Promise<Item> {
  return fetch(`${BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  }).then((response) => handle<Item>(response))
}

interface LoginData {
  email: string
  password: string
}

export function login(data: LoginData): Promise<LoginResponse> {
  return fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((response) => handle<LoginResponse>(response))
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export function register(data: RegisterData): Promise<unknown> {
  return fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((response) => handle(response))
}
