import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface Breadcrumb {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbsProps {
  items?: Breadcrumb[]
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return null
  }

  // Ensure we have at least a Home link
  const displayItems = items.length > 0 ? items : [{ label: 'Home', href: '/' }]

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 px-4 sm:px-6 lg:px-8 py-3 bg-white rounded-lg border border-gray-200 text-sm">
        {/* Home Link */}
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 group"
          >
            <Home
              size={16}
              className="text-gray-400 group-hover:text-indigo-500 transition-colors"
            />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {/* Breadcrumb Items */}
        {displayItems.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            <ChevronRight
              size={16}
              className="text-gray-400 flex-shrink-0"
              aria-hidden="true"
            />

            {item.current ? (
              <span className="text-gray-900 font-medium truncate">{item.label}</span>
            ) : item.href ? (
              <Link
                to={item.href}
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 truncate hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600 truncate">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
