const WasteSchedule = require('../models/WasteSchedule');
const WasteScheduleArchive = require('../models/WasteScheduleArchive');

const createWasteSchedule = async (req, res) => {
  try {
    const scheduleData = { ...req.body }
    if (scheduleData.date) {
      scheduleData.date = new Date(scheduleData.date)
    }
    const schedule = new WasteSchedule(scheduleData);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getWasteSchedules = async (req, res) => {
  try {
    const { zone } = req.query
    let query = { isActive: true }
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
    const updateData = { ...req.body }
    if (updateData.date) {
      updateData.date = new Date(updateData.date)
    }
    const schedule = await WasteSchedule.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.json(schedule);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const archiveWasteSchedule = async (req, res) => {
  try {
    const schedule = await WasteSchedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    const archive = new WasteScheduleArchive({
      archivedFrom: schedule._id,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      zone: schedule.zone,
      wasteType: schedule.wasteType,
      notes: schedule.notes,
      status: schedule.status,
      archivedBy: req.user.id
    });
    
    await archive.save();
    await WasteSchedule.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Schedule archived successfully', archive });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getArchivedWasteSchedules = async (req, res) => {
  try {
    const { zone } = req.query
    let query = {}
    if (zone) query.zone = zone
    const schedules = await WasteScheduleArchive.find(query).sort({ date: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const restoreWasteSchedule = async (req, res) => {
  try {
    const archive = await WasteScheduleArchive.findById(req.params.id);
    
    if (!archive) {
      return res.status(404).json({ message: 'Archived schedule not found' });
    }
    
    const schedule = new WasteSchedule({
      date: archive.date,
      startTime: archive.startTime,
      endTime: archive.endTime,
      zone: archive.zone,
      wasteType: archive.wasteType,
      notes: archive.notes,
      status: archive.status
    });
    
    await schedule.save();
    await WasteScheduleArchive.findByIdAndDelete(req.params.id);
    
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createWasteSchedule,
  getWasteSchedules,
  getWasteSchedule,
  updateWasteSchedule,
  archiveWasteSchedule,
  getArchivedWasteSchedules,
  restoreWasteSchedule
};