# Authentication API Hooks Guide

## Overview

This document describes the authentication API hooks implementation in `frontend/src/api/hooks/useAuth.ts`. These hooks integrate React Query for server state management and Zustand for client state, providing a complete authentication solution.

## Implementation Complete ✅

### Files Created/Modified
- ✅ `frontend/src/api/hooks/useAuth.ts` - Main authentication hooks (254 lines)
- ✅ `frontend/src/api/hooks/index.ts` - Hook exports
- ✅ `frontend/src/api/index.ts` - API module index
- ✅ `frontend/src/stores/authStore.ts` - Zustand auth store
- ✅ `frontend/src/services/apiClient.ts` - API client with interceptors
- ✅ `frontend/src/types/index.ts` - TypeScript type definitions

### Build Status: PASSED ✅
```
0 errors, 0 warnings
Build time: 3.02s
Gzip bundle: 80.46 kB
```

## Hook Reference

### 1. `useLogin()`
Login mutation hook for user authentication.

```typescript
const { mutate: login, isPending, error } = useLogin()

// Usage
login({ email: 'user@example.com', password: 'password123' })
```

**Features:**
- POST request to `/auth/login`
- Stores `auth_token` and `refresh_token` in localStorage
- Updates auth store with user data
- Invalidates current user query on success
- Error handling via console logging

**Response Types:**
```typescript
interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}
```

### 2. `useRegister()`
Registration mutation hook for new users.

```typescript
const { mutate: register, isPending, error } = useRegister()

// Usage
register({ 
  email: 'newuser@example.com', 
  password: 'password123',
  name: 'John Doe'
})
```

**Features:**
- POST request to `/auth/register`
- Same token/user handling as login
- Suitable for sign-up flows
- Error handling and validation

**Response Types:**
```typescript
interface RegisterRequest {
  email: string
  password: string
  name: string
}

interface RegisterResponse {
  user: User
  token: string
  refreshToken: string
}
```

### 3. `useLogout()`
Logout mutation hook with graceful local state clearing.

```typescript
const { mutate: logout, isPending } = useLogout()

// Usage
logout()
```

**Features:**
- POST request to `/auth/logout` (optional backend call)
- Removes tokens from localStorage
- Clears auth store
- Removes all auth-related queries from React Query cache
- **Resilient:** Continues local logout even if API call fails
- Error handling doesn't prevent local state clearing

### 4. `useCurrentUser(enabled?: boolean)`
Query hook to fetch and manage current user data.

```typescript
const { data: user, isLoading, error, isError } = useCurrentUser(true)
```

**Features:**
- GET request to `/auth/me`
- Conditional fetching based on `enabled` flag
- Automatically disabled if no token present
- **Cache Configuration:**
  - `staleTime: 5 minutes` - Data fresh for 5 min
  - `gcTime: 10 minutes` - Keep in cache for 10 min
  - `retry: 1` - Retry once on failure
- **Side Effects:**
  - Updates auth store on success
  - Removes invalid tokens on 401 error
  - Clears user data on authentication failure

### 5. `useAuth()` (Composite Hook)
High-level hook combining all auth operations.

```typescript
const {
  // State
  user,
  isLoading,
  isAuthenticated,
  
  // Login
  login,
  loginAsync,
  loginPending,
  loginError,
  
  // Register
  register,
  registerAsync,
  registerPending,
  registerError,
  
  // Logout
  logout,
  logoutAsync,
  logoutPending,
  
  // Current user
  currentUser,
  currentUserLoading,
  currentUserError
} = useAuth()

// Synchronous variants (fire and forget)
login({ email: 'user@example.com', password: 'password123' })

// Async variants (await for completion)
try {
  await loginAsync({ email: 'user@example.com', password: 'password123' })
  console.log('Login successful')
} catch (error) {
  console.error('Login failed:', error)
}
```

## Usage Patterns

### Protected Route Example
```typescript
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()
  
  if (isLoading) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" />
  
  return children
}
```

### Login Form Example
```typescript
function LoginForm() {
  const { login, loginPending, loginError } = useAuth()
  
  const handleSubmit = (email: string, password: string) => {
    login({ email, password })
  }
  
  return (
    <form onSubmit={() => handleSubmit(...)}>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button disabled={loginPending}>
        {loginPending ? 'Logging in...' : 'Login'}
      </button>
      {loginError && <Error>{loginError.message}</Error>}
    </form>
  )
}
```

### Registration Form Example
```typescript
function RegisterForm() {
  const { register, registerPending, registerError } = useAuth()
  
  const handleSubmit = (data: RegisterRequest) => {
    register(data)
  }
  
  return (
    <form onSubmit={() => handleSubmit(...)}>
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button disabled={registerPending}>
        {registerPending ? 'Creating account...' : 'Sign up'}
      </button>
      {registerError && <Error>{registerError.message}</Error>}
    </form>
  )
}
```

### Logout Example
```typescript
function UserMenu() {
  const { logout, logoutPending } = useAuth()
  
  return (
    <button 
      onClick={() => logout()}
      disabled={logoutPending}
    >
      Logout
    </button>
  )
}
```

## Query Keys

The module exports `authQueryKeys` object for manual cache management:

