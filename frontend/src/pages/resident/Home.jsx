import React from 'react'
import { Megaphone, Trash2, AlertCircle, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'

export default function Home() {
  const quickLinks = [
    { to: '/document-request', icon: FileText, label: 'Request Document', color: 'navy' },
    { to: '/announcements', icon: Megaphone, label: 'Announcements', color: 'orange' },
    { to: '/waste-schedule', icon: Trash2, label: 'Waste Schedule', color: 'navy' },
    { to: '/disaster-awareness', icon: AlertCircle, label: 'Disaster Info', color: 'orange' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Welcome, Juan!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            <Card className="text-center hover:shadow-xl transition-shadow cursor-pointer">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                link.color === 'navy' ? 'bg-navy-700' : 'bg-orange-500'
              }`}>
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-navy-900">{link.label}</h3>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Latest Announcements</h2>
          <div className="space-y-3">
            <div className="p-3 bg-navy-50 rounded-lg">
              <p className="font-medium">Barangay Fiesta 2024</p>
              <p className="text-sm text-gray-600">Join us for the annual celebration</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="font-medium">Waste Collection Update</p>
              <p className="text-sm text-gray-600">New schedule for Purok 3</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Upcoming Waste Collection</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Purok 1</span>
              <span className="text-sm font-medium">Monday 6:00 AM</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Purok 2</span>
              <span className="text-sm font-medium">Tuesday 6:00 AM</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}