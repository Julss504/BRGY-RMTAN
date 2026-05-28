import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Megaphone } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import api from '../../services/api.js'
import { toast } from 'react-hot-toast'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'general',
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements')
      setAnnouncements(response.data)
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAnnouncement) {
        await api.put(`/announcements/${editingAnnouncement}`, formData)
      } else {
        await api.post('/announcements', formData)
      }
      toast.success('Announcement saved')
      setShowModal(false)
      setFormData({ title: '', body: '', category: 'general' })
      setEditingAnnouncement(null)
      fetchAnnouncements()
    } catch (error) {
      toast.error('Failed to save announcement')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/announcements/${id}`)
      toast.success('Announcement deleted')
      fetchAnnouncements()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Announcements</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2 inline" />
          New Announcement
        </Button>
      </div>

      <Card>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-navy-100 rounded-lg">
                    <Megaphone className="w-5 h-5 text-navy-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900">{announcement.title}</h3>
                    <p className="text-sm text-gray-600">
                      {(new Date(announcement.createdAt)).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="info" className="capitalize">{announcement.category}</Badge>
                  <button 
                    onClick={() => {
                      setEditingAnnouncement(announcement._id)
                      setFormData({
                        title: announcement.title,
                        body: announcement.body,
                        category: announcement.category
                      })
                      setShowModal(true)
                    }}
                    className="text-navy-600 hover:text-navy-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(announcement._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mt-2">{announcement.body}</p>
            </div>
          ))}
        </div>
        
        {announcements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No announcements yet
          </div>
        )}
      </Card>

      <Modal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false)
          setEditingAnnouncement(null)
          setFormData({ title: '', body: '', category: 'general' })
        }} 
        title={editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              required
              placeholder="Announcement title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              required
            >
              <option value="general">General</option>
              <option value="health">Health</option>
              <option value="safety">Safety</option>
              <option value="event">Event</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Content *</label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Announcement details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              rows="5"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingAnnouncement ? 'Update' : 'Post'} Announcement</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}