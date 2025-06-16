export type AuthUser = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  isVerified: boolean
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

export type RegisterInput = {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export type LoginInput = {
  email: string
  password: string
}

export type ResetPasswordInput = {
  token: string
  password: string
}

export type AuthResponse = {
  user: AuthUser | null
  error?: string
}

export type VerificationToken = {
  id: string
  userId: string
  token: string
  type: 'email' | 'password_reset'
  expiresAt: string
  createdAt: string
} 