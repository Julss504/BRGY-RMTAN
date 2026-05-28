import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Handle user status
  if (user.status === 'pending') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-navy-900 mb-2">Account Under Review</h2>
          <p className="text-gray-600">Your registration is pending admin approval. Please check back later.</p>
        </div>
      </div>
    )
  }

  if (user.status === 'denied') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Account Denied</h2>
          <p className="text-gray-600">Your registration has been denied. Contact barangay office for more information.</p>
        </div>
      </div>
    )
  }

  // Handle role-based access with normalization - redirect instead of showing access denied
  const normalizedUserRole = user.role?.trim().toLowerCase()
  const normalizedRequiredRole = role?.trim().toLowerCase()
  
  if (normalizedRequiredRole && normalizedUserRole !== normalizedRequiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = normalizedUserRole === 'admin' ? '/admin/dashboard' : '/home';
    return <Navigate to={redirectPath} replace />;
  }

  // Check profile completion for residents (using normalized role)
  if (normalizedUserRole === 'resident' && !user.profileCompleted && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />
  }

  return children
}