import { create } from 'zustand'
import { User } from '../types'

interface AuthState {
  user: User | null
  isLoading: boolean
  token: string | null
  refreshToken: string | null

  // State setters
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setToken: (token: string | null) => void
  setRefreshToken: (refreshToken: string | null) => void

  // Auth actions
  logout: () => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isLoading: false,
  token: localStorage.getItem('auth_token'),
  refreshToken: localStorage.getItem('refresh_token'),

  // State setters
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
    set({ token })
  },
  setRefreshToken: (refreshToken) => {
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
    } else {
      localStorage.removeItem('refresh_token')
    }
    set({ refreshToken })
  },

  // Auth actions
  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, token: null, refreshToken: null })
  },
  clearAuth: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, token: null, refreshToken: null, isLoading: false })
  },
}))
