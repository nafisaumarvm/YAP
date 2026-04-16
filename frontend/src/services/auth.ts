import api from './api'
import type { AuthResponse, RegisterData, User } from '../types'

interface LoginPayload {
  email: string
  password: string
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/login', payload)
  return data
}

export async function registerRequest(payload: RegisterData): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/register', payload)
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/api/users/me')
  return data
}

