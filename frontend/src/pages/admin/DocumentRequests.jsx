import React, { useState, useEffect } from 'react'
import { Search, FileText, Check, X, Calendar, Clock, Plus, Archive, ArchiveRestore } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import api from '../../services/api.js'
import { toast } from 'react-hot-toast'

export default function DocumentRequests() {
  const [requests, setRequests] = useState([])
  const [archivedRequests, setArchivedRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showArchivedModal, setShowArchivedModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirmItemId, setConfirmItemId] = useState(null)
  const [adminNote, setAdminNote] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  
  // New request state
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [newRequest, setNewRequest] = useState({
    residentId: '',
    docType: '',
    purpose: '',
    supportingInfo: '',
    otherDocType: ''
  })
  const [residents, setResidents] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [filterStatus])

  useEffect(() => {
    fetchResidents()
  }, [])

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

  const fetchRequests = async () => {
    try {
      const url = filterStatus ? `/document-requests?status=${filterStatus}` : '/document-requests'
      const response = await api.get(url)
      setRequests(response.data)
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    }
  }

  const fetchArchivedRequests = async () => {
    try {
      const response = await api.get('/document-requests/archived')
      setArchivedRequests(response.data)
    } catch (error) {
      console.error('Failed to fetch archived requests:', error)
    }
  }

  const fetchResidents = async () => {
    try {
      const response = await api.get('/auth/users?status=approved')
      setResidents(response.data)
    } catch (error) {
      console.error('Failed to fetch residents:', error)
    }
  }

  const handleArchive = async (id) => {
    try {
      await api.delete(`/document-requests/${id}`)
      toast.success('Request archived')
      fetchRequests()
      if (showArchivedModal) fetchArchivedRequests()
    } catch (error) {
      toast.error('Failed to archive request')
    }
  }

  const handleRestore = async (id) => {
    try {
      await api.put(`/document-requests/${id}/restore`)
      toast.success('Request restored')
      fetchArchivedRequests()
    } catch (error) {
      toast.error('Failed to restore request')
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

  const handleNewRequestSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const submitData = { ...newRequest }
      if (newRequest.docType === 'other' && newRequest.otherDocType) {
        submitData.docType = newRequest.otherDocType
      }
      delete submitData.otherDocType
      await api.post('/document-requests', submitData)
      toast.success('Document request created successfully!')
      setShowNewRequestModal(false)
      setIsSubmitting(false)
      setNewRequest({
        residentId: '',
        docType: '',
        purpose: '',
        supportingInfo: '',
        otherDocType: ''
      })
      fetchRequests()
    } catch (error) {
      toast.error('Failed to create request')
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Document Requests</h1>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
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
          <div className="flex gap-2">
            <Button onClick={() => {
              setShowNewRequestModal(true)
            }}>
              <Plus className="w-4 h-4 mr-2 inline" />
              Add Request
            </Button>
            <Button variant="outline" onClick={() => {
              setShowArchivedModal(true)
              fetchArchivedRequests()
            }}>
              <Archive className="w-4 h-4 mr-2 inline" />
              View Archived
            </Button>
          </div>
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
                    <div className="flex gap-2">
                      {request.status === 'Pending' && (
                        <Button size="sm" variant="primary" onClick={() => {
                          setSelectedRequest(request._id)
                          setShowStatusModal(true)
                        }}>
                          Process
                        </Button>
                      )}
                      <button 
                        onClick={() => {
                          setConfirmAction('archive')
                          setConfirmItemId(request._id)
                          setShowConfirmModal(true)
                        }}
                        className="text-orange-600 hover:text-orange-800"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
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

      <Modal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)} 
        title={confirmAction === 'archive' ? 'Confirm Archive' : 'Confirm Restore'}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {confirmAction === 'archive' 
              ? 'Are you sure you want to archive this request? It will be moved to archived items and can be restored later.'
              : 'Are you sure you want to restore this request? It will be moved back to active requests.'}
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
        title="Archived Requests"
        size="lg"
      >
        <div className="space-y-4">
          {archivedRequests.map((request) => (
            <div key={request._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-navy-900">{request.residentId?.fullName}</h3>
                  <p className="text-sm text-gray-600 capitalize">{request.docType?.replace('-', ' ')}</p>
                  <Badge variant={
                    request.status === 'Completed' ? 'success' :
                    request.status === 'Rejected' ? 'danger' : 'warning'
                  }>
                    {request.status}
                  </Badge>
                </div>
                <button 
                  onClick={() => {
                    setConfirmAction('restore')
                    setConfirmItemId(request._id)
                    setShowConfirmModal(true)
                  }}
                  className="text-green-600 hover:text-green-800"
                  title="Restore"
                >
                  <ArchiveRestore className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">{request.purpose}</p>
            </div>
          ))}
          {archivedRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No archived requests
            </div>
          )}
        </div>
      </Modal>
      
      {/* New Request Modal */}
      <Modal 
        isOpen={showNewRequestModal} 
        onClose={() => {
          setShowNewRequestModal(false)
          setNewRequest({
            residentId: '',
            docType: '',
            purpose: '',
            supportingInfo: '',
            otherDocType: ''
          })
        }} 
        title="Add Document Request for Resident"
      >
        <form onSubmit={handleNewRequestSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Resident *</label>
            <select 
              value={newRequest.residentId}
              onChange={(e) => setNewRequest({ ...newRequest, residentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              required
            >
              <option value="">Select Resident</option>
              {residents.map(resident => (
                <option key={resident._id} value={resident._id}>
                  {resident.fullName} ({resident.email})
                </option>
              ))}
            </select>
          </div>
          
          {newRequest.residentId && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <h4 className="font-medium text-navy-900 mb-2">Resident Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Full Name:</span> {residents.find(r => r._id === newRequest.residentId)?.fullName || '-'}</div>
                <div><span className="font-medium">Email:</span> {residents.find(r => r._id === newRequest.residentId)?.email || '-'}</div>
                <div><span className="font-medium">Contact:</span> {residents.find(r => r._id === newRequest.residentId)?.contactNumber || '-'}</div>
                <div><span className="font-medium">Purok/Zone:</span> {residents.find(r => r._id === newRequest.residentId)?.purokZone || '-'}</div>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Document Type *</label>
            <select 
              value={newRequest.docType}
              onChange={(e) => setNewRequest({ ...newRequest, docType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              required
            >
              <option value="">Select Document Type</option>
              <option value="barangay-clearance">Barangay Clearance</option>
              <option value="certificate-of-residency">Certificate of Residency</option>
              <option value="indigency-certificate">Indigency Certificate</option>
              <option value="business-clearance">Business Clearance</option>
              <option value="good-moral-character">Certificate of Good Moral Character</option>
              <option value="other">Others</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Purpose of Request *</label>
            <textarea 
              value={newRequest.purpose}
              onChange={(e) => setNewRequest({ ...newRequest, purpose: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              rows="4"
              required
              placeholder="Please state the purpose for requesting this document"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Supporting Information</label>
            <input 
              value={newRequest.supportingInfo || ''}
              onChange={(e) => setNewRequest({ ...newRequest, supportingInfo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
              placeholder="Additional details (optional)" 
            />
          </div>
          
          {newRequest.docType === 'other' && (
            <div>
              <label className="block text-sm font-medium mb-1">Specify Document *</label>
              <input 
                value={newRequest.otherDocType || ''}
                onChange={(e) => setNewRequest({ ...newRequest, otherDocType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
                placeholder="Enter document type" 
                required 
              />
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setShowNewRequestModal(false)
              setNewRequest({
                residentId: '',
                docType: '',
                purpose: '',
                supportingInfo: '',
                otherDocType: ''
              })
            }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}