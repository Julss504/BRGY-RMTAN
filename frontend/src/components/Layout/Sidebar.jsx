import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { Menu, X, Home, Users, Megaphone, Trash2, AlertCircle, FileText, Bell, Send, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const adminMenuItems = [
  { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/admin/residents', icon: Users, label: 'Resident Management' },
  { path: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
  { path: '/admin/waste-management', icon: Trash2, label: 'Waste Management' },
  { path: '/admin/disaster-management', icon: AlertCircle, label: 'Disaster Management' },
  { path: '/admin/document-requests', icon: FileText, label: 'Document Requests' },
  { path: '/admin/send-notifications', icon: Send, label: 'Send Notifications' },
]

const residentMenuItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/announcements', icon: Megaphone, label: 'Announcements' },
  { path: '/waste-schedule', icon: Trash2, label: 'Waste Schedule' },
  { path: '/disaster-awareness', icon: AlertCircle, label: 'Disaster Awareness' },
  { path: '/document-request', icon: FileText, label: 'Document Request' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/profile', icon: Users, label: 'My Profile' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const normalizedUserRole = user?.role?.trim().toLowerCase()
  const menuItems = normalizedUserRole === 'admin' ? adminMenuItems : residentMenuItems

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Mobile bottom nav
  const renderMobileNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex flex-nowrap overflow-x-auto justify-start items-center h-16 space-x-2 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center p-2 ${isActive ? 'text-orange-500' : 'text-gray-600'}`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )

  // Desktop sidebar
  const renderDesktopSidebar = () => (
    <div className={`hidden lg:flex bg-navy-900 text-white h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex-col`}>
      <div className="p-4 flex items-center justify-between border-b border-navy-800">
         {!collapsed && (
           <div>
             <h1 className="text-xl font-bold">RM Tan</h1>
             <p className="text-xs text-navy-300">{normalizedUserRole === 'admin' ? 'Admin Panel' : 'Resident Portal'}</p>
           </div>
         )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-navy-800 transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-navy-800 transition-colors ${
                isActive ? 'border-l-4 border-orange-500 bg-navy-800' : ''
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-navy-800">
        {!collapsed && (
          <div className="flex items-center justify-center mb-3 opacity-60">
            <img 
              src="/ph-seal.png" 
              alt="Philippines Seal" 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-navy-800 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {renderMobileNav()}
      {renderDesktopSidebar()}
    </>
  )
}