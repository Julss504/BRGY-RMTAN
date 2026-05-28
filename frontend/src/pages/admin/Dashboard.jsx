import React, { useState, useEffect } from 'react'
import { Users, Megaphone, Trash2, AlertCircle, FileText } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import api from '../../services/api.js'

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: 'Total Residents', value: '--', icon: Users, color: 'navy' },
    { label: 'Active Announcements', value: '--', icon: Megaphone, color: 'orange' },
    { label: 'Pending Requests', value: '--', icon: FileText, color: 'navy' },
    { label: 'Emergency Alerts', value: '--', icon: AlertCircle, color: 'orange' },
  ])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats in parallel
        const [residentsResp, announcementsResp, requestsResp, alertsResp] = await Promise.all([
          api.get('/profiles/count'),
          api.get('/announcements'),
          api.get('/document-requests'),
          api.get('/disaster-alerts')
        ])

        // Process stats
        const totalResidents = residentsResp.data.count || 0

        // Active announcements (all announcements for now since no status field)
        const activeAnnouncements = announcementsResp.data.length || 0

        // Pending document requests (enum uses capitalized 'Pending')
        const pendingRequests = requestsResp.data.filter(
          req => req.status === 'Pending'
        ).length || 0

        // Active disaster alerts (based on isActive boolean)
        const emergencyAlerts = alertsResp.data.filter(
          alert => alert.isActive !== false
        ).length || alertsResp.data.length

        setStats([
          { label: 'Total Residents', value: totalResidents.toLocaleString(), icon: Users, color: 'navy' },
          { label: 'Active Announcements', value: activeAnnouncements, icon: Megaphone, color: 'orange' },
          { label: 'Pending Requests', value: pendingRequests, icon: FileText, color: 'navy' },
          { label: 'Emergency Alerts', value: emergencyAlerts, icon: AlertCircle, color: 'orange' },
        ])

        // Fetch recent activity
        const recentActivities = []

        // Add recent announcements (limit 2)
        const sortedAnnouncements = [...announcementsResp.data]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2)
        sortedAnnouncements.forEach(ann => {
          recentActivities.push({
            type: 'announcement',
            message: `New announcement: ${ann.title}`,
            timestamp: ann.createdAt,
            icon: 'bg-orange-500'
          })
        })

        // Add recent document requests (limit 2)
        const sortedRequests = [...requestsResp.data]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2)
        sortedRequests.forEach(req => {
          recentActivities.push({
            type: 'document-request',
            message: `Document request: ${req.docType} for ${req.residentId?.fullName || 'Unknown'}`,
            timestamp: req.createdAt,
            icon: 'bg-navy-500'
          })
        })

        // Add recent disaster alerts (limit 2)
        const sortedAlerts = [...alertsResp.data]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2)
        sortedAlerts.forEach(alert => {
          recentActivities.push({
            type: 'disaster-alert',
            message: `Disaster alert: ${alert.title}`,
            timestamp: alert.createdAt,
            icon: 'bg-green-500'
          })
        })

        // Sort all activities by timestamp descending and take the latest 3
        const sortedActivities = recentActivities
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 3)

        setRecentActivity(sortedActivities.map(activity => ({
          ...activity,
          timeAgo: timeAgo(new Date(activity.timestamp))
        })))

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 border-2 border-navy-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-navy-900">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-700`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                <div className="w-2 h-2 rounded-full" {...{ className: activity.icon }}></div>
                <div>
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
              <Megaphone className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <span className="text-sm font-medium">New Announcement</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
              <AlertCircle className="w-8 h-8 text-navy-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Emergency Alert</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
              <Trash2 className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <span className="text-sm font-medium">Update Schedule</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
              <FileText className="w-8 h-8 text-navy-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Generate Report</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Helper function to format time ago
function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  let interval = Math.floor(seconds / 31536000)

  if (interval > 1) {
    return interval + ' years ago'
  }
  interval = Math.floor(seconds / 2592000)
  if (interval > 1) {
    return interval + ' months ago'
  }
  interval = Math.floor(seconds / 86400)
  if (interval > 1) {
    return interval + ' days ago'
  }
  interval = Math.floor(seconds / 3600)
  if (interval > 1) {
    return interval + ' hours ago'
  }
  interval = Math.floor(seconds / 60)
  if (interval > 1) {
    return interval + ' minutes ago'
  }
  return Math.floor(seconds) + ' seconds ago'
}