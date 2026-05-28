const DisasterAlert = require('../models/DisasterAlert');

const createDisasterAlert = async (req, res) => {
  try {
    const alert = new DisasterAlert({
      ...req.body,
      actions: req.body.actions || []
    });
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDisasterAlerts = async (req, res) => {
  try {
    const alerts = await DisasterAlert.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllDisasterAlerts = async (req, res) => {
  try {
    const alerts = await DisasterAlert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDisasterAlert = async (req, res) => {
  try {
    const alert = await DisasterAlert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateDisasterAlert = async (req, res) => {
  try {
    const alert = await DisasterAlert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deactivateAlert = async (req, res) => {
  try {
    const alert = await DisasterAlert.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createDisasterAlert,
  getDisasterAlerts,
  getAllDisasterAlerts,
  getDisasterAlert,
  updateDisasterAlert,
  deactivateAlert
};