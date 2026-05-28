import React from 'react'

export default function Badge({ children, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-[#d9e6f2] text-[#1e3a5f]',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}