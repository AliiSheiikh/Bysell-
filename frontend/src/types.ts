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
  ownerId: number
  createdAt: string
}

export interface LoginResponse {
  token: string
  userId: number
  firstName: string
  email: string
}
