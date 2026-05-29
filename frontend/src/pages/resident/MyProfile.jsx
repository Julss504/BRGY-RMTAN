import React, { useEffect, useState } from 'react'
import MultilineWizard from '../../components/forms/MultilineWizard.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import api from '../../services/api.js'
import { toast } from 'react-hot-toast'
import Button from '../../components/ui/Button.jsx'

const PersonalInfoStep = ({ data, editable }) => {
  const age = data.dateOfBirth ? new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear() : ''
  
  const inputClassName = editable 
    ? "w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
    : "w-full px-3 py-2 border rounded-lg bg-gray-100"
  const selectClassName = editable 
    ? "w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
    : "w-full px-3 py-2 border rounded-lg bg-gray-100"
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Full Name</label>
          <input name="fullName" defaultValue={data.fullName} className={inputClassName} required={editable} readOnly={!editable} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Nickname</label>
          <input name="nickname" defaultValue={data.nickname} className={inputClassName} readOnly={!editable} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Date of Birth</label>
          <input name="dateOfBirth" type="date" defaultValue={data.dateOfBirth?.split('T')[0]} className={inputClassName} required={editable} readOnly={!editable} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Age (Auto-calculated)</label>
          <input name="age" value={age} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100" placeholder={age || 'Auto-calculated'} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Sex</label>
          <select name="sex" defaultValue={data.sex} className={selectClassName} required={editable} disabled={!editable}>
            <option value="">Select Sex</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Civil Status</label>
          <select name="civilStatus" defaultValue={data.civilStatus} className={selectClassName} required={editable} disabled={!editable}>
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
          <input name="religion" defaultValue={data.religion} className={inputClassName} readOnly={!editable} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Nationality</label>
          <input name="nationality" defaultValue={data.nationality || 'Filipino'} className={inputClassName} readOnly={!editable} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Place of Birth</label>
          <input name="placeOfBirth" defaultValue={data.placeOfBirth} className={inputClassName} placeholder="City, Province" readOnly={!editable} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Contact Number</label>
          <input maxLength={11} minLength={11} name="contactNumber" defaultValue={data.contactNumber} className={inputClassName} required={editable} readOnly={!editable} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Email Address</label>
          <input name="emailAddress" type="email" defaultValue={data.emailAddress} className={inputClassName} readOnly={!editable} />
        </div>
      </div>
    </div>
  )
}

const AddressStep = ({ data, editable }) => {
  const inputClassName = editable 
    ? "w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
    : "w-full px-3 py-2 border rounded-lg bg-gray-100"
  const selectClassName = editable 
    ? "w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
    : "w-full px-3 py-2 border rounded-lg bg-gray-100"

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">House/Unit No.</label>
          <input name="houseUnitNo" defaultValue={data.houseUnitNo} className={inputClassName} required={editable} readOnly={!editable} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Purok/Zone</label>
          <select name="purokZone" defaultValue={data.purokZone} className={selectClassName} required={editable} disabled={!editable}>
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
        <label className="block text-sm font-medium mb-1 text-navy-800">Street</label>
        <input name="street" defaultValue={data.street} className={inputClassName} required={editable} readOnly={!editable} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Barangay</label>
          <input name="barangay" defaultValue={data.barangay || 'R.M. Tan'} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">City</label>
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

const FamilyStep = ({ data, editable }) => {
  const inputClassName = editable 
    ? "w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
    : "w-full px-3 py-2 border rounded-lg bg-gray-100"
  const selectClassName = editable 
    ? "w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
    : "w-full px-3 py-2 border rounded-lg bg-gray-100"

  return (
    <div className="space-y-4">
      <div className="border-b pb-4 mb-4">
        <h3 className="font-medium text-navy-900 mb-2">Father's Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Full Name</label>
            <input name="fatherFullName" defaultValue={data.fatherFullName} className={inputClassName} readOnly={!editable} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Occupation</label>
            <input name="fatherOccupation" defaultValue={data.fatherOccupation} className={inputClassName} readOnly={!editable} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Contact Number</label>
            <input maxLength={11} minLength={11} name="fatherContact" defaultValue={data.fatherContact} className={inputClassName} readOnly={!editable} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Living Status</label>
            <select name="fatherLivingStatus" defaultValue={data.fatherLivingStatus} className={selectClassName} disabled={!editable}>
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
            <input name="motherFullName" defaultValue={data.motherFullName} className={inputClassName} readOnly={!editable} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Occupation</label>
            <input name="motherOccupation" defaultValue={data.motherOccupation} className={inputClassName} readOnly={!editable} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Contact Number</label>
            <input maxLength={11} minLength={11} name="motherContact" defaultValue={data.motherContact} className={inputClassName} readOnly={!editable} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-navy-800">Living Status</label>
            <select name="motherLivingStatus" defaultValue={data.motherLivingStatus} className={selectClassName} disabled={!editable}>
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
          <input name="numberOfSiblings" type="number" min="0" defaultValue={data.numberOfSiblings || 0} className={inputClassName} readOnly={!editable} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-navy-800">Position in Family</label>
          <input name="positionInFamily" type="number" min="1" defaultValue={data.positionInFamily || 1} className={inputClassName} readOnly={!editable} />
        </div>
      </div>
    </div>
  )
}

const EducationStep = ({ data, editable }) => {
  const inputClassName = editable 
    ? "w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
    : "w-full px-3 py-2 border rounded-lg bg-gray-100"
  const selectClassName = editable 
    ? "w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
    : "w-full px-3 py-2 border rounded-lg bg-gray-100"

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Highest Educational Attainment</label>
        <select name="educationAttainment" defaultValue={data.educationAttainment} className={selectClassName} required={editable} disabled={!editable}>
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
        <input name="currentSchool" defaultValue={data.currentSchool} className={inputClassName} placeholder="School name" readOnly={!editable} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Employer / Occupation</label>
        <input name="employer" defaultValue={data.employer} className={inputClassName} placeholder="Company or job title" readOnly={!editable} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Employment Status</label>
        <select name="employmentStatus" defaultValue={data.employmentStatus} className={selectClassName} required={editable} disabled={!editable}>
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

const OtherInfoStep = ({ data, editable }) => {
  const inputClassName = editable 
    ? "w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
    : "w-full px-3 py-2 border rounded-lg bg-gray-100"
  const selectClassName = editable 
    ? "w-full px-3 py-2 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200" 
    : "w-full px-3 py-2 border rounded-lg bg-gray-100"

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Voter Registration Status</label>
        <select name="voterRegistrationStatus" defaultValue={data.voterRegistrationStatus} className={selectClassName} disabled={!editable}>
          <option value="">Select Status</option>
          <option>Registered</option>
          <option>Not Registered</option>
        </select>
      </div>

      <div className="flex items-center">
        <input name="beneficiary4Ps" type="checkbox" defaultChecked={data.beneficiary4Ps || false} className="w-4 h-4 text-orange-500 border rounded focus:ring-orange-500" disabled={!editable} />
        <label className="ml-2 text-sm text-navy-800">4Ps Beneficiary</label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-navy-800">Government Memberships</label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input name="philhealthMember" type="checkbox" defaultChecked={data.philhealthMember || false} className="w-4 h-4 text-orange-500 border rounded focus:ring-orange-500" disabled={!editable} />
            <span className="ml-2 text-sm text-navy-800">PhilHealth Member</span>
          </label>
          <label className="flex items-center">
            <input name="sssMember" type="checkbox" defaultChecked={data.sssMember || false} className="w-4 h-4 text-orange-500 border rounded focus:ring-orange-500" disabled={!editable} />
            <span className="ml-2 text-sm text-navy-800">SSS Member</span>
          </label>
          <label className="flex items-center">
            <input name="gsisMember" type="checkbox" defaultChecked={data.gsisMember || false} className="w-4 h-4 text-orange-500 border rounded focus:ring-orange-500" disabled={!editable} />
            <span className="ml-2 text-sm text-navy-800">GSIS Member</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Emergency Contact Person</label>
        <input maxLength={11} minLength={11} name="emergencyContactPerson" defaultValue={data.emergencyContactPerson} className={inputClassName} required={editable} readOnly={!editable} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-navy-800">Emergency Contact Relationship</label>
        <input name="emergencyContactRelationship" defaultValue={data.emergencyContactRelationship} className={inputClassName} required={editable} placeholder="e.g., Spouse, Parent, Sibling" readOnly={!editable} />
      </div>
    </div>
  )
}

const DisplayProfile = ({ data, onEdit }) => {
  const age = data.dateOfBirth ? new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear() : ''
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-navy-900">My Barangay Record</h2>
          <p className="text-gray-600">Your profile information is displayed below</p>
        </div>
        <Button variant="outline" onClick={onEdit}>Edit Profile</Button>
      </div>

      <div className="border-b pb-4">
        <h3 className="font-medium text-navy-800 mb-3">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><span className="font-medium">Full Name:</span> {data.fullName || '-'}</div>
          <div><span className="font-medium">Nickname:</span> {data.nickname || '-'}</div>
          <div><span className="font-medium">Date of Birth:</span> {data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : '-'}</div>
          <div><span className="font-medium">Age:</span> {age || '-'}</div>
          <div><span className="font-medium">Sex:</span> {data.sex || '-'}</div>
          <div><span className="font-medium">Civil Status:</span> {data.civilStatus || '-'}</div>
          <div><span className="font-medium">Religion:</span> {data.religion || '-'}</div>
          <div><span className="font-medium">Nationality:</span> {data.nationality || '-'}</div>
          <div><span className="font-medium">Place of Birth:</span> {data.placeOfBirth || '-'}</div>
          <div><span className="font-medium">Contact Number:</span> {data.contactNumber || '-'}</div>
          <div><span className="font-medium">Email:</span> {data.emailAddress || '-'}</div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="font-medium text-navy-800 mb-3">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><span className="font-medium">House/Unit No.:</span> {data.houseUnitNo || '-'}</div>
          <div><span className="font-medium">Purok/Zone:</span> {data.purokZone || '-'}</div>
          <div><span className="font-medium">Street:</span> {data.street || '-'}</div>
          <div><span className="font-medium">Barangay:</span> {data.barangay || 'R.M. Tan'}</div>
          <div><span className="font-medium">City:</span> {data.municipality || 'Ormoc'}</div>
          <div><span className="font-medium">Province:</span> {data.province || 'Leyte'}</div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="font-medium text-navy-800 mb-3">Family Background</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><span className="font-medium">Father's Name:</span> {data.fatherFullName || '-'}</div>
          <div><span className="font-medium">Father's Occupation:</span> {data.fatherOccupation || '-'}</div>
          <div><span className="font-medium">Father's Contact:</span> {data.fatherContact || '-'}</div>
          <div><span className="font-medium">Father's Status:</span> {data.fatherLivingStatus || '-'}</div>
          <div><span className="font-medium">Mother's Name:</span> {data.motherFullName || '-'}</div>
          <div><span className="font-medium">Mother's Occupation:</span> {data.motherOccupation || '-'}</div>
          <div><span className="font-medium">Mother's Contact:</span> {data.motherContact || '-'}</div>
          <div><span className="font-medium">Mother's Status:</span> {data.motherLivingStatus || '-'}</div>
          <div><span className="font-medium">No. of Siblings:</span> {data.numberOfSiblings ?? 0}</div>
          <div><span className="font-medium">Position in Family:</span> {data.positionInFamily ?? 1}</div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="font-medium text-navy-800 mb-3">Education & Employment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><span className="font-medium">Education Attainment:</span> {data.educationAttainment || '-'}</div>
          <div><span className="font-medium">Current School:</span> {data.currentSchool || '-'}</div>
          <div><span className="font-medium">Employer:</span> {data.employer || '-'}</div>
          <div><span className="font-medium">Employment Status:</span> {data.employmentStatus || '-'}</div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-navy-800 mb-3">Other Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><span className="font-medium">Voter Status:</span> {data.voterRegistrationStatus || '-'}</div>
          <div><span className="font-medium">4Ps Beneficiary:</span> {data.beneficiary4Ps ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">PhilHealth Member:</span> {data.philhealthMember ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">SSS Member:</span> {data.sssMember ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">GSIS Member:</span> {data.gsisMember ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Emergency Contact:</span> {data.emergencyContactPerson || '-'}</div>
          <div><span className="font-medium">Relationship:</span> {data.emergencyContactRelationship || '-'}</div>
        </div>
      </div>
    </div>
  )
}

export default function MyProfile() {
  const { user, setUser } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)

  const steps = [
    {
      title: 'Personal Information',
      description: 'Full name, birth details, contact info',
      component: (props) => <PersonalInfoStep {...props} editable={true} />,
    },
    {
      title: 'Address Information',
      description: 'House number, street, purok/zone',
      component: (props) => <AddressStep {...props} editable={true} />,
    },
    {
      title: 'Family Background',
      description: 'Parents and family composition',
      component: (props) => <FamilyStep {...props} editable={true} />,
    },
    {
      title: 'Education & Employment',
      description: 'School, employer, and work status',
      component: (props) => <EducationStep {...props} editable={true} />,
    },
    {
      title: 'Other Information',
      description: 'Voter status, memberships, emergency contact',
      component: (props) => <OtherInfoStep {...props} editable={true} />,
    },
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile-settings/me')
        setProfileData(response.data)
      } catch (error) {
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
        await api.put('/profile-settings/me', {
          ...data,
          profileCompleted: true
        })
      } else {
        await api.post('/profile-settings', {
          ...data,
          profileCompleted: true
        })
      }
      toast.success('Profile saved successfully!')
      const [userData, profileResponse] = await Promise.all([
        api.get('/auth/me'),
        api.get('/profile-settings/me')
      ])
      setUser(userData.data)
      setProfileData(profileResponse.data)
      setEditMode(false)
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

  if (!profileData || editMode) {
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

  return (
    <div>
      <DisplayProfile data={profileData} onEdit={() => setEditMode(true)} />
    </div>
  )
}