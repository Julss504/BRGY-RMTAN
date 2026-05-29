const mongoose = require('mongoose');

const disasterAlertArchiveSchema = new mongoose.Schema({
  archivedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DisasterAlert',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Typhoon', 'Flood', 'Earthquake', 'Fire', 'Landslide'],
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    required: true
  },
  actions: [{
    type: String,
    trim: true
  }],
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

module.exports = mongoose.model('DisasterAlertArchive', disasterAlertArchiveSchema);