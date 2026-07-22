export const CATEGORIES = [
  'TEXTBOOKS',
  'ELECTRONICS',
  'FURNITURE',
  'CLOTHING',
  'TICKETS',
  'HOUSING',
  'OTHER',
] as const

export type Category = (typeof CATEGORIES)[number]

export function formatLabel(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase()
}

export interface Item {
  id: number
  title: string
  description: string | null
  price: number
  status: string
  category: Category | null
  mainImageUrl: string | null
  ownerId: number
  createdAt: string
}

export interface ItemImage {
  id: number
  imageUrl: string
}

export interface ItemDetail {
  id: number
  title: string
  description: string | null
  price: number
  status: string
  category: Category | null
  images: ItemImage[]
  ownerId: number
  sellerName: string
  sellerEmail: string
  createdAt: string
}

export interface LoginResponse {
  token: string
  userId: number
  firstName: string
  email: string
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface UserProfile {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string | null
  createdAt: string
}