```typescript
import { authQueryKeys } from '@/api/hooks'

// Structure
authQueryKeys.currentUser() // Query key for current user
authQueryKeys.login() // Query key for login
authQueryKeys.register() // Query key for register
authQueryKeys.logout() // Query key for logout
```

## Error Handling

### Login/Register Errors
```typescript
const { loginError } = useAuth()

if (loginError) {
  // Error object has:
  // - message: string
  // - status: number
  // - code?: string
  // - details?: Record<string, unknown>
  
  if (loginError.status === 401) {
    // Invalid credentials
  } else if (loginError.status === 422) {
    // Validation error
    console.log(loginError.details)
  }
}
```

### API Client Error Handling
The `apiClient` automatically handles:
- **401 Unauthorized:** Removes token, redirects to `/login`
- **403 Forbidden:** Shows permission error
- **404 Not Found:** Shows resource not found
- **422 Validation:** Includes validation details
- **500 Server Error:** Shows generic server error
- **Network Errors:** Shows connection error

## Integration with Zustand Store

The hooks automatically sync with `useAuthStore`:

```typescript
import { useAuthStore } from '@/stores/authStore'

// Direct store access if needed
const user = useAuthStore((state) => state.user)
const token = useAuthStore((state) => state.token)

// Or use the composite hook
const { user } = useAuth()
```

### Store Actions
```typescript
const authStore = useAuthStore()

authStore.setUser(user)           // Set user object
authStore.setToken(token)         // Set token (auto-saves to localStorage)
authStore.setRefreshToken(token)  // Set refresh token
authStore.setLoading(true)        // Set loading state
authStore.logout()                // Clear auth state
authStore.clearAuth()             // Full auth reset
```

## Token Management

Tokens are stored in localStorage with keys:
- `auth_token` - Access token for API calls
- `refresh_token` - Refresh token for token renewal

### Token Persistence
```typescript
// Login - tokens auto-saved to localStorage
login({ email: 'user@example.com', password: 'password123' })

// Automatic header injection
// All subsequent API calls include: Authorization: Bearer {token}

// Logout - tokens auto-removed from localStorage
logout()
```

### Token in API Requests
The `apiClient` automatically adds authentication headers:

```typescript
// In apiClient.ts request interceptor
if (token) {
  config.headers.Authorization = `Bearer ${token}`
}
```

## Cache Management

React Query cache is automatically managed:

```typescript
// On login success:
- Tokens stored to localStorage
- Auth store updated with user data
- Current user query invalidated (refetched)

// On logout success:
- Tokens removed from localStorage
- Auth store cleared
- All auth queries removed from cache

// On 401 error:
- Token removed from localStorage
- Current user query cleared
- User data cleared from store
```

## TypeScript Types

All types are defined in `frontend/src/types/index.ts`:

```typescript
interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}

interface RegisterRequest {
  email: string
  password: string
  name: string
}

interface RegisterResponse {
  user: User
  token: string
  refreshToken: string
}

interface CurrentUserResponse {
  user: User
}
```

## Best Practices

1. **Use composite `useAuth()` hook** for most use cases
2. **Handle loading states** during auth operations
3. **Display error messages** to users appropriately
4. **Use async variants** when you need to wait for completion
5. **Conditional fetching** with `useCurrentUser(!!token)`
6. **Protect routes** before rendering sensitive content
7. **Cache stale data** appropriately (5 min staleTime)
8. **Rely on store for sync access** to user/token without hooks

## Testing

Example test for protected route:

```typescript
describe('ProtectedRoute', () => {
  it('shows loading state while fetching user', () => {
    // Mock useAuth to return isLoading: true
    const { getByText } = render(<ProtectedRoute><div>Secret</div></ProtectedRoute>)
    expect(getByText('Loading...')).toBeInTheDocument()
  })
  
  it('redirects when no user', () => {
    // Mock useAuth to return user: null, isLoading: false
    const { getByText } = render(<ProtectedRoute><div>Secret</div></ProtectedRoute>)
    expect(getByText('Login')).toBeInTheDocument()
  })
  
  it('shows children when user exists', () => {
    // Mock useAuth to return user: mockUser
    const { getByText } = render(<ProtectedRoute><div>Secret</div></ProtectedRoute>)
    expect(getByText('Secret')).toBeInTheDocument()
  })
})
```

## Troubleshooting

### Issue: Token not being sent in requests
- Check `localStorage.getItem('auth_token')` in browser console
- Verify Bearer token format in Network tab
- Ensure API client interceptors are loaded

### Issue: User data not updating
- Check if `useCurrentUser()` is being called
- Verify `enabled` flag is true and token exists
- Check network request to `/auth/me`

### Issue: Logout not clearing data
- Browser cache may retain stale data
- Verify localStorage is cleared
- Check React Query DevTools cache status

### Issue: 401 Redirects not working
- Verify API returns 401 status code
- Check if window.location.href is allowed
- Consider using router navigation instead

## Next Steps

1. Integrate with a UI component library (e.g., Material-UI, Shadcn)
2. Add session refresh logic for token expiration
3. Implement remember-me functionality
4. Add OAuth/SSO integration
5. Add two-factor authentication support
6. Implement password reset flow
7. Add email verification flow

---

**Created:** Task Goal 0cf31efb
**Build Status:** ✅ PASSED (0 errors, 0 warnings)
**Last Updated:** Current session
