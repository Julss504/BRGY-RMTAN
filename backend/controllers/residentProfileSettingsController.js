const ResidentProfileSettings = require('../models/ResidentProfileSettings');

const createProfileSettings = async (req, res) => {
  try {
    const userId = req.user.id
    const existing = await ResidentProfileSettings.findOne({ userId })
    
    if (existing) {
      return res.status(400).json({ message: 'Profile settings already exist' });
    }
    
    const profile = new ResidentProfileSettings({ userId, ...req.body });
    await profile.save();
    
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfileSettings = async (req, res) => {
  try {
    const profile = await ResidentProfileSettings.findOne({ userId: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile settings not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfileSettings = async (req, res) => {
  try {
    const profile = await ResidentProfileSettings.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, upsert: true }
    );
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfileSettingsByUserId = async (req, res) => {
  try {
    const profile = await ResidentProfileSettings.findOne({ userId: req.params.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile settings not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfileSettingsCount = async (req, res) => {
  try {
    const count = await ResidentProfileSettings.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createProfileSettings, getProfileSettings, updateProfileSettings, getProfileSettingsByUserId, getProfileSettingsCount };