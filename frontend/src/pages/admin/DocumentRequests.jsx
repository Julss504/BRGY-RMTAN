import React, { useState, useEffect } from 'react'
import { Search, FileText, Check, X, Calendar, Clock } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import api from '../../services/api.js'
import { toast } from 'react-hot-toast'

export default function DocumentRequests() {
  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [adminNote, setAdminNote] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [filterStatus])

  const fetchRequests = async () => {
    try {
      const url = filterStatus ? `/document-requests?status=${filterStatus}` : '/document-requests'
      const response = await api.get(url)
      setRequests(response.data)
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    }
  }

  const updateStatus = async (status) => {
    if (!selectedRequest) return
    try {
      await api.put(`/document-requests/${selectedRequest}/status`, { status, adminNote })
      toast.success('Request status updated')
      setShowStatusModal(false)
      setAdminNote('')
      setSelectedRequest(null)
      fetchRequests()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Document Requests</h1>

      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Ready for Pickup">Ready for Pickup</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Resident</th>
                <th className="text-left py-2">Document Type</th>
                <th className="text-left py-2">Purpose</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3">{request.residentId?.fullName || '-'}</td>
                  <td className="py-3 capitalize">{request.docType?.replace('-', ' ')}</td>
                  <td className="py-3 truncate max-w-xs">{request.purpose}</td>
                  <td className="py-3">{(new Date(request.createdAt)).toLocaleDateString()}</td>
                  <td className="py-3">
                    <Badge variant={
                      request.status === 'Completed' ? 'success' :
                      request.status === 'Rejected' ? 'danger' : 'warning'
                    }>
                      {request.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    {request.status === 'Pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="primary" onClick={() => {
                          setSelectedRequest(request._id)
                          setShowStatusModal(true)
                        }}>
                          Process
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {requests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No document requests found
          </div>
        )}
      </Card>

      <Modal 
        isOpen={showStatusModal} 
        onClose={() => setShowStatusModal(false)} 
        title="Update Request Status"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Change status and add admin note:</p>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          >
            <option value="">Select Action</option>
            <option value="Processing">Move to Processing</option>
            <option value="Ready for Pickup">Ready for Pickup</option>
            <option value="Completed">Mark Completed</option>
            <option value="Rejected">Reject</option>
          </select>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Add a note for the resident (optional)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            rows="3"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowStatusModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => updateStatus(selectedStatus)}>
              Update Status
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}