import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, AlertCircle, Check, X } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import api from '../../services/api.js'
import { toast } from 'react-hot-toast'

export default function DisasterManagement() {
  const [alerts, setAlerts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingAlert, setEditingAlert] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    riskLevel: '',
    actions: ''
  })

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/disaster-alerts')
      setAlerts(response.data)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const actionsArray = formData.actions.split('\n').filter(a => a.trim())
      const data = { ...formData, actions: actionsArray }
      
      if (editingAlert) {
        await api.put(`/disaster-alerts/${editingAlert}`, data)
      } else {
        await api.post('/disaster-alerts', data)
      }
      toast.success('Alert saved successfully')
      setShowModal(false)
      setFormData({ title: '', description: '', category: '', riskLevel: '', actions: '' })
      setEditingAlert(null)
      fetchAlerts()
    } catch (error) {
      toast.error('Failed to save alert')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/disaster-alerts/${id}`)
      toast.success('Alert deleted')
      fetchAlerts()
    } catch (error) {
      toast.error('Failed to delete alert')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Disaster Management</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2 inline" />
          New Alert
        </Button>
      </div>

      <Card>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    alert.riskLevel === 'Critical' || alert.riskLevel === 'High' 
                      ? 'bg-red-100' 
                      : alert.riskLevel === 'Moderate' 
                        ? 'bg-orange-100' 
                        : 'bg-navy-100'
                  }`}>
                    <AlertCircle className={`w-5 h-5 ${
                      alert.riskLevel === 'Critical' || alert.riskLevel === 'High' 
                        ? 'text-red-600' 
                        : alert.riskLevel === 'Moderate' 
                          ? 'text-orange-600' 
                          : 'text-navy-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900">{alert.title}</h3>
                    <p className="text-sm text-gray-600">{alert.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={
                    alert.riskLevel === 'Critical' ? 'danger' :
                    alert.riskLevel === 'High' ? 'warning' : 'info'
                  }>
                    {alert.riskLevel} Risk
                  </Badge>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{alert.description}</p>
              {alert.actions && alert.actions.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-navy-800">Recommended Actions:</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {alert.actions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => {
                    setEditingAlert(alert._id)
                    setFormData({
                      title: alert.title,
                      description: alert.description,
                      category: alert.category,
                      riskLevel: alert.riskLevel,
                      actions: alert.actions?.join('\n') || ''
                    })
                    setShowModal(true)
                  }}
                  className="text-navy-600 hover:text-navy-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(alert._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {alerts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No disaster alerts configured yet
          </div>
        )}
      </Card>

      <Modal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false)
          setEditingAlert(null)
          setFormData({ title: '', description: '', category: '', riskLevel: '', actions: '' })
        }} 
        title={editingAlert ? 'Edit Alert' : 'New Disaster Alert'}
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
              placeholder="e.g., Typhoon Alert - Bagyo Name"
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
              <option value="">Select Disaster Type</option>
              <option value="Typhoon">Typhoon</option>
              <option value="Flood">Flood</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Fire">Fire</option>
              <option value="Landslide">Landslide</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Risk Level *</label>
            <select 
              value={formData.riskLevel}
              onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              required
            >
              <option value="">Select Risk Level</option>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the alert..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              rows="3"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Recommended Actions *</label>
            <textarea
              value={formData.actions}
              onChange={(e) => setFormData({ ...formData, actions: e.target.value })}
              placeholder="One action per line..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              rows="4"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingAlert ? 'Update' : 'Send'} Alert</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}