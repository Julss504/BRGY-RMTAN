import React from 'react'
import { Send, FileText } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/api.js'
import { toast } from 'react-hot-toast'

const RequestForm = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Document Type *</label>
        <select 
          value={formData.docType} 
          onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
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
        <label className="block text-sm font-medium mb-1 text-navy-800">Purpose of Request *</label>
        <textarea 
          value={formData.purpose}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
          rows="4"
          required
          placeholder="Please state the purpose for requesting this document"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Supporting Information</label>
        <input 
          value={formData.supportingInfo || ''}
          onChange={(e) => setFormData({ ...formData, supportingInfo: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
          placeholder="Additional details (optional)" 
        />
      </div>

      {formData.docType === 'other' && (
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Specify Document *</label>
          <input 
            value={formData.otherDocType || ''}
            onChange={(e) => setFormData({ ...formData, otherDocType: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
            placeholder="Enter document type" 
            required 
          />
        </div>
      )}
    </div>
  )
}

export default function DocumentRequest() {
  const [formData, setFormData] = React.useState({
    docType: '',
    purpose: '',
    supportingInfo: '',
    otherDocType: ''
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const submitData = { ...formData }
      if (formData.docType === 'other' && formData.otherDocType) {
        submitData.docType = formData.otherDocType
      }
      delete submitData.otherDocType
      await api.post('/document-requests', submitData)
      toast.success('Document request submitted successfully!')
      setFormData({ docType: '', purpose: '', supportingInfo: '', otherDocType: '' })
    } catch (error) {
      toast.error('Failed to submit request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Document Request</h1>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RequestForm formData={formData} setFormData={setFormData} />
          
          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}