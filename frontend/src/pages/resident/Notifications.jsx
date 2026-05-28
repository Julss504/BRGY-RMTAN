import React, { useState, useEffect } from 'react'
import { Bell, Check, Trash2 } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import { useNotifications } from '../../contexts/NotificationContext.jsx'
import api from '../../services/api.js'
import { toast } from 'react-hot-toast'

export default function Notifications() {
  const { notifications, fetchNotifications, unreadCount } = useNotifications()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all')
      fetchNotifications()
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to update notifications')
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead
    if (filter === 'read') return n.isRead
    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Notifications</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {unreadCount} unread
          </span>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all read
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'all' ? 'bg-navy-700 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'unread' ? 'bg-navy-700 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Unread
          </button>
          <button 
            onClick={() => setFilter('read')}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'read' ? 'bg-navy-700 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Read
          </button>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card key={notification._id} className={!notification.isRead ? 'border-l-4 border-orange-500 bg-orange-50/30' : ''}>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-navy-100 rounded-lg">
                <Bell className="w-5 h-5 text-navy-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-navy-900">{notification.title || notification.message}</h3>
                  <span className="text-xs text-gray-500">
                    {(new Date(notification.createdAt)).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{notification.message}</p>
                {notification.link && (
                  <a href={notification.link} className="text-sm text-orange-600 hover:underline mt-2 inline-block">
                    View details
                  </a>
                )}
              </div>
{!notification.isRead && (
                 <button 
                   onClick={async () => {
                     await api.patch(`/notifications/${notification._id}/read`)
                     fetchNotifications()
                   }}
                   className="text-navy-600 hover:text-navy-800"
                 >
                   <Check className="w-4 h-4" />
                 </button>
               )}
            </div>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No notifications to display
        </div>
      )}
    </div>
  )
}