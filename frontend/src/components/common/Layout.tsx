import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <h1
              className="text-xl font-bold text-primary-600 cursor-pointer"
              onClick={() => navigate('/projects')}
            >
              TaskFlow
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-secondary-500">
                {user?.full_name || user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-secondary-500 hover:text-secondary-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
