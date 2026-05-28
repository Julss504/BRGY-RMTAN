const mongoose = require('mongoose');

const documentRequestSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  docType: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Ready for Pickup', 'Completed', 'Rejected'],
    default: 'Pending'
  },
  adminNote: {
    type: String,
    trim: true
  },
  timeline: [{
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Ready for Pickup', 'Completed', 'Rejected']
    },
    note: { type: String, trim: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

documentRequestSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status) {
    this.timeline.push({
      status: this.status,
      updatedBy: this.residentId
    });
  }
  next();
});

module.exports = mongoose.model('DocumentRequest', documentRequestSchema);