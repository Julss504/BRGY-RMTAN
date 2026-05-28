import React, { useState, useEffect } from 'react'
import { Calendar, Trash2, Filter } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import api from '../../services/api.js'

export default function WasteSchedule() {
  const [schedules, setSchedules] = useState([])
  const [filterPurok, setFilterPurok] = useState('')

  useEffect(() => {
    fetchSchedules()
  }, [filterPurok])

  const fetchSchedules = async () => {
    try {
      const url = filterPurok ? `/waste-schedules?zone=${filterPurok}` : '/waste-schedules'
      const response = await api.get(url)
      setSchedules(response.data)
    } catch (error) {
      console.error('Failed to fetch schedules:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Waste Collection Schedule</h1>
        <select 
          value={filterPurok}
          onChange={(e) => setFilterPurok(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        >
          <option value="">All Puroks</option>
          <option value="Purok 1">Purok 1</option>
          <option value="Purok 2">Purok 2</option>
          <option value="Purok 3">Purok 3</option>
          <option value="Purok 4">Purok 4</option>
          <option value="Purok 5">Purok 5</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map((schedule) => (
          <Card key={schedule._id} className="hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${
                schedule.wasteType === 'biodegradable' ? 'bg-green-100' :
                schedule.wasteType === 'recyclable' ? 'bg-blue-100' :
                schedule.wasteType === 'non-biodegradable' ? 'bg-orange-100' : 'bg-purple-100'
              }`}>
                <Trash2 className={`w-6 h-6 ${
                  schedule.wasteType === 'biodegradable' ? 'text-green-600' :
                  schedule.wasteType === 'recyclable' ? 'text-blue-600' :
                  schedule.wasteType === 'non-biodegradable' ? 'text-orange-600' : 'text-purple-600'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-navy-900">{schedule.zone}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{(new Date(schedule.date)).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600">{schedule.time}</p>
                <Badge variant="info" className="mt-1 capitalize">
                  {schedule.wasteType?.replace('-', ' ')}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {schedules.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No waste schedules available
        </div>
      )}
    </div>
  )
}