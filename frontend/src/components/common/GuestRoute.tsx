import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

export default function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-secondary-500">Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />
  }

  return <Outlet />
}
