export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  profile_picture_url?: string
  created_at: string
  timezone: string
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  full_name?: string
}

