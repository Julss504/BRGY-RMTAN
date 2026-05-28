const mongoose = require('mongoose');

const residentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Personal Information
  fullName: { type: String, trim: true },
  nickname: { type: String, trim: true },
  dateOfBirth: { type: Date },
  sex: { type: String, enum: ['Male', 'Female'], trim: true },
  civilStatus: { type: String, enum: ['Single', 'Married', 'Widowed', 'Separated', 'Divorced', 'Annulled'], trim: true },
  religion: { type: String, trim: true },
  nationality: { type: String, trim: true },
  placeOfBirth: { type: String, trim: true },
  contactNumber: { type: String, trim: true },
  emailAddress: { type: String, trim: true },
  // Address Information
  houseUnitNo: { type: String, trim: true },
  street: { type: String, trim: true },
  purokZone: { type: String, trim: true },
  barangay: { type: String, trim: true, default: 'R.M. Tan' },
  municipality: { type: String, trim: true, default: 'Manila' },
  province: { type: String, trim: true, default: 'Metro Manila' },
  // Family Background
  fatherFullName: { type: String, trim: true },
  fatherOccupation: { type: String, trim: true },
  fatherContact: { type: String, trim: true },
  fatherLivingStatus: { type: String, enum: ['Living', 'Deceased'], trim: true },
  motherFullName: { type: String, trim: true },
  motherOccupation: { type: String, trim: true },
  motherContact: { type: String, trim: true },
  motherLivingStatus: { type: String, enum: ['Living', 'Deceased'], trim: true },
  numberOfSiblings: { type: Number, default: 0 },
  positionInFamily: { type: Number, default: 1 },
  // Education & Employment
  educationAttainment: { type: String, trim: true },
  currentSchool: { type: String, trim: true },
  employer: { type: String, trim: true },
  occupation: { type: String, trim: true },
  employmentStatus: { type: String, enum: ['employed', 'unemployed', 'self-employed', 'student', 'PWD', 'senior-citizen'], trim: true },
  // Other Information
  voterRegistrationStatus: { type: String, enum: ['Registered', 'Not Registered'], trim: true },
  beneficiary4Ps: { type: Boolean, default: false },
  philhealthMember: { type: Boolean, default: false },
  sssMember: { type: Boolean, default: false },
  gsisMember: { type: Boolean, default: false },
  emergencyContactPerson: { type: String, trim: true },
  emergencyContactRelationship: { type: String, trim: true },
  profileCompleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('ResidentProfile', residentProfileSchema);