import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const paddingStyles: Record<string, string> = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const shadowStyles: Record<string, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      padding = 'md',
      shadow = 'md',
      hover = false,
      className,
      ...props
    },
    ref,
  ) => {
    const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : ''
    const paddingClass = paddingStyles[padding]
    const shadowClass = shadowStyles[shadow]

    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-lg border border-gray-200
          ${paddingClass}
          ${shadowClass}
          ${hoverClass}
          ${className || ''}
        `}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'

// Card Header Component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={`pb-4 border-b border-gray-200 mb-4 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  ),
)

CardHeader.displayName = 'CardHeader'

// Card Body Component
interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={`${className || ''}`}
      {...props}
    >
      {children}
    </div>
  ),
)

CardBody.displayName = 'CardBody'

// Card Footer Component
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={`pt-4 border-t border-gray-200 mt-4 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  ),
)

CardFooter.displayName = 'CardFooter'
