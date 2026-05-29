const Announcement = require('../models/Announcement');
const AnnouncementArchive = require('../models/AnnouncementArchive');

const createAnnouncement = async (req, res) => {
  try {
    const { title, body, category, image } = req.body;
    const announcement = new Announcement({
      title,
      body,
      category,
      image,
      createdBy: req.user.id
    });
    
    await announcement.save();
    
    const Notification = require('../models/Notification')
    const User = require('../models/User')
    const users = await User.find({ role: 'resident' })
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message: body,
      type: 'announcement'
    }))
    await Notification.insertMany(notifications)
    
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isArchived: false }).populate('createdBy', 'fullName').sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate('createdBy', 'fullName');
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const archiveAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    const archive = new AnnouncementArchive({
      archivedFrom: announcement._id,
      title: announcement.title,
      body: announcement.body,
      category: announcement.category,
      image: announcement.image,
      createdBy: announcement.createdBy,
      archivedBy: req.user.id
    });
    
    await archive.save();
    await Announcement.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Announcement archived successfully', archive });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getArchivedAnnouncements = async (req, res) => {
  try {
    const announcements = await AnnouncementArchive.find().populate('createdBy', 'fullName').sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const restoreAnnouncement = async (req, res) => {
  try {
    const archive = await AnnouncementArchive.findById(req.params.id);
    
    if (!archive) {
      return res.status(404).json({ message: 'Archived announcement not found' });
    }
    
    const announcement = new Announcement({
      title: archive.title,
      body: archive.body,
      category: archive.category,
      image: archive.image,
      createdBy: archive.createdBy
    });
    
    await announcement.save();
    await AnnouncementArchive.findByIdAndDelete(req.params.id);
    
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  archiveAnnouncement,
  getArchivedAnnouncements,
  restoreAnnouncement
};