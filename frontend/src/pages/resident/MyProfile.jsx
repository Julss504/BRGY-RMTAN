import React, { useEffect, useState } from 'react'
import MultilineWizard from '../../components/forms/MultilineWizard.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import api from '../../services/api.js'
import { toast } from 'react-hot-toast'

const PersonalInfoStep = ({ data }) => {
  const age = data.dateOfBirth ? new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear() : ''
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Full Name *</label>
          <input name="fullName" defaultValue={data.fullName} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Nickname</label>
          <input name="nickname" defaultValue={data.nickname} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Date of Birth *</label>
          <input name="dateOfBirth" type="date" defaultValue={data.dateOfBirth?.split('T')[0]} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Age (Auto-calculated)</label>
          <input name="age" value={age} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100" placeholder={age || 'Auto-calculated'} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Sex *</label>
          <select name="sex" defaultValue={data.sex} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" required>
            <option value="">Select Sex</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Civil Status *</label>
          <select name="civilStatus" defaultValue={data.civilStatus} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" required>
            <option value="">Select Status</option>
            <option>Single</option>
            <option>Married</option>
            <option>Widowed</option>
            <option>Separated</option>
            <option>Divorced</option>
            <option>Annulled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Religion</label>
          <input name="religion" defaultValue={data.religion} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Nationality</label>
          <input name="nationality" defaultValue={data.nationality || 'Filipino'} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Place of Birth</label>
          <input name="placeOfBirth" defaultValue={data.placeOfBirth} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" placeholder="City, Province" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Contact Number *</label>
          <input maxLength={11} minLength={11} name="contactNumber" defaultValue={data.contactNumber} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Email Address</label>
          <input name="emailAddress" type="email" defaultValue={data.emailAddress} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
        </div>
      </div>
    </div>
  )
}

const AddressStep = ({ data }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">House/Unit No. *</label>
          <input name="houseUnitNo" defaultValue={data.houseUnitNo} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Purok/Zone *</label>
          <select name="purokZone" defaultValue={data.purokZone} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" required>
            <option value="">Select Purok/Zone</option>
            <option>Purok 1</option>
            <option>Purok 2</option>
            <option>Purok 3</option>
            <option>Purok 4</option>
            <option>Purok 5</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Street *</label>
        <input name="street" defaultValue={data.street} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Barangay</label>
          <input name="barangay" defaultValue={data.barangay || 'R.M. Tan'} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Municipality</label>
          <input name="municipality" defaultValue={data.municipality || 'Ormoc'} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Province</label>
          <input name="province" defaultValue={data.province || 'Leyte'} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
        </div>
      </div>
    </div>
  )
}

const FamilyStep = ({ data }) => {
  return (
    <div className="space-y-4">
      <div className="border-b pb-4 mb-4">
        <h3 className="font-medium text-navy-900 mb-2">Father's Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Full Name</label>
            <input name="fatherFullName" defaultValue={data.fatherFullName} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Occupation</label>
            <input name="fatherOccupation" defaultValue={data.fatherOccupation} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Contact Number</label>
            <input maxLength={11} minLength={11} name="fatherContact" defaultValue={data.fatherContact} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Living Status</label>
            <select name="fatherLivingStatus" defaultValue={data.fatherLivingStatus} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
              <option value="">Select Status</option>
              <option>Living</option>
              <option>Deceased</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-b pb-4 mb-4">
        <h3 className="font-medium text-navy-900 mb-2">Mother's Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Full Name</label>
            <input name="motherFullName" defaultValue={data.motherFullName} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Occupation</label>
            <input name="motherOccupation" defaultValue={data.motherOccupation} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Contact Number</label>
            <input maxLength={11} minLength={11} name="motherContact" defaultValue={data.motherContact} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Living Status</label>
            <select name="motherLivingStatus" defaultValue={data.motherLivingStatus} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
              <option value="">Select Status</option>
              <option>Living</option>
              <option>Deceased</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Number of Siblings</label>
          <input name="numberOfSiblings" type="number" min="0" defaultValue={data.numberOfSiblings || 0} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Position in Family</label>
          <input name="positionInFamily" type="number" min="1" defaultValue={data.positionInFamily || 1} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
        </div>
      </div>
    </div>
  )
}

