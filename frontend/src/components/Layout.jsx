import React from 'react'
import Navbar from './Layout/Navbar.jsx'
import Sidebar from './Layout/Sidebar.jsx'
import Footer from './Layout/Footer.jsx'

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
        <Footer />
      </div>
    </div>
  )
}