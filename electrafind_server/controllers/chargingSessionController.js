const { chargingSession, user, ChargingStation, sequelize } = require('../models');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getAllChargingSessions = async (req, res) => {
  try {
    const sessions = await chargingSession.findAll({
      where: {
        Status: {
          [Op.in]: ['New', 'Ongoing'],
        },
        providerID: req.provider.StationID,
      },
      include: [
        {
          model: user,
          as: 'user',
          attributes: ['Name'],
        },
      ],
    });

    if (sessions.length === 0) {
      return res.status(404).json({ message: 'No sessions found.' });
    }

    const sessionData = sessions.map(session => ({
      sessionId: session.SessionID,
      userName: session.user.Name,
      chargeType: session.ChargeType,
      status: session.Status,
      startTime: session.StartTime,
      endTime: session.EndTime,
      cost: session.Cost,
      totalTime: session.TotalTime,
    }));

    res.status(200).json(sessionData);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'An error occurred while fetching sessions.' });
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
