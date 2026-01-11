import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isFirst = index === 0

          return (
            <li key={index} className="flex items-center gap-2">
              {!isFirst && (
                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
              )}

              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="text-indigo-600 hover:text-indigo-700 hover:underline text-sm font-medium transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={`text-sm font-medium ${
                    isLast
                      ? 'text-gray-900'
                      : 'text-gray-600'
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
