import { create } from 'zustand'
import { User } from '../types'

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}))
