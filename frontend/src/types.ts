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

export interface ItemDetail {
  id: number
  title: string
  description: string | null
  price: number
  status: string
  category: Category | null
  imageUrls: string[]
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
