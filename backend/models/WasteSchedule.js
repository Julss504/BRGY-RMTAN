const mongoose = require('mongoose');

const wasteScheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    default: '08:00',
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v)
      },
      message: props => `${props.value} is not a valid time format (HH:MM)`
    }
  },
  endTime: {
    type: String,
    default: '12:00',
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v)
      },
      message: props => `${props.value} is not a valid time format (HH:MM)`
    }
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WasteSchedule', wasteScheduleSchema);