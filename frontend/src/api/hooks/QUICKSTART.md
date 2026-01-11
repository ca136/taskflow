# Authentication Hooks - Quick Start

## Import
```typescript
import { useAuth } from '@/api/hooks'
```

## Basic Usage

### Get Auth State
```typescript
const { user, isAuthenticated, isLoading } = useAuth()

if (isLoading) return <Spinner />
if (!user) return <Navigate to="/login" />
```

### Login
```typescript
const { login, loginPending, loginError } = useAuth()

const handleLogin = (email: string, password: string) => {
  login({ email, password })
}

// Or async version
const handleLogin = async (email: string, password: string) => {
  try {
    await loginAsync({ email, password })
    // Navigation happens automatically
  } catch (error) {
    console.error(error)
  }
}
```

### Register
```typescript
const { register, registerPending, registerError } = useAuth()

const handleRegister = (name: string, email: string, password: string) => {
  register({ name, email, password })
}
```

### Logout
```typescript
const { logout, logoutPending } = useAuth()

const handleLogout = () => {
  logout()
}
```

### Current User
```typescript
const { currentUser, currentUserLoading, currentUserError } = useAuth()
```

## All Hook Methods

```typescript
const {
  // State
  user,                      // User | null
  isLoading,                // boolean - any operation pending
  isAuthenticated,          // boolean - user logged in
  
  // Login
  login,                    // (creds) => void
  loginAsync,               // (creds) => Promise<void>
  loginPending,             // boolean
  loginError,               // ApiError | null
  
  // Register
  register,                 // (data) => void
  registerAsync,            // (data) => Promise<void>
  registerPending,          // boolean
  registerError,            // ApiError | null
  
  // Logout
  logout,                   // () => void
  logoutAsync,              // () => Promise<void>
  logoutPending,            // boolean
  
  // Current User Query
  currentUser,              // User | null
  currentUserLoading,       // boolean
  currentUserError,         // ApiError | null
} = useAuth()
```

## Component Examples

### Login Form
```typescript
import { useAuth } from '@/api/hooks'

export function LoginForm() {
  const { login, loginPending, loginError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      login({ email, password })
    }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button disabled={loginPending}>
        {loginPending ? 'Logging in...' : 'Login'}
      </button>
      {loginError && <p style={{ color: 'red' }}>{loginError.message}</p>}
    </form>
  )
}
```

### Protected Route
```typescript
import { useAuth } from '@/api/hooks'
import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  return children
}

// Usage:
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### User Menu
```typescript
import { useAuth } from '@/api/hooks'

export function UserMenu() {
  const { user, logout, logoutPending } = useAuth()

  if (!user) return null

  return (
    <div>
      <span>Welcome, {user.name}!</span>
      <button onClick={() => logout()} disabled={logoutPending}>
        Logout
      </button>
    </div>
  )
}
```

### Registration Form
```typescript
import { useAuth } from '@/api/hooks'
import { useNavigate } from 'react-router-dom'

export function RegisterForm() {
  const { register, registerPending, registerError } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    register(formData)
    // Success handled by auth store, error in registerError
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
      />
      <button disabled={registerPending}>
        {registerPending ? 'Creating account...' : 'Sign up'}
      </button>
      {registerError && <p style={{ color: 'red' }}>{registerError.message}</p>}
    </form>
  )
}
```

## API Endpoints

The hooks call these backend endpoints:

| Hook | Method | Endpoint | Payload |
|------|--------|----------|---------|
| `useLogin` | POST | `/auth/login` | `{ email, password }` |
| `useRegister` | POST | `/auth/register` | `{ email, password, name }` |
| `useLogout` | POST | `/auth/logout` | (none) |
| `useCurrentUser` | GET | `/auth/me` | (none) |

## Error Handling

### Common Errors

**Invalid Credentials (401)**
```typescript
const { loginError } = useAuth()

if (loginError?.status === 401) {
  // Show "Invalid email or password"
}
```

**Validation Error (422)**
```typescript
const { registerError } = useAuth()

if (registerError?.status === 422) {
  // registerError.details has field-level errors
  console.log(registerError.details)
}
```

**Network Error**
```typescript
const { loginError } = useAuth()

if (loginError?.message.includes('Network')) {
  // Show "Check your internet connection"
}
```

## Token Storage

Tokens are automatically stored in `localStorage`:

```javascript
// After login
localStorage.getItem('auth_token')      // Access token
localStorage.getItem('refresh_token')   // Refresh token

// After logout
// Both keys removed from localStorage
```

## Advanced: Direct Store Access

If you need direct access to auth state without using the hook:

```typescript
import { useAuthStore } from '@/stores/authStore'

const user = useAuthStore((state) => state.user)
const token = useAuthStore((state) => state.token)
```

## Advanced: Query Key Access

For manual cache management:

```typescript
import { authQueryKeys } from '@/api/hooks'
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

// Invalidate current user query
queryClient.invalidateQueries({
  queryKey: authQueryKeys.currentUser(),
})

// Remove from cache
queryClient.removeQueries({
  queryKey: authQueryKeys.currentUser(),
})
```

## Troubleshooting

**User not persisting after refresh?**
- The currentUser hook automatically re-fetches on mount
- Tokens are restored from localStorage automatically

**Login doesn't redirect?**
- Use async variant: `await loginAsync(...)` then navigate
- Or set up a useEffect to watch the `user` state

**Logout shows error but clears anyway?**
- This is intentional! Local logout always succeeds
- Check browser console for API errors

**Token in network requests?**
- Check Browser DevTools → Network → Headers
- Should see `Authorization: Bearer {token}`

---

See **AUTHENTICATION_HOOKS_GUIDE.md** for full documentation.
