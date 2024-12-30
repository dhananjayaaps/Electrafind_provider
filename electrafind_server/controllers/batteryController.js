const { Battery } = require('../models');

// Get all batteries
exports.getAllBatteries = async (req, res) => {
  try {
    const batteries = await Battery.findAll();
    res.json(batteries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get battery by ID
exports.getBatteryById = async (req, res) => {
  try {
    const battery = await Battery.findByPk(req.params.id);
    if (!battery) return res.status(404).json({ message: 'Battery not found' });
    res.json(battery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new battery
exports.createBattery = async (req, res) => {
  try {
    const newBattery = await Battery.create(req.body);
    res.status(201).json(newBattery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a battery
exports.updateBattery = async (req, res) => {
  try {
    const updated = await Battery.update(req.body, { where: { BatteryID: req.params.id } });
    res.json({ updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a battery
exports.deleteBattery = async (req, res) => {
  try {
    const deleted = await Battery.destroy({ where: { BatteryID: req.params.id } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