const EducationStep = ({ data }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Highest Educational Attainment *</label>
        <select name="educationAttainment" defaultValue={data.educationAttainment} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" required>
          <option value="">Select Education Level</option>
          <option>Elementary Undergraduate</option>
          <option>Elementary Graduate</option>
          <option>High School Undergraduate</option>
          <option>High School Graduate</option>
          <option>College Undergraduate</option>
          <option>College Graduate</option>
          <option>Post Graduate</option>
          <option>No Formal Education</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Current School (if student)</label>
        <input name="currentSchool" defaultValue={data.currentSchool} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" placeholder="School name" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Employer / Occupation</label>
        <input name="employer" defaultValue={data.employer} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" placeholder="Company or job title" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Employment Status *</label>
        <select name="employmentStatus" defaultValue={data.employmentStatus} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" required>
          <option value="">Select Status</option>
          <option>employed</option>
          <option>unemployed</option>
          <option>self-employed</option>
          <option>student</option>
          <option>PWD</option>
          <option>senior-citizen</option>
        </select>
      </div>
    </div>
  )
}

const OtherInfoStep = ({ data }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Voter Registration Status</label>
        <select name="voterRegistrationStatus" defaultValue={data.voterRegistrationStatus} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
          <option value="">Select Status</option>
          <option>Registered</option>
          <option>Not Registered</option>
        </select>
      </div>

      <div className="flex items-center">
        <input name="beneficiary4Ps" type="checkbox" defaultChecked={data.beneficiary4Ps || false} className="w-4 h-4 text-orange-500 border rounded focus:ring-orange-500" />
        <label className="ml-2 text-sm text-navy-800">4Ps Beneficiary</label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-navy-800">Government Memberships</label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input name="philhealthMember" type="checkbox" defaultChecked={data.philhealthMember || false} className="w-4 h-4 text-orange-500 border rounded focus:ring-orange-500" />
            <span className="ml-2 text-sm text-navy-800">PhilHealth Member</span>
          </label>
          <label className="flex items-center">
            <input name="sssMember" type="checkbox" defaultChecked={data.sssMember || false} className="w-4 h-4 text-orange-500 border rounded focus:ring-orange-500" />
            <span className="ml-2 text-sm text-navy-800">SSS Member</span>
          </label>
          <label className="flex items-center">
            <input name="gsisMember" type="checkbox" defaultChecked={data.gsisMember || false} className="w-4 h-4 text-orange-500 border rounded focus:ring-orange-500" />
            <span className="ml-2 text-sm text-navy-800">GSIS Member</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Emergency Contact Person *</label>
        <input maxLength={11} minLength={11} name="emergencyContactPerson" defaultValue={data.emergencyContactPerson} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Emergency Contact Relationship *</label>
        <input name="emergencyContactRelationship" defaultValue={data.emergencyContactRelationship} className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" required placeholder="e.g., Spouse, Parent, Sibling" />
      </div>
    </div>
  )
}

export default function MyProfile() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  const steps = [
    {
      title: 'Personal Information',
      description: 'Full name, birth details, contact info',
      component: PersonalInfoStep,
    },
    {
      title: 'Address Information',
      description: 'House number, street, purok/zone',
      component: AddressStep,
    },
    {
      title: 'Family Background',
      description: 'Parents and family composition',
      component: FamilyStep,
    },
    {
      title: 'Education & Employment',
      description: 'School, employer, and work status',
      component: EducationStep,
    },
    {
      title: 'Other Information',
      description: 'Voter status, memberships, emergency contact',
      component: OtherInfoStep,
    },
  ]

    useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile/me')
        setProfileData(response.data)
      } catch (error) {
        // If no profile exists, that's okay - we'll create one
        if (error.response?.status !== 404) {
          toast.error('Failed to load profile')
        }
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user])

    const handleSubmit = async (data) => {
      try {
        if (profileData) {
          // Update existing profile
          await api.put('/profile/me', {
            ...data,
            profileCompleted: true
          })
        } else {
          // Create new profile
          await api.post('/profile', {
            ...data,
            profileCompleted: true
          })
        }
        toast.success('Profile saved successfully!')
      } catch (error) {
        toast.error('Failed to save profile')
      }
    }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-navy-900 mb-6">My Barangay Record</h1>
        <p className="text-gray-600 mb-6">Loading your profile...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 mb-6">My Barangay Record</h1>
      <p className="text-gray-600 mb-6">Please complete your barangay profile to access all features</p>
<MultilineWizard 
  steps={steps} 
  onComplete={handleSubmit}
  defaultValues={profileData || {}}
/>
    </div>
  )
}