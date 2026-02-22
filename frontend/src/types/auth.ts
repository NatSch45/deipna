export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type UserRole = 'CUSTOMER' | 'RESTAURANT_OWNER' | 'ADMIN'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role?: UserRole
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
}
