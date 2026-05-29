const mongoose = require('mongoose');

const wasteScheduleArchiveSchema = new mongoose.Schema({
  archivedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteSchedule',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    default: '08:00'
  },
  endTime: {
    type: String,
    default: '12:00'
  },
  zone: {
    type: String,
    required: true,
    trim: true
  },
  wasteType: {
    type: String,
    enum: ['biodegradable', 'non-biodegradable', 'recyclable', 'special-waste'],
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  archivedAt: {
    type: Date,
    default: Date.now
  },
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('WasteScheduleArchive', wasteScheduleArchiveSchema);