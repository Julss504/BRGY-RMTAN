import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import api from '../../services/api.js'
import { toast } from 'react-hot-toast'

export default function WasteManagement() {
  const [schedules, setSchedules] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [formData, setFormData] = useState({
    zone: '',
    date: '',
    time: '',
    wasteType: '',
    notes: ''
  })

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/waste-schedules')
      setSchedules(response.data)
    } catch (error) {
      console.error('Failed to fetch schedules:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSchedule) {
        await api.put(`/waste-schedules/${editingSchedule}`, formData)
      } else {
        await api.post('/waste-schedules', formData)
      }
      toast.success('Schedule saved successfully')
      setShowModal(false)
      setFormData({ zone: '', date: '', time: '', wasteType: '', notes: '' })
      setEditingSchedule(null)
      fetchSchedules()
    } catch (error) {
      toast.error('Failed to save schedule')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/waste-schedules/${id}`)
      toast.success('Schedule deleted')
      fetchSchedules()
    } catch (error) {
      toast.error('Failed to delete schedule')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Waste Management</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2 inline" />
          Add Schedule
        </Button>
      </div>

      <Card>
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule._id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900">{schedule.zone}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(schedule.date).toLocaleDateString()}</span>
                    <span>{schedule.time}</span>
                  </div>
                  <Badge variant="info" className="mt-1 capitalize">{schedule.wasteType?.replace('-', ' ')}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingSchedule(schedule._id)
                    setFormData({
                      zone: schedule.zone,
                      date: schedule.date?.split('T')[0],
                      time: schedule.time,
                      wasteType: schedule.wasteType,
                      notes: schedule.notes || ''
                    })
                    setShowModal(true)
                  }}
                  className="text-navy-600 hover:text-navy-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(schedule._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {schedules.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No waste schedules configured yet
          </div>
        )}
      </Card>

      <Modal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false)
          setEditingSchedule(null)
          setFormData({ zone: '', date: '', time: '', wasteType: '', notes: '' })
        }} 
        title={editingSchedule ? 'Edit Waste Schedule' : 'Add Waste Schedule'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Purok/Zone *</label>
            <select 
              value={formData.zone}
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              required
            >
              <option value="">Select Purok/Zone</option>
              <option>Purok 1</option>
              <option>Purok 2</option>
              <option>Purok 3</option>
              <option>Purok 4</option>
              <option>Purok 5</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Time *</label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="e.g., 6:00 AM - 10:00 AM"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Waste Type *</label>
            <select 
              value={formData.wasteType}
              onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              required
            >
              <option value="">Select Waste Type</option>
              <option value="biodegradable">Biodegradable</option>
              <option value="non-biodegradable">Non-Biodegradable</option>
              <option value="recyclable">Recyclable</option>
              <option value="special-waste">Special Waste</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              rows="3"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingSchedule ? 'Update' : 'Save'} Schedule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}