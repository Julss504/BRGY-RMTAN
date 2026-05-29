const mongoose = require('mongoose');

const documentRequestArchiveSchema = new mongoose.Schema({
  archivedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentRequest',
    required: true
  },
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
  supportingInfo: {
    type: String,
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
  archivedAt: {
    type: Date,
    default: Date.now
  },
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DocumentRequestArchive', documentRequestArchiveSchema);