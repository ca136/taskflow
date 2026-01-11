# Authentication Implementation Checklist

Use this checklist when integrating authentication into your components and pages.

## ✅ Setup (Project Level)

- [x] `frontend/src/api/hooks/useAuth.ts` - Main hooks file (254 lines)
- [x] `frontend/src/api/hooks/index.ts` - Hook exports
- [x] `frontend/src/api/index.ts` - API module index
- [x] `frontend/src/stores/authStore.ts` - Zustand store
- [x] `frontend/src/services/apiClient.ts` - API client with interceptors
- [x] `frontend/src/types/index.ts` - TypeScript type definitions

**Status:** ✅ All infrastructure in place

## 📋 Integration Steps

### 1. App-Level Setup

- [ ] Ensure React Query `QueryClientProvider` wraps your app
- [ ] Ensure Zustand store can hydrate from localStorage
- [ ] Test: Open browser console, check `localStorage` for tokens after login

**Example:**
```typescript
// App.tsx
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your routes here */}
    </QueryClientProvider>
  )
}
```

### 2. Route Protection

- [ ] Wrap sensitive routes with `ProtectedRoute` component
- [ ] Test: Verify unauthenticated users are redirected to `/login`
- [ ] Test: Verify authenticated users can access routes

**Example:**
```typescript
// App.tsx or Router.tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    } 
  />
</Routes>
```

### 3. Login Page

- [ ] Create login form component
- [ ] Use `useAuth()` hook for login mutation
- [ ] Display loading state while logging in
- [ ] Display error message on login failure
- [ ] Test: Try valid credentials
- [ ] Test: Try invalid credentials
- [ ] Test: Check localStorage has `auth_token` after login
- [ ] Test: Verify navigation to dashboard after login

**Template:**
```typescript
// pages/LoginPage.tsx
import { useAuth } from '@/api/hooks'
import { useNavigate } from 'react-router-dom'

export function LoginPage() {
  const { login, loginPending, loginError } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password })
    // Navigation happens via Zustand observer or useEffect
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={loginPending}>
        {loginPending ? 'Logging in...' : 'Login'}
      </button>
      {loginError && <Error>{loginError.message}</Error>}
    </form>
  )
}
```

### 4. Registration Page

- [ ] Create registration form component
- [ ] Use `useAuth()` hook for register mutation
- [ ] Display loading state while registering
- [ ] Display error message on registration failure
- [ ] Test: Try valid registration
- [ ] Test: Try duplicate email
- [ ] Test: Check tokens stored after registration
- [ ] Test: Verify auto-login after registration

**Template:**
```typescript
// pages/RegisterPage.tsx
import { useAuth } from '@/api/hooks'

export function RegisterPage() {
  const { register, registerPending, registerError } = useAuth()
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={registerPending}>
        {registerPending ? 'Creating account...' : 'Sign up'}
      </button>
      {registerError && <Error>{registerError.message}</Error>}
    </form>
  )
}
```

### 5. User Menu Component

- [ ] Create user menu showing logged-in user
- [ ] Add logout button
- [ ] Use `useAuth()` for user data and logout
- [ ] Display loading state during logout
- [ ] Test: Verify user name displays correctly
- [ ] Test: Verify logout clears tokens
- [ ] Test: Verify user is redirected to login after logout

**Template:**
```typescript
// components/UserMenu.tsx
import { useAuth } from '@/api/hooks'
import { useNavigate } from 'react-router-dom'

export function UserMenu() {
  const { user, logout, logoutPending } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="user-menu">
      <span>Welcome, {user.name}!</span>
      <button onClick={handleLogout} disabled={logoutPending}>
        {logoutPending ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  )
}
```

### 6. Persist Auth on App Load

- [ ] Verify tokens are restored from localStorage on app load
- [ ] Use `useCurrentUser()` to fetch current user on app load
- [ ] Test: Refresh page, verify user data is restored
- [ ] Test: Close and reopen browser, verify session persists

**Example in Root Component:**
```typescript
// App.tsx or Root.tsx
import { useEffect } from 'react'
import { useAuth } from '@/api/hooks'

export function App() {
  const { currentUser, currentUserLoading } = useAuth()

  if (currentUserLoading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      {/* routes */}
    </Router>
  )
}
```

## 🧪 Testing Checklist

### Login Flow
- [ ] Login with valid credentials → should store tokens → redirect to home
- [ ] Login with invalid credentials → should show error message
- [ ] Login with empty fields → should show validation error
- [ ] Network error during login → should show error message
- [ ] User data persists after page refresh

### Register Flow
- [ ] Register with valid data → should create account → store tokens
- [ ] Register with duplicate email → should show error
- [ ] Register with weak password → should show error
- [ ] Register with invalid email format → should show error

### Logout Flow
- [ ] Logout → should clear tokens from localStorage
- [ ] Logout → should clear user data from state
- [ ] Logout → should redirect to login page
- [ ] Logout → should clear all auth queries from React Query cache

### Protected Routes
- [ ] Unauthenticated user tries to access `/dashboard` → redirects to `/login`
- [ ] Authenticated user can access `/dashboard`
- [ ] After logout, `/dashboard` redirects to `/login`

### Session Persistence
- [ ] Login → refresh page → should still be logged in
- [ ] Login → close tab → open app in new tab → should still be logged in
- [ ] Browser back button after logout → should not expose user data

### Error Handling
- [ ] 401 Unauthorized → tokens removed, user cleared
- [ ] 403 Forbidden → error message shown
- [ ] 422 Validation Error → field-level errors shown
- [ ] Network timeout → error message shown
- [ ] Server 500 error → error message shown

## 🐛 Debugging Guide

### Tokens Not Being Sent
1. Open DevTools → Application tab
2. Check `localStorage` for `auth_token`
3. Open DevTools → Network tab
4. Check request headers for `Authorization: Bearer {token}`

**If missing:**
- Verify login API response includes token
- Check `apiClient.ts` request interceptor
- Verify token is being stored in localStorage

### User Data Not Showing
1. Check if `useCurrentUser()` is being called
2. Verify `enabled` flag is true
3. Check Network tab for GET `/auth/me` request
4. Check browser console for errors

**If not calling endpoint:**
- Verify token exists in localStorage
- Check `useAuth()` is imported from correct location
- Verify React Query QueryClient is provided

### Logout Not Working
1. Check Network tab for POST `/auth/logout`
2. Check localStorage is cleared
3. Check Zustand store is cleared via React DevTools

**If tokens still present:**
- Verify `logout()` is being called (not just referenced)
- Check localStorage manually: `localStorage.clear()`
- Check for multiple auth stores or instances

### Session Lost on Refresh
1. Verify `useCurrentUser()` is called on app load
2. Check Network tab for GET `/auth/me` request
3. Verify current user data is displayed

**If not restoring:**
- Call `useAuth()` at root level
- Verify API endpoint `/auth/me` works
- Check error response for 401 status

## 📚 Documentation

- **Full Guide:** `frontend/AUTHENTICATION_HOOKS_GUIDE.md`
- **Quick Start:** `frontend/src/api/hooks/QUICKSTART.md`
- **Task Summary:** `TASK_SUMMARY.md`

## 🚀 Next Steps After Integration

1. **Add password reset flow**
   - Create `/forgot-password` page
   - Call API to send reset email
   - Handle reset token verification

2. **Add email verification**
   - Verify email after registration
   - Resend verification email

3. **Add two-factor authentication**
   - Add 2FA setup in settings
   - Verify 2FA code on login

4. **Add OAuth integration**
   - Google OAuth login
   - GitHub OAuth login

5. **Add remember-me**
   - Extend token expiration if checked
   - Persist across multiple tabs

6. **Add session management**
   - View active sessions
   - Logout from other devices
   - Session timeout with warning

7. **Add activity logging**
   - Track login/logout times
   - Log IP addresses
   - Alert on suspicious activity

## ✅ Final Verification

- [ ] Build succeeds with no errors: `npm run build`
- [ ] TypeScript check passes: `npx tsc --noEmit`
- [ ] All tests pass: `npm test` (if applicable)
- [ ] Login works end-to-end
- [ ] Register works end-to-end
- [ ] Logout works end-to-end
- [ ] Protected routes work
- [ ] Session persists on refresh
- [ ] Error messages display correctly
- [ ] Loading states display correctly

---

**Estimated Time to Full Integration:** 2-4 hours
**Difficulty:** Medium (all infrastructure provided)
**Status:** Ready for implementation
