import { getToken } from './auth'
import type { Category, Item, ItemDetail, ItemImage, LoginResponse, PagedResponse, UserProfile } from './types'

const BASE = '/api'

async function extractErrorMessage(response: Response): Promise<string> {
  const body = await response.text()
  try {
    const parsed = JSON.parse(body)
    if (parsed && typeof parsed.message === 'string' && parsed.message.length > 0) {
      return parsed.message
    }
  } catch {
    // not JSON, fall through to raw body
  }
  return body || `${response.status} ${response.statusText}`
}

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response))
  }
  return response.json()
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export type SortBy = 'newest' | 'oldest' | 'price_asc' | 'price_desc'

export interface ItemFilters {
  keyword?: string
  category?: Category
  minPrice?: number
  maxPrice?: number
  sortBy?: SortBy
  page?: number
  size?: number
}

export function getItems(filters: ItemFilters = {}): Promise<PagedResponse<Item>> {
  const params = new URLSearchParams()
  if (filters.keyword) params.set('keyword', filters.keyword)
  if (filters.category) params.set('category', filters.category)
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
  if (filters.sortBy) params.set('sortBy', filters.sortBy)
  if (filters.page !== undefined) params.set('page', String(filters.page))
  if (filters.size !== undefined) params.set('size', String(filters.size))

  const query = params.toString()
  return fetch(`${BASE}/items${query ? `?${query}` : ''}`).then((response) => handle<PagedResponse<Item>>(response))
}

export function getItem(id: number): Promise<ItemDetail> {
  return fetch(`${BASE}/items/${id}`).then((response) => handle<ItemDetail>(response))
}

export function getMyItems(page = 0, size = 20): Promise<PagedResponse<Item>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  return fetch(`${BASE}/items/mine?${params.toString()}`, { headers: authHeaders() })
    .then((response) => handle<PagedResponse<Item>>(response))
}

export function deleteItem(id: number): Promise<void> {
  return fetch(`${BASE}/items/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(await extractErrorMessage(response))
    }
  })
}

interface CreateItemData {
  title: string
  description: string | null
  price: number
  category: Category
}

interface UpdateItemData {
  title: string
  description: string | null
  price: number
  category: Category
}

export function updateItem(id: number, data: UpdateItemData): Promise<Item> {
  return fetch(`${BASE}/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  }).then((response) => handle<Item>(response))
}

export function addItemImage(itemId: number, image: File): Promise<ItemImage> {
  const formData = new FormData()
  formData.append('file', image)

  return fetch(`${BASE}/items/${itemId}/images`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  }).then((response) => handle<ItemImage>(response))
}

export function removeItemImage(itemId: number, imageId: number): Promise<void> {
  return fetch(`${BASE}/items/${itemId}/images/${imageId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(await extractErrorMessage(response))
    }
  })
}

export function createItem(data: CreateItemData, images: File[]): Promise<Item> {
  const formData = new FormData()
  formData.append('item', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  images.forEach((image) => formData.append('images', image))

  return fetch(`${BASE}/items`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
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

export function getMe(): Promise<UserProfile> {
  return fetch(`${BASE}/auth/me`, { headers: authHeaders() }).then((response) => handle<UserProfile>(response))
}

interface UpdateUserData {
  firstName: string
  lastName: string
  phoneNumber: string | null
}

export function updateUser(id: number, data: UpdateUserData): Promise<UserProfile> {
  return fetch(`${BASE}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  }).then((response) => handle<UserProfile>(response))
}

export function changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
  return fetch(`${BASE}/users/${id}/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ currentPassword, newPassword }),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(await extractErrorMessage(response))
    }
  })
}

export function deleteUser(id: number): Promise<void> {
  return fetch(`${BASE}/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(await extractErrorMessage(response))
    }
  })
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
