import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      icon,
      className,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const widthClass = fullWidth ? 'w-full' : ''
    const errorClass = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'

    return (
      <div className={widthClass}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-secondary-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={`
              flex w-full px-4 py-2 border rounded-lg
              ${icon ? 'pl-10' : ''}
              text-secondary-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent
              ${errorClass}
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
              transition-colors duration-200
              ${className || ''}
            `}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18.101 12.93a1 1 0 00-1.414-1.414L10 14.586l-6.687-6.687a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l8-8z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
