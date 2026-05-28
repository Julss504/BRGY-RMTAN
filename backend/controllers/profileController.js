const ResidentProfile = require('../models/ResidentProfile');

const createProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const existing = await ResidentProfile.findOne({ userId })
    
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists' });
    }
    
    const profile = new ResidentProfile({ userId, ...req.body });
    await profile.save();
    
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await ResidentProfile.findOne({ userId: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await ResidentProfile.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, upsert: true }
    );
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfileByUserId = async (req, res) => {
  try {
    const profile = await ResidentProfile.findOne({ userId: req.params.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfileCount = async (req, res) => {
  try {
    const count = await ResidentProfile.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createProfile, getProfile, updateProfile, getProfileByUserId, getProfileCount };