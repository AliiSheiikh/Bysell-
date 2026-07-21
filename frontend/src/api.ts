import { getToken } from './auth'
import type { Category, Item, LoginResponse } from './types'

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

export interface ItemFilters {
  keyword?: string
  category?: Category
  minPrice?: number
  maxPrice?: number
}

export function getItems(filters: ItemFilters = {}): Promise<Item[]> {
  const params = new URLSearchParams()
  if (filters.keyword) params.set('keyword', filters.keyword)
  if (filters.category) params.set('category', filters.category)
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))

  const query = params.toString()
  return fetch(`${BASE}/items${query ? `?${query}` : ''}`).then((response) => handle<Item[]>(response))
}

interface CreateItemData {
  title: string
  description: string | null
  price: number
  category: Category
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
