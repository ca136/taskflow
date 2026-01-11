import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { apiClient } from '../../services/apiClient'
import { useAuthStore } from '../../stores/authStore'
import { User, ApiResponse } from '../../types'

/**
 * API request/response types for authentication
 */
interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  token: string
  refreshToken?: string
}

interface RegisterRequest {
  email: string
  password: string
  name: string
}

interface RegisterResponse {
  user: User
  token: string
  refreshToken?: string
}

interface CurrentUserResponse {
  user: User
}

/**
 * Query key constants for React Query
 */
export const authQueryKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authQueryKeys.all, 'currentUser'] as const,
  login: () => [...authQueryKeys.all, 'login'] as const,
  register: () => [...authQueryKeys.all, 'register'] as const,
  logout: () => [...authQueryKeys.all, 'logout'] as const,
}

/**
 * useLogin - Mutation hook for user login
 * Handles authentication and stores tokens and user data
 */
export function useLogin() {
  const queryClient = useQueryClient()
  const { setUser, setLoading } = useAuthStore()

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
      return response.data
    },
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (data) => {
      // Store token
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
      }
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken)
      }

      // Update auth store
      setUser(data.user)

      // Invalidate queries to refetch with new auth
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser() })
    },
    onError: (error: unknown) => {
      // Error handling is done by apiClient interceptors
      console.error('Login error:', error)
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

/**
 * useRegister - Mutation hook for user registration
 * Creates new user account and handles initial authentication
 */
export function useRegister() {
  const queryClient = useQueryClient()
  const { setUser, setLoading } = useAuthStore()

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await apiClient.post<RegisterResponse>('/auth/register', data)
      return response.data
    },
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (data) => {
      // Store token
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
      }
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken)
      }

      // Update auth store
      setUser(data.user)

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser() })
    },
    onError: (error: unknown) => {
      console.error('Registration error:', error)
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

/**
 * useLogout - Mutation hook for user logout
 * Clears authentication tokens and user data
 */
export function useLogout() {
  const queryClient = useQueryClient()
  const { logout, setLoading } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      try {
        // Call logout endpoint on backend (optional)
        await apiClient.post('/auth/logout', {})
      } catch (error) {
        // Continue logout even if API call fails
        console.warn('Logout API call failed:', error)
      }
    },
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')

      // Clear user from store
      logout()

      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: authQueryKeys.all })
    },
    onError: (error: unknown) => {
      console.error('Logout error:', error)
      // Still clear local state even if logout endpoint fails
      logout()
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

/**
 * useCurrentUser - Query hook for fetching current authenticated user
 * Automatically called when user is logged in
 */
export function useCurrentUser(enabled: boolean = true) {
  const { setUser, setLoading } = useAuthStore()
  const hasToken = !!localStorage.getItem('auth_token')

  const query = useQuery({
    queryKey: authQueryKeys.currentUser(),
    queryFn: async () => {
      const response = await apiClient.get<CurrentUserResponse>('/auth/me')
      return response.data.user
    },
    enabled: enabled && hasToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
  })

  // Handle success and error side effects
  useEffect(() => {
    if (query.data) {
      setUser(query.data)
      setLoading(false)
    }
  }, [query.data, setUser, setLoading])

  useEffect(() => {
    if (query.isError) {
      // Clear invalid token
      localStorage.removeItem('auth_token')
      setUser(null)
      setLoading(false)
    }
  }, [query.isError, setUser, setLoading])

  return query
}

/**
 * Helper hook to combine auth operations
 * Useful for components that need access to all auth operations
 */
export function useAuth() {
  const login = useLogin()
  const register = useRegister()
  const logout = useLogout()
  const currentUser = useCurrentUser()
  const { user, isLoading } = useAuthStore()

  return {
    // State
    user,
    isLoading,
    isAuthenticated: !!user,

    // Login
    login: login.mutate,
    loginAsync: login.mutateAsync,
    isLoggingIn: login.isPending,
    loginError: login.error,

    // Register
    register: register.mutate,
    registerAsync: register.mutateAsync,
    isRegistering: register.isPending,
    registerError: register.error,

    // Logout
    logout: logout.mutate,
    logoutAsync: logout.mutateAsync,
    isLoggingOut: logout.isPending,
    logoutError: logout.error,

    // Current user query
    currentUserData: currentUser.data,
    isLoadingCurrentUser: currentUser.isLoading,
    currentUserError: currentUser.error,
  }
}
