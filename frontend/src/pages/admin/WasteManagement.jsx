import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Calendar, Clock, Archive, ArchiveRestore } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import api from '../../services/api.js'
import { toast } from 'react-hot-toast'

export default function WasteManagement() {
  const [schedules, setSchedules] = useState([])
  const [archivedSchedules, setArchivedSchedules] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showArchivedModal, setShowArchivedModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirmItemId, setConfirmItemId] = useState(null)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [formData, setFormData] = useState({
    zone: '',
    date: '',
    startTime: '',
    endTime: '',
    wasteType: '',
    notes: '',
    status: 'upcoming'
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

  const fetchArchivedSchedules = async () => {
    try {
      const response = await api.get('/waste-schedules/archived')
      setArchivedSchedules(response.data)
    } catch (error) {
      console.error('Failed to fetch archived schedules:', error)
    }
  }

  const handleArchive = async (id) => {
    try {
      await api.delete(`/waste-schedules/${id}`)
      toast.success('Schedule archived')
      fetchSchedules()
      if (showArchivedModal) fetchArchivedSchedules()
    } catch (error) {
      toast.error('Failed to archive schedule')
    }
  }

  const handleRestore = async (id) => {
    try {
      await api.put(`/waste-schedules/${id}/restore`)
      toast.success('Schedule restored')
      fetchArchivedSchedules()
      if (showArchivedModal) fetchSchedules()
    } catch (error) {
      toast.error('Failed to restore schedule')
    }
  }

  const confirmArchive = (id) => {
    setConfirmAction('archive')
    setConfirmItemId(id)
    setShowConfirmModal(true)
  }

  const confirmRestore = (id) => {
    setConfirmAction('restore')
    setConfirmItemId(id)
    setShowConfirmModal(true)
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
      setFormData({ zone: '', date: '', startTime: '', endTime: '', wasteType: '', notes: '', status: 'upcoming' })
      setEditingSchedule(null)
      fetchSchedules()
    } catch (error) {
      toast.error('Failed to save schedule')
    }
  }

  const handleConfirmAction = async () => {
    if (!confirmItemId) return
    
    if (confirmAction === 'archive') {
      await handleArchive(confirmItemId)
    } else if (confirmAction === 'restore') {
      await handleRestore(confirmItemId)
    }
    
    setShowConfirmModal(false)
    setConfirmAction(null)
    setConfirmItemId(null)
  }

  const openArchivedModal = () => {
    setShowArchivedModal(true)
    fetchArchivedSchedules()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Waste Management</h1>
<div className="flex items-center gap-2">
         <Button onClick={() => setShowModal(true)}>
           <Plus className="w-4 h-4 mr-2 inline" />
           Add Schedule
         </Button>
         <Button variant="outline" onClick={openArchivedModal}>
           <Archive className="w-4 h-4 mr-2 inline" />
           View Archived
         </Button>
       </div>
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
                    <span>{schedule.startTime} - {schedule.endTime}</span>
                  </div>
                  <Badge variant="info" className="mt-1 capitalize">{schedule.wasteType?.replace('-', ' ')}</Badge>
                  {schedule.status && (
                    <Badge
                      variant={schedule.status === 'completed' ? 'success' : schedule.status === 'ongoing' ? 'warning' : schedule.status === 'cancelled' ? 'danger' : 'default'}
                      className="mt-1 capitalize"
                    >
                      {schedule.status}
                    </Badge>
                  )}
                  {schedule.notes && (
                    <p className="mt-1 text-sm text-gray-600">{schedule.notes}</p>
                  )}
                </div>
              </div>
<div className="flex gap-2">
                 <button
                   onClick={() => {
                     setEditingSchedule(schedule._id)
                     setFormData({
                       zone: schedule.zone,
                       date: schedule.date?.split('T')[0],
                       startTime: schedule.startTime || '',
                       endTime: schedule.endTime || '',
                       wasteType: schedule.wasteType,
                       notes: schedule.notes || '',
                       status: schedule.status || 'upcoming'
                     })
                     setShowModal(true)
                   }}
                   className="text-navy-600 hover:text-navy-800"
                 >
                   <Edit className="w-4 h-4" />
                 </button>
                 <button
                   onClick={() => confirmArchive(schedule._id)}
                   className="text-orange-600 hover:text-orange-800"
                   title="Archive"
                 >
                   <Archive className="w-4 h-4" />
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
          setFormData({ zone: '', date: '', startTime: '', endTime: '', wasteType: '', notes: '', status: 'upcoming' })
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
              min={!editingSchedule || formData.date >= new Date().toLocaleDateString('en-CA') ? new Date().toLocaleDateString('en-CA') : undefined}
              readOnly={editingSchedule && formData.date < new Date().toLocaleDateString('en-CA')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Time *</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Time *</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
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
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
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

       <Modal
         isOpen={showConfirmModal}
         onClose={() => setShowConfirmModal(false)}
         title={confirmAction === 'archive' ? 'Confirm Archive' : 'Confirm Restore'}
       >
         <div className="space-y-4">
           <p className="text-gray-600">
             {confirmAction === 'archive' 
               ? 'Are you sure you want to archive this schedule? It will be moved to archived items and can be restored later.'
               : 'Are you sure you want to restore this schedule? It will be moved back to active schedules.'}
           </p>
           <div className="flex justify-end gap-2">
             <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
               Cancel
             </Button>
             <Button 
               onClick={handleConfirmAction}
               variant={confirmAction === 'archive' ? 'danger' : 'primary'}
             >
               {confirmAction === 'archive' ? 'Archive' : 'Restore'}
             </Button>
           </div>
         </div>
       </Modal>

       <Modal
         isOpen={showArchivedModal}
         onClose={() => setShowArchivedModal(false)}
         title="Archived Schedules"
         size="lg"
       >
         <div className="space-y-4">
           {archivedSchedules.map((schedule) => (
             <div key={schedule._id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-gray-100 rounded-lg">
                   <Calendar className="w-5 h-5 text-gray-500" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-navy-900">{schedule.zone}</h3>
                   <p className="text-sm text-gray-600">
                     {new Date(schedule.date).toLocaleDateString()} | {schedule.startTime} - {schedule.endTime}
                   </p>
                   <Badge variant="default" className="mt-1 capitalize">{schedule.wasteType?.replace('-', ' ')}</Badge>
                 </div>
               </div>
               <button
                 onClick={() => confirmRestore(schedule._id)}
                 className="text-green-600 hover:text-green-800"
                 title="Restore"
               >
                 <ArchiveRestore className="w-4 h-4" />
               </button>
             </div>
           ))}
           {archivedSchedules.length === 0 && (
             <div className="text-center py-8 text-gray-500">
               No archived schedules
             </div>
           )}
         </div>
       </Modal>
     </div>
   )
}