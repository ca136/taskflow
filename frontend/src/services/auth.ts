import client from '@/api/client'
import type { LoginRequest, RegisterRequest, TokenResponse, User } from '@/types'

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const response = await client.post<TokenResponse>('/auth/login', data)
  return response.data
}

export async function register(data: RegisterRequest): Promise<User> {
  const response = await client.post<User>('/auth/register', data)
  return response.data
}

export async function getCurrentUser(): Promise<User> {
  const response = await client.get<User>('/users/me')
  return response.data
}
