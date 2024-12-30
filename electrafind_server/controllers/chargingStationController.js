const { chargingStation, TimeSlot } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerStation = async (req, res) => {
  try {
    const {
      Name,
      Location,
      Email,
      Password,
      Latitude,
      Longitude,
      AvailableStartTime,
      AvailableEndTime,
      Prices,
      ImageUrl,
    } = req.body;

    // Validate required fields
    if (
      !Name || !Location || !Email || !Password || !Latitude ||
      !Longitude || !AvailableStartTime || !AvailableEndTime || !ImageUrl
    ) {
      return res.status(400).json({ message: 'All fields are required. Reqeired field is' });
    }
    console.log(req.body);

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Validate Prices
    const levels = ['level1', 'level2', 'level3'];
    for (const level of levels) {
      if (!Prices[level]) {
        return res.status(400).json({ message: `Missing ${level} in Prices.` });
      }
      const { active, price } = Prices[level];
      if (typeof active !== 'boolean' || (active && price < 0)) {
        return res.status(400).json({ message: `Invalid price for ${level}.` });
      }
    }

    // Validate ImageUrl
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(ImageUrl)) {
      return res.status(400).json({ message: 'Invalid ImageUrl format.' });
    }

    const moment = require('moment');

    const availableStartTime = moment(AvailableStartTime, ["h:mm:ss A"]).format("HH:mm:ss");
    const availableEndTime = moment(AvailableEndTime, ["h:mm:ss A"]).format("HH:mm:ss");

    // Check if email already exists
    const existingStation = await chargingStation.findOne({ where: { Email } });
    if (existingStation) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Save the new station
    const newStation = await chargingStation.create({
      Name,
      Location,
      Email,
      Password,
      Latitude,
      Longitude,
      AvailableStartTime: availableStartTime,
      AvailableEndTime: availableEndTime,
      Prices: JSON.stringify(Prices), // Store as a JSON string
      ImageUrl,
    });

    res.status(201).json({
      message: 'Station registered successfully.',
      station: {
        StationID: newStation.StationID,
        Name: newStation.Name,
        Location: newStation.Location,
        Email: newStation.Email,
        Latitude: newStation.Latitude,
        Longitude: newStation.Longitude,
        AvailableStartTime: newStation.AvailableStartTime,
        AvailableEndTime: newStation.AvailableEndTime,
        Prices: JSON.parse(newStation.Prices), // Parse for response
        ImageUrl: newStation.ImageUrl,
      },
    });
  } catch (error) {
    console.error('Error registering station:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// Login a charging station
exports.loginStation = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const station = await chargingStation.findOne({ where: { Email } });
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    const isValidPassword = await bcrypt.compare(Password, station.Password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: station.StationID, email: station.Email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllStations = async (req, res) => {
  try {
    const stations = await chargingStation.findAll({ include: TimeSlot });
    res.json(stations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get station by ID
exports.getStationById = async (req, res) => {
  try {
    const station = await chargingStation.findByPk(req.params.id, { include: TimeSlot });
    if (!station) return res.status(404).json({ message: 'Station not found' });
    res.json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new station
exports.createStation = async (req, res) => {
  try {
    const newStation = await chargingStation.create(req.body);
    res.status(201).json(newStation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a station
exports.updateStation = async (req, res) => {
  try {
    const updated = await chargingStation.update(req.body, { where: { StationID: req.params.id } });
    res.json({ updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a station
exports.deleteStation = async (req, res) => {
  try {
    const deleted = await chargingStation.destroy({ where: { StationID: req.params.id } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
