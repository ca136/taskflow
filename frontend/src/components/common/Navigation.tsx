import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold">TaskFlow</h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/responsive-test" className="hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium">
              Responsive Test
            </Link>
            <a href="#" className="hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium">
              Settings
            </a>
            <button className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-md text-sm font-medium">
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-700 focus:outline-none"
              data-testid="mobile-menu-btn"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary-700" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block hover:bg-primary-600 px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/responsive-test"
              onClick={() => setIsOpen(false)}
              className="block hover:bg-primary-600 px-3 py-2 rounded-md text-base font-medium"
            >
              Responsive Test
            </Link>
            <a href="#" className="block hover:bg-primary-600 px-3 py-2 rounded-md text-base font-medium">
              Settings
            </a>
            <button className="w-full text-left hover:bg-primary-600 px-3 py-2 rounded-md text-base font-medium">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
