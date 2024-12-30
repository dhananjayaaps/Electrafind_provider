const { TimeSlot } = require('../models');

// Get all time slots
exports.getAllTimeSlots = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.findAll();
    res.json(timeSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get time slot by ID
exports.getTimeSlotById = async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findByPk(req.params.id);
    if (!timeSlot) return res.status(404).json({ message: 'Time slot not found' });
    res.json(timeSlot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new time slot
exports.createTimeSlot = async (req, res) => {
  try {
    const newTimeSlot = await TimeSlot.create(req.body);
    res.status(201).json(newTimeSlot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a time slot
exports.updateTimeSlot = async (req, res) => {
  try {
    const updated = await TimeSlot.update(req.body, { where: { TimeSlotID: req.params.id } });
    res.json({ updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a time slot
exports.deleteTimeSlot = async (req, res) => {
  try {
    const deleted = await TimeSlot.destroy({ where: { TimeSlotID: req.params.id } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
