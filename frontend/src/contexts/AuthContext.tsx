import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { loginRequest, registerRequest, getMe } from '../services/auth'
import type { User, RegisterData } from '../types'

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ACCESS_TOKEN_KEY = 'yap_access_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Load user from existing token on first mount
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }

    ;(async () => {
      try {
        const me = await getMe()
        setUser(me)
      } catch {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      try {
        const { user: loggedInUser, access_token } = await loginRequest({
          email,
          password,
        })
        localStorage.setItem(ACCESS_TOKEN_KEY, access_token)
        setUser(loggedInUser)
        navigate('/', { replace: true })
      } finally {
        setIsLoading(false)
      }
    },
    [navigate],
  )

  const register = useCallback(
    async (data: RegisterData) => {
      setIsLoading(true)
      try {
        const { user: newUser, access_token } = await registerRequest(data)
        localStorage.setItem(ACCESS_TOKEN_KEY, access_token)
        setUser(newUser)
        navigate('/', { replace: true })
      } finally {
        setIsLoading(false)
      }
    },
    [navigate],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    setUser(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

