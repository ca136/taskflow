import { useState, useEffect } from 'react'
import { Header } from '../common/Header'
import { Sidebar } from '../common/Sidebar'
import { Breadcrumbs, Breadcrumb } from '../common/Breadcrumbs'

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  showSidebar?: boolean
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  subtitle,
  breadcrumbs = [],
  showSidebar = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Close menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        onMenuToggle={setIsMobileMenuOpen}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumbs items={breadcrumbs} />
            )}

            {/* Page Header */}
            {(title || subtitle) && (
              <div className="mb-8 animate-fade-in">
                {title && (
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-lg text-gray-600">{subtitle}</p>
                )}
              </div>
            )}

            {/* Page Content */}
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
