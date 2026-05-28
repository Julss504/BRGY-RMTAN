import React from 'react'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-[#f97316] hover:bg-[#ea580c] text-white focus:ring-[#f97316]',
    secondary: 'bg-[#1e3a5f] hover:bg-[#0f172a] text-white focus:ring-[#1e3a5f]',
    outline: 'border border-[#1e3a5f] text-[#1e3a5f] hover:bg-navy-50 focus:ring-[#1e3a5f]',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}