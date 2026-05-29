import React, { useState, useEffect } from 'react'
import { Search, Check, X, Eye } from 'lucide-react'
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
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedResidentDetails, setSelectedResidentDetails] = useState(null)

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

  const fetchResidentDetails = async (userId) => {
    try {
      const profileResponse = await api.get(`/profile-settings/${userId}`)
      const userResponse = await api.get(`/auth/users/${userId}`)
      setSelectedResidentDetails({
        ...userResponse.data,
        profile: profileResponse.data
      })
      setShowDetailsModal(true)
    } catch (error) {
      console.error('Failed to fetch resident details:', error)
      toast.error('Failed to load resident details')
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

  const filteredResidents = residents.filter((resident) => {
    const matchesSearch = searchTerm === '' ||
      resident.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPurok = filterPurok === '' || resident.purokZone === filterPurok;
    return matchesSearch && matchesPurok;
  });

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
<th className="text-left py-2">Purok/Zone</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResidents.map((resident) => (
                  <tr key={resident._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">{resident.fullName}</td>
                    <td className="py-3">{resident.email}</td>
                    <td className="py-3">{resident.purokZone || '-'}</td>
                    <td className="py-3">
                      <Badge variant={resident.status === 'approved' ? 'success' : 'warning'}>
                        {resident.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => fetchResidentDetails(resident._id)}
                      >
                        <Eye className="w-4 h-4 mr-1 inline" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
{filteredResidents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No residents found matching your criteria
                    </td>
                  </tr>
                )}
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

      <Modal 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)} 
        title="Resident Details"
        size="lg"
      >
        {selectedResidentDetails && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-medium text-navy-800 mb-3">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><span className="font-medium">Full Name:</span> {selectedResidentDetails.fullName || '-'}</div>
                <div><span className="font-medium">Email:</span> {selectedResidentDetails.email || '-'}</div>
                <div><span className="font-medium">Contact Number:</span> {selectedResidentDetails.contactNumber || '-'}</div>
                <div><span className="font-medium">Status:</span> <Badge variant={selectedResidentDetails.status === 'approved' ? 'success' : 'warning'}>{selectedResidentDetails.status}</Badge></div>
              </div>
            </div>

            {selectedResidentDetails.profile && (
              <>
                <div className="border-b pb-4">
                  <h3 className="font-medium text-navy-800 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div><span className="font-medium">Full Name:</span> {selectedResidentDetails.profile.fullName || '-'}</div>
                    <div><span className="font-medium">Nickname:</span> {selectedResidentDetails.profile.nickname || '-'}</div>
                    <div><span className="font-medium">Date of Birth:</span> {selectedResidentDetails.profile.dateOfBirth ? new Date(selectedResidentDetails.profile.dateOfBirth).toLocaleDateString() : '-'}</div>
                    <div><span className="font-medium">Age:</span> {selectedResidentDetails.profile.dateOfBirth ? new Date().getFullYear() - new Date(selectedResidentDetails.profile.dateOfBirth).getFullYear() : '-'}</div>
                    <div><span className="font-medium">Sex:</span> {selectedResidentDetails.profile.sex || '-'}</div>
                    <div><span className="font-medium">Civil Status:</span> {selectedResidentDetails.profile.civilStatus || '-'}</div>
                    <div><span className="font-medium">Religion:</span> {selectedResidentDetails.profile.religion || '-'}</div>
                    <div><span className="font-medium">Nationality:</span> {selectedResidentDetails.profile.nationality || '-'}</div>
                    <div><span className="font-medium">Place of Birth:</span> {selectedResidentDetails.profile.placeOfBirth || '-'}</div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-medium text-navy-800 mb-3">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div><span className="font-medium">House/Unit No.:</span> {selectedResidentDetails.profile.houseUnitNo || '-'}</div>
                    <div><span className="font-medium">Purok/Zone:</span> {selectedResidentDetails.profile.purokZone || '-'}</div>
                    <div><span className="font-medium">Street:</span> {selectedResidentDetails.profile.street || '-'}</div>
                    <div><span className="font-medium">Barangay:</span> {selectedResidentDetails.profile.barangay || 'R.M. Tan'}</div>
                    <div><span className="font-medium">City:</span> {selectedResidentDetails.profile.municipality || 'Ormoc'}</div>
                    <div><span className="font-medium">Province:</span> {selectedResidentDetails.profile.province || 'Leyte'}</div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-medium text-navy-800 mb-3">Family Background</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div><span className="font-medium">Father's Name:</span> {selectedResidentDetails.profile.fatherFullName || '-'}</div>
                    <div><span className="font-medium">Father's Occupation:</span> {selectedResidentDetails.profile.fatherOccupation || '-'}</div>
                    <div><span className="font-medium">Father's Contact:</span> {selectedResidentDetails.profile.fatherContact || '-'}</div>
                    <div><span className="font-medium">Father's Status:</span> {selectedResidentDetails.profile.fatherLivingStatus || '-'}</div>
                    <div><span className="font-medium">Mother's Name:</span> {selectedResidentDetails.profile.motherFullName || '-'}</div>
                    <div><span className="font-medium">Mother's Occupation:</span> {selectedResidentDetails.profile.motherOccupation || '-'}</div>
                    <div><span className="font-medium">Mother's Contact:</span> {selectedResidentDetails.profile.motherContact || '-'}</div>
                    <div><span className="font-medium">Mother's Status:</span> {selectedResidentDetails.profile.motherLivingStatus || '-'}</div>
                    <div><span className="font-medium">No. of Siblings:</span> {selectedResidentDetails.profile.numberOfSiblings ?? 0}</div>
                    <div><span className="font-medium">Position in Family:</span> {selectedResidentDetails.profile.positionInFamily ?? 1}</div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-medium text-navy-800 mb-3">Education & Employment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div><span className="font-medium">Education Attainment:</span> {selectedResidentDetails.profile.educationAttainment || '-'}</div>
                    <div><span className="font-medium">Current School:</span> {selectedResidentDetails.profile.currentSchool || '-'}</div>
                    <div><span className="font-medium">Employer:</span> {selectedResidentDetails.profile.employer || '-'}</div>
                    <div><span className="font-medium">Employment Status:</span> {selectedResidentDetails.profile.employmentStatus || '-'}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-navy-800 mb-3">Other Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div><span className="font-medium">Voter Status:</span> {selectedResidentDetails.profile.voterRegistrationStatus || '-'}</div>
                    <div><span className="font-medium">4Ps Beneficiary:</span> {selectedResidentDetails.profile.beneficiary4Ps ? 'Yes' : 'No'}</div>
                    <div><span className="font-medium">PhilHealth Member:</span> {selectedResidentDetails.profile.philhealthMember ? 'Yes' : 'No'}</div>
                    <div><span className="font-medium">SSS Member:</span> {selectedResidentDetails.profile.sssMember ? 'Yes' : 'No'}</div>
                    <div><span className="font-medium">GSIS Member:</span> {selectedResidentDetails.profile.gsisMember ? 'Yes' : 'No'}</div>
                    <div><span className="font-medium">Emergency Contact:</span> {selectedResidentDetails.profile.emergencyContactPerson || '-'}</div>
                    <div><span className="font-medium">Relationship:</span> {selectedResidentDetails.profile.emergencyContactRelationship || '-'}</div>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}