import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        data-testid="modal-backdrop"
      />

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Center modal on screen */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-lg">
          {/* Header */}
          <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 break-words flex-1">{title}</h3>
            <button
              onClick={onClose}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              data-testid="modal-close-btn"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="bg-white px-4 sm:px-6 py-4 sm:py-5 max-h-96 overflow-y-auto">
            {children}
          </div>

          {/* Footer with close button */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 sm:flex sm:flex-row-reverse gap-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
