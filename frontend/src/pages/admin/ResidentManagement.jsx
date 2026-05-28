import React, { useState, useEffect } from 'react'
import { Search, Check, X } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import api from '../../services/api.js'
import { toast } from 'react-hot-toast'

export default function ResidentManagement() {
  const [residents, setResidents] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [denyReason, setDenyReason] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPurok, setFilterPurok] = useState('')

  useEffect(() => {
    fetchResidents()
    fetchPendingUsers()
  }, [])

  const fetchResidents = async () => {
    try {
      const response = await api.get('/auth/users?status=approved')
      setResidents(response.data)
    } catch (error) {
      console.error('Failed to fetch residents:', error)
    }
  }

  const fetchPendingUsers = async () => {
    try {
      const response = await api.get('/auth/users?status=pending')
      setPendingUsers(response.data)
    } catch (error) {
      console.error('Failed to fetch pending users:', error)
    }
  }

  const handleApprove = async (userId) => {
    try {
      await api.put(`/auth/users/${userId}/status`, { status: 'approved' })
      toast.success('User approved successfully')
      fetchPendingUsers()
    } catch (error) {
      toast.error('Failed to approve user')
    }
  }

  const handleDeny = async () => {
    if (!selectedUser) return
    try {
      await api.put(`/auth/users/${selectedUser}/status`, { 
        status: 'denied', 
        denyReason 
      })
      toast.success('User denied')
      setShowApprovalModal(false)
      setDenyReason('')
      setSelectedUser(null)
      fetchPendingUsers()
    } catch (error) {
      toast.error('Failed to deny user')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Resident Management</h1>

      {/* Pending Approvals Section */}
      {pendingUsers.length > 0 && (
        <Card className="mb-6 border-orange-500">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Pending Registrations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Contact</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100">
                    <td className="py-3">{user.fullName}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3">{user.contactNumber || '-'}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="primary"
                          onClick={() => handleApprove(user._id)}
                        >
                          <Check className="w-4 h-4 mr-1 inline" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user._id)
                            setShowApprovalModal(true)
                          }}
                        >
                          <X className="w-4 h-4 mr-1 inline" />
                          Deny
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Resident List */}
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search residents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Role</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {residents.map((resident) => (
                <tr key={resident._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3">{resident.fullName}</td>
                  <td className="py-3">{resident.email}</td>
                  <td className="py-3 capitalize">{resident.role}</td>
                  <td className="py-3">
                    <Badge variant={resident.status === 'approved' ? 'success' : 'warning'}>
                      {resident.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={showApprovalModal} 
        onClose={() => setShowApprovalModal(false)} 
        title="Deny Registration"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Please provide a reason for denying this registration:</p>
          <textarea
            value={denyReason}
            onChange={(e) => setDenyReason(e.target.value)}
            placeholder="Reason for denial..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            rows="3"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeny}>
              Deny Registration
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}