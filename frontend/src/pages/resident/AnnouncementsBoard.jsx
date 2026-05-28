import React, { useState, useEffect } from 'react'
import { Megaphone, Calendar, Search } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/api.js'

export default function AnnouncementsBoard() {
  const [announcements, setAnnouncements] = useState([])
  const [filter, setFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const url = filter ? `/announcements?category=${filter}` : '/announcements'
      const response = await api.get(url)
      setAnnouncements(response.data)
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Announcements Board</h1>

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
              fetchAnnouncements()
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          >
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="health">Health</option>
            <option value="safety">Safety</option>
            <option value="event">Event</option>
            <option value="meeting">Meeting</option>
          </select>
        </div>
      </Card>

      <div className="space-y-4">
        {announcements
          .filter(a => a.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      a.body?.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((announcement) => (
            <Card key={announcement._id} className="hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-navy-100 rounded-lg">
                  <Megaphone className="w-5 h-5 text-navy-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-navy-900">{announcement.title}</h3>
                    <Badge variant="info" className="capitalize">{announcement.category}</Badge>
                  </div>
                  <p className="text-gray-600 mt-2">{announcement.body}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{(new Date(announcement.createdAt)).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        
        {announcements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No announcements to display
          </div>
        )}
      </div>
    </div>
  )
}