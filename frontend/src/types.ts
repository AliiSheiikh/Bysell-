export interface Item {
  id: number
  title: string
  description: string | null
  price: number
  status: string
  ownerId: number
  createdAt: string
}

export interface LoginResponse {
  token: string
  userId: number
  firstName: string
  email: string
}
