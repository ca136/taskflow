import { useState } from 'react'
import { Header } from '../common/Header'
import { Sidebar } from '../common/Sidebar'
import { Breadcrumbs, BreadcrumbItem } from '../common/Breadcrumbs'

interface AppLayoutProps {
  children: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  title?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  breadcrumbs = [],
  title,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMobileMenuOpen(isOpen)
  }

  const handleSidebarClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header
        onMenuToggle={handleMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={handleSidebarClose}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Page Title */}
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

            {/* Page Content */}
            <div className="animate-fadeIn">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
