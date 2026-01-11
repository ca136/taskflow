import React, { useEffect, useRef, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  closeOnEsc?: boolean
  closeOnClickOutside?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

/**
 * Modal Component
 *
 * A reusable modal dialog component with overlay, close button, and portal rendering.
 * Supports keyboard support (ESC to close) and click-outside-to-close functionality.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false)
 *
 * return (
 *   <>
 *     <button onClick={() => setIsOpen(true)}>Open Modal</button>
 *     <Modal
 *       isOpen={isOpen}
 *       onClose={() => setIsOpen(false)}
 *       title="Modal Title"
 *     >
 *       <p>Modal content here</p>
 *     </Modal>
 *   </>
 * )
 * ```
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  closeOnEsc = true,
  closeOnClickOutside = true,
  size = 'md',
  showCloseButton = true,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeOnEsc, onClose])

  // Handle click outside modal
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnClickOutside) return

    if (event.target === overlayRef.current) {
      onClose()
    }
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  // Size classes for modal content
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200"
      onClick={handleOverlayClick}
    >
      <div
        className={`relative w-full mx-4 bg-white rounded-lg shadow-xl ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto inline-flex items-center justify-center w-8 h-8 text-gray-400 bg-transparent rounded-md hover:bg-gray-100 hover:text-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export default Modal
