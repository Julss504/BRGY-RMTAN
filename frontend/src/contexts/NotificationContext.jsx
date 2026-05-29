import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api.js'

const NotificationContext = createContext()

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications')
      setNotifications(response.data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const addNotification = (notification) => {
    setNotifications([notification, ...notifications])
  }

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications(
        notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const clearAll = async () => {
    try {
      await Promise.all(
        notifications.map(n => api.delete(`/notifications/${n._id}`))
      )
      setNotifications([])
    } catch (error) {
      console.error('Failed to clear notifications:', error)
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    clearAll,
    fetchNotifications,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}