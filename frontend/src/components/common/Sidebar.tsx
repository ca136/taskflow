import { useState } from 'react'
import { LayoutDashboard, CheckSquare, Settings, Plus, ChevronDown } from 'lucide-react'
import { useProjectStore } from '../../stores/projectStore'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { projects, currentProject, setCurrentProject } = useProjectStore()
  const [showProjectMenu, setShowProjectMenu] = useState(true)

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-50 border-r border-gray-200 transition-transform duration-300 ease-in-out z-30 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ top: '64px' }}
      >
        <div className="h-full overflow-y-auto flex flex-col">
          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-indigo-600 transition-colors group"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose()
                    }
                  }}
                >
                  <Icon size={20} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="font-medium">{item.label}</span>
                </a>
              )
            })}
          </nav>

          {/* Projects Section */}
          <div className="border-t border-gray-200 px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Projects
              </h3>
              <button
                className="p-1 hover:bg-white rounded transition-colors text-gray-400 hover:text-indigo-600"
                title="Add project"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Project List */}
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {projects.length === 0 ? (
                <p className="text-xs text-gray-500 px-4 py-2">No projects yet</p>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setCurrentProject(project)
                      if (window.innerWidth < 1024) {
                        onClose()
                      }
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentProject?.id === project.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{project.name}</span>
                      {currentProject?.id === project.id && (
                        <div className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Expand/Collapse Projects */}
            <button
              onClick={() => setShowProjectMenu(!showProjectMenu)}
              className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-700 py-2 transition-colors"
            >
              <ChevronDown size={14} />
              {showProjectMenu ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
