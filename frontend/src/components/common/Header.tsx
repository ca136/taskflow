import { useState } from 'react'
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useProjectStore } from '../../stores/projectStore'

interface HeaderProps {
  onMenuToggle: (isOpen: boolean) => void
  isMobileMenuOpen: boolean
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  const { user, logout } = useAuthStore()
  const { currentProject } = useProjectStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    // TODO: Call logout API endpoint
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Logo and Project Section */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => onMenuToggle(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">TaskFlow</h1>
          </div>

          {/* Project Selector */}
          {currentProject && (
            <div className="hidden sm:flex items-center gap-2 ml-6 pl-6 border-l border-gray-200">
              <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600">
                  {currentProject.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 truncate">
                {currentProject.name}
              </span>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
            aria-label="User menu"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full bg-gray-200 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserIcon size={18} className="text-indigo-600" />
              </div>
            )}
            <span className="text-sm font-medium hidden sm:inline text-gray-900">
              {user?.name || 'User'}
            </span>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false)
                  // TODO: Navigate to settings
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-gray-200"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
