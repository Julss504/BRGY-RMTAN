const mongoose = require('mongoose');

const announcementArchiveSchema = new mongoose.Schema({
  archivedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announcement',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'health', 'safety', 'event', 'meeting', 'notice', 'employment'],
    default: 'general'
  },
  image: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

module.exports = mongoose.model('AnnouncementArchive', announcementArchiveSchema);