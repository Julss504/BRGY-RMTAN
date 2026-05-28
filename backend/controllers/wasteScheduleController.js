const WasteSchedule = require('../models/WasteSchedule');

const createWasteSchedule = async (req, res) => {
  try {
    const schedule = new WasteSchedule(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getWasteSchedules = async (req, res) => {
  try {
    const { zone } = req.query
    let query = {}
    if (zone) query.zone = zone
    const schedules = await WasteSchedule.find(query).sort({ date: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getWasteSchedule = async (req, res) => {
  try {
    const schedule = await WasteSchedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateWasteSchedule = async (req, res) => {
  try {
    const schedule = await WasteSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteWasteSchedule = async (req, res) => {
  try {
    const schedule = await WasteSchedule.findByIdAndDelete(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createWasteSchedule,
  getWasteSchedules,
  getWasteSchedule,
  updateWasteSchedule,
  deleteWasteSchedule
};