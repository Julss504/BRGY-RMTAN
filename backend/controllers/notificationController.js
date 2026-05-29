const Notification = require('../models/Notification');
const User = require('../models/User');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const sendNotification = async (req, res) => {
  try {
    const { title, message, type, targetPurok, all } = req.body;
    
    let users;
    if (all) {
      users = await User.find({ role: 'resident' });
    } else if (targetPurok) {
      const ResidentProfileSettings = require('../models/ResidentProfileSettings');
      const profiles = await ResidentProfileSettings.find({ purokZone: targetPurok });
      const userIds = profiles.map(p => p.userId);
      users = await User.find({ _id: { $in: userIds }, role: 'resident' });
    } else {
      return res.status(400).json({ message: 'Specify target: all or targetPurok' });
    }
    
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message,
      type: type || 'announcement'
    }));
    
    await Notification.insertMany(notifications);
    res.json({ message: `Notification sent to ${users.length} users` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getMyNotifications,
  sendNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
};