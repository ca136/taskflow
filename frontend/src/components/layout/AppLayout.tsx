import { useState } from 'react'
import { Header } from '../common/Header'
import { Sidebar } from '../common/Sidebar'
import { Breadcrumbs, BreadcrumbItem } from '../common/Breadcrumbs'

interface AppLayoutProps {
  children: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  subtitle?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  breadcrumbs = [],
  title,
  subtitle,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMobileMenuOpen(isOpen)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Navigation Bar */}
      <Header
        onMenuToggle={handleMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Breadcrumbs and Page Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

              {/* Page Title and Subtitle */}
              {title && (
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Page Content */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
