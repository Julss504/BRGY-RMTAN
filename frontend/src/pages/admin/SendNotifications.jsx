import React, { useState } from 'react'
import { Send, Users, Bell } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/api.js'
import { toast } from 'react-hot-toast'

export default function SendNotifications() {
  const [message, setMessage] = useState('')
  const [targetPurok, setTargetPurok] = useState('')
  const [sendToAll, setSendToAll] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await api.patch('/notifications/send', {
        message,
        type: 'announcement',
        all: sendToAll,
        targetPurok: sendToAll ? null : targetPurok
      })
      toast.success('Notification sent successfully')
      setMessage('')
    } catch (error) {
      toast.error('Failed to send notification')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Send Notifications</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1">
              Recipients
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={sendToAll}
                  onChange={() => setSendToAll(true)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">All Residents</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!sendToAll}
                  onChange={() => setSendToAll(false)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Specific Purok/Zone</span>
              </label>
            </div>
          </div>

          {!sendToAll && (
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1">
                Purok/Zone
              </label>
              <select
                value={targetPurok}
                onChange={(e) => setTargetPurok(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                required
              >
                <option value="">Select Purok/Zone</option>
                <option value="Purok 1">Purok 1</option>
                <option value="Purok 2">Purok 2</option>
                <option value="Purok 3">Purok 3</option>
                <option value="Purok 4">Purok 4</option>
                <option value="Purok 5">Purok 5</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="Enter your notification message..."
              required
            />
          </div>

          <div className="flex gap-3">
            <Button variant="primary" type="submit" disabled={isSubmitting || !message}>
              <Send className="w-4 h-4 mr-2 inline" />
              {isSubmitting ? 'Sending...' : 'Send Notification'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}