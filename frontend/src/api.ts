import { getToken } from './auth'
import type { Category, Item, ItemDetail, ItemImage, LoginResponse } from './types'

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

export function getItem(id: number): Promise<ItemDetail> {
  return fetch(`${BASE}/items/${id}`).then((response) => handle<ItemDetail>(response))
}

export function getMyItems(): Promise<Item[]> {
  return fetch(`${BASE}/items/mine`, { headers: authHeaders() }).then((response) => handle<Item[]>(response))
}

export function deleteItem(id: number): Promise<void> {
  return fetch(`${BASE}/items/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(async (response) => {
    if (!response.ok) {
      const body = await response.text()
      throw new Error(`${response.status} ${response.statusText}: ${body}`)
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
      const body = await response.text()
      throw new Error(`${response.status} ${response.statusText}: ${body}`)
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
