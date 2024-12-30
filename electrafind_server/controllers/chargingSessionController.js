const { ChargingSession, Vehicle, ChargingStation } = require('../models');

// Get all charging sessions
exports.getAllChargingSessions = async (req, res) => {
  try {
    const sessions = await ChargingSession.findAll({ include: [Vehicle, ChargingStation] });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get charging session by ID
exports.getChargingSessionById = async (req, res) => {
  try {
    const session = await ChargingSession.findByPk(req.params.id, { include: [Vehicle, ChargingStation] });
    if (!session) return res.status(404).json({ message: 'Charging session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new charging session
exports.createChargingSession = async (req, res) => {
  try {
    const newSession = await ChargingSession.create(req.body);
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a charging session
exports.updateChargingSession = async (req, res) => {
  try {
    const updated = await ChargingSession.update(req.body, { where: { ChargingSessionID: req.params.id } });
    res.json({ updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a charging session
exports.deleteChargingSession = async (req, res) => {
  try {
    const deleted = await ChargingSession.destroy({ where: { ChargingSessionID: req.params.id } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
