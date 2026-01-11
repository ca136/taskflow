import { useState } from 'react'
import { LayoutDashboard, Kanban, Settings, BarChart3, Users, ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  label: string
  icon: React.ReactNode
  href: string
  badge?: string | number
  comingSoon?: boolean
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    href: '/',
  },
  {
    label: 'Board',
    icon: <Kanban size={20} />,
    href: '/board',
  },
  {
    label: 'Analytics',
    icon: <BarChart3 size={20} />,
    href: '/analytics',
    comingSoon: true,
  },
  {
    label: 'Team',
    icon: <Users size={20} />,
    href: '/team',
    badge: '5',
    comingSoon: true,
  },
]

const settingsItems: NavItem[] = [
  {
    label: 'Project Settings',
    icon: <Settings size={20} />,
    href: '/settings',
    comingSoon: true,
  },
]

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['main'])

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    )
  }

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href)
    const content = (
      <>
        <span className={`transition-colors ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
          {item.icon}
        </span>
        <span
          className={`flex-1 text-sm font-medium transition-colors ${
            active ? 'text-indigo-600' : 'text-gray-700 group-hover:text-gray-900'
          }`}
        >
          {item.label}
        </span>
        {item.badge && (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
            {item.badge}
          </span>
        )}
        {item.comingSoon && (
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Soon</span>
        )}
      </>
    )

    if (item.comingSoon) {
      return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 opacity-50 cursor-not-allowed bg-gray-50">
          {content}
        </div>
      )
    }

    return (
      <Link
        to={item.href}
        onClick={() => onClose()}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
          active
            ? 'bg-indigo-50 border-l-4 border-indigo-600'
            : 'hover:bg-gray-50 border-l-4 border-transparent'
        }`}
      >
        {content}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-200 z-40 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="space-y-1 p-4">
          {/* Main Navigation Section */}
          <div>
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </h3>
            <div className="space-y-1 mt-2">
              {navigationItems.map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4" />

          {/* Settings Section */}
          <div>
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Settings
            </h3>
            <div className="space-y-1 mt-2">
              {settingsItems.map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="border-t border-gray-200 my-4 pt-4">
            <a
              href="https://github.com/ca136/taskflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors group"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-sm font-medium">GitHub</span>
              <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gradient-to-t from-gray-50 to-transparent">
          <div className="text-xs text-gray-500 space-y-1">
            <p className="font-semibold">TaskFlow v0.1.0</p>
            <p>Lightweight project management for small teams</p>
          </div>
        </div>
      </aside>
    </>
  )
}
