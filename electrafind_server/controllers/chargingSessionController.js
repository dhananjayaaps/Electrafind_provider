const { chargingSession, user, ChargingStation, sequelize } = require('../models');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getAllChargingSessions = async (req, res) => {
  try {
    const sessions = await chargingSession.findAll({
      where: {
        Status: {
          [Op.in]: ['New', 'Ongoing', 'Completed'],
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
      fixedChargingTime: session.fixedChargingTime,
    }));

    res.status(200).json(sessionData);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'An error occurred while fetching sessions.' });
  }
};

exports.getMychargingSessions = async (req, res) => {
  try {
    console.log('Request user:', req.user);
    const sessions = await chargingSession.findAll({
      where: {
        Status: {
          [Op.in]: ['New', 'Ongoing', 'Completed', 'Closed'],
        },
        userId: req.user.UserID,
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
      fixedChargingTime: session.fixedChargingTime,
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
    const session = await chargingSession.findOne({ where: { SessionID: req.params.id } });
    if (!session) return res.status(404).json({ message: 'Charging session not found' });
    res.json(session);
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

exports.startSession = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { sessionID, unitPrice, chargeType, fixedChargingTime } = req.body;

    // Validate input
    if (!sessionID || !unitPrice || !chargeType || isNaN(fixedChargingTime) || fixedChargingTime <= 0) {
      return res.status(400).json({ message: 'Invalid input. Please provide all required fields.' });
    }

    // Fetch session
    const session = await chargingSession.findOne({ where: { SessionID: sessionID } });

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    if (session.Status !== 'New') {
      return res.status(400).json({ message: 'Cannot start session. Invalid status.' });
    }

    // Update session fields
    session.ChargeType = 
      chargeType.toLowerCase() === 'level1' ? 'Level 1' :
      chargeType.toLowerCase() === 'level2' ? 'Level 2' :
      chargeType.toLowerCase() === 'level3' ? 'Level 3' :
      null;

    if (!session.ChargeType) {
      return res.status(400).json({ message: 'Invalid charge type provided.' });
    }
    console.log('Session:', session);
    session.StartTime = new Date();
    session.Status = 'Ongoing';
    
    session.Cost = parseFloat(unitPrice);
    session.fixedChargingTime = parseInt(fixedChargingTime, 10);
    session.TotalTime = session.fixedChargingTime * 60; // Convert minutes to seconds

    console.log('Session:', session);
    // Save the updated session
    await session.save();

    // Send response
    res.status(200).json({
      message: 'Charging session started successfully.',
      success: true,
      session: {
        sessionID: session.SessionID,
        startTime: session.StartTime,
        status: session.Status,
        cost: session.Cost,
        totalTime: session.TotalTime,
      },
    });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


// Stop a charging session
exports.stopSession = async (req, res) => {
  try {
    const { sessionID } = req.body;

    if (!sessionID) {
      return res.status(400).json({ message: 'Session ID is required.' });
    }

    const session = await chargingSession.findOne({ where: { SessionID: sessionID } });

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    if (session.Status !== 'Ongoing') {
      return res.status(400).json({ message: 'Cannot stop session. Session is not in progress.' });
    }

    // Calculate the total time spent in seconds
    const currentTime = new Date();
    const startTime = new Date(session.StartTime);
    const elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000); // elapsed time in seconds

    session.EndTime = currentTime;
    session.Status = 'Completed';
    session.TotalTime = elapsedTimeInSeconds; // Total time spent
    session.Cost = (elapsedTimeInSeconds / 60) * session.Cost; // Recalculate cost based on actual time

    await session.save();

    res.status(200).json({
      message: 'Charging session stopped successfully.',
      success: true,
      session: {
        sessionID: session.SessionID,
        startTime: session.StartTime,
        endTime: session.EndTime,
        status: session.Status,
        totalTime: session.TotalTime,
        cost: session.Cost.toFixed(2), // format cost as currency
      },
    });
  } catch (error) {
    console.error('Error stopping session:', error);
    res.status(500).json({ error: error.message });
  }
};

// Close a charging session
exports.closeSession = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { sessionID } = req.body;

    if (!sessionID) {
      return res.status(400).json({ message: 'Session ID is required.' });
    }

    const session = await chargingSession.findOne({ where: { SessionID: sessionID } });

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    if (session.Status !== 'Completed') {
      return res.status(400).json({ message: 'Cannot close the session. The session must be completed first.' });
    }

    session.Status = 'Closed';
    await session.save();

    res.status(200).json({
      message: 'Charging session closed successfully.',
      success: true,
      session: {
        sessionID: session.SessionID,
        status: session.Status,
      },
    });
  } catch (error) {
    console.error('Error closing session:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getClosedChargingSessions = async (req, res) => {
  try {
    const closedSessions = await chargingSession.findAll({
      where: {
        Status: 'Closed',
        providerID: req.provider.StationID,
      },
      order: [['EndTime', 'DESC']],
      include: [
        {
          model: user,
          as: 'user',
          attributes: ['Name'],
        },
      ],
    });

    if (closedSessions.length === 0) {
      return res.status(404).json({ message: 'No closed sessions found.' });
    }

    const sessionData = closedSessions.map(session => ({
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
    console.error('Error fetching closed sessions:', error);
    res.status(500).json({ message: 'An error occurred while fetching closed sessions.' });
  }
};
