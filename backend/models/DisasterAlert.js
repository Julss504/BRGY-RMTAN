const mongoose = require('mongoose');

const disasterAlertSchema = new mongoose.Schema({
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DisasterAlert', disasterAlertSchema);