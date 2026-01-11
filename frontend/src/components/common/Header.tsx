import { useState, useRef, useEffect } from 'react'
import { Menu, X, LogOut, User as UserIcon, ChevronDown, Settings } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useProjectStore } from '../../stores/projectStore'

interface HeaderProps {
  onMenuToggle: (isOpen: boolean) => void
  isMobileMenuOpen: boolean
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  const { user, logout } = useAuthStore()
  const { currentProject, projects } = useProjectStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showProjectMenu, setShowProjectMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const projectMenuRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (projectMenuRef.current && !projectMenuRef.current.contains(event.target as Node)) {
        setShowProjectMenu(false)
      }
    }

    if (showUserMenu || showProjectMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu, showProjectMenu])

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo and Project Section */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger Menu - Mobile Only */}
          <button
            onClick={() => onMenuToggle(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 hover:text-indigo-600"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X size={24} className="transition-transform duration-200" />
            ) : (
              <Menu size={24} className="transition-transform duration-200" />
            )}
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">TaskFlow</h1>
          </a>

          {/* Project Selector - Desktop Only */}
          {projects.length > 0 && (
            <div
              ref={projectMenuRef}
              className="hidden md:block relative ml-6 pl-6 border-l border-gray-200"
            >
              <button
                onClick={() => setShowProjectMenu(!showProjectMenu)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 hover:text-indigo-600 group"
                aria-label="Project selector"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-md flex items-center justify-center border border-blue-200">
                  <span className="text-xs font-bold text-blue-600">
                    {currentProject?.name.charAt(0).toUpperCase() || 'P'}
                  </span>
                </div>
                <span className="text-sm font-medium truncate max-w-xs">
                  {currentProject?.name || 'Select Project'}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${showProjectMenu ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Project Dropdown Menu */}
              {showProjectMenu && projects.length > 0 && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Recent Projects
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          // TODO: setCurrentProject(project)
                          setShowProjectMenu(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${
                          currentProject?.id === project.id
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border border-gray-200">
                            <span className="text-xs font-bold text-gray-600">
                              {project.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="truncate">{project.name}</span>
                          {currentProject?.id === project.id && (
                            <div className="w-2 h-2 rounded-full bg-indigo-600 ml-auto flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 hover:text-indigo-600"
            aria-label="User menu"
            aria-expanded={showUserMenu}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full bg-gray-200 object-cover border border-gray-300"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center border border-indigo-200">
                <UserIcon size={18} className="text-indigo-600" />
              </div>
            )}
            <span className="text-sm font-medium hidden sm:inline text-gray-900">
              {user?.name || 'User'}
            </span>
            <ChevronDown
              size={16}
              className={`hidden sm:block transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email || 'user@example.com'}</p>
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  // TODO: Navigate to profile
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <UserIcon size={16} className="text-gray-400" />
                Profile
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false)
                  // TODO: Navigate to settings
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Settings size={16} className="text-gray-400" />
                Settings
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 my-1" />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} className="text-red-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
