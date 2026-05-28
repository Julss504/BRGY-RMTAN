import React, { useState, useEffect } from 'react'
import { AlertCircle, Shield, Phone, ExternalLink } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import api from '../../services/api.js'

export default function DisasterAwareness() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/disaster-alerts?isActive=true')
      setAlerts(response.data)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    }
  }

  const criticalAlerts = alerts.filter(a => a.riskLevel === 'Critical' || a.riskLevel === 'High')

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Disaster Awareness Center</h1>

      {/* Active Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-red-600 mb-3">Active Alerts</h2>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <Card key={alert._id} className="border-l-4 border-red-500 bg-red-50">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg animate-pulse">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-navy-900">{alert.title}</h3>
                      <Badge variant="danger" className="capitalize">{alert.riskLevel}</Badge>
                    </div>
                    <p className="text-gray-700 mb-2">{alert.description}</p>
                    {alert.actions && alert.actions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-navy-800">Recommended Actions:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {alert.actions.map((action, idx) => (
                            <li key={idx}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Hotline */}
      <Card className="mb-6">
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-navy-700" />
          <h3 className="font-semibold text-navy-900">Emergency Hotline</h3>
        </div>
        <p className="text-2xl font-bold text-orange-600 mt-2">911 / 16131</p>
        <p className="text-sm text-gray-600 mt-1">For immediate assistance and emergency response</p>
      </Card>

      {/* All Alerts */}
      <h2 className="text-lg font-semibold text-navy-900 mb-3">All Disaster Alerts</h2>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert._id} className="hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                alert.riskLevel === 'Critical' || alert.riskLevel === 'High' ? 'bg-red-100' :
                alert.riskLevel === 'Moderate' ? 'bg-orange-100' : 'bg-navy-100'
              }`}>
                <AlertCircle className={`w-5 h-5 ${
                  alert.riskLevel === 'Critical' || alert.riskLevel === 'High' ? 'text-red-600' :
                  alert.riskLevel === 'Moderate' ? 'text-orange-600' : 'text-navy-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-navy-900">{alert.title}</h3>
                  <Badge variant={
                    alert.riskLevel === 'Critical' ? 'danger' :
                    alert.riskLevel === 'High' ? 'warning' : 'info'
                  } className="capitalize">
                    {alert.riskLevel}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">{alert.description}</p>
                {alert.actions && alert.actions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-navy-800">Recommended Actions:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {alert.actions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        
        {alerts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No disaster alerts to display
          </div>
        )}
      </div>
    </div>
  )
}