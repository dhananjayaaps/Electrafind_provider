const { chargingStation, TimeSlot } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const path = require('path');

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
      return res.status(400).json({ message: 'All fields are required.' });
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

    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(ImageUrl)) {
      return res.status(400).json({ message: 'Invalid ImageUrl format.' });
    }

    const moment = require('moment');
    const availableStartTime = moment(AvailableStartTime, ["h:mm:ss A"]).format("HH:mm:ss");
    const availableEndTime = moment(AvailableEndTime, ["h:mm:ss A"]).format("HH:mm:ss");

    const existingStation = await chargingStation.findOne({ where: { Email } });
    if (existingStation) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const qrCodeFileName = `${verificationCode}.png`;
    const qrCodePath = path.join(__dirname, '../uploads', qrCodeFileName);
    await QRCode.toFile(qrCodePath, verificationCode.toString());

    const qrCodeUrl = `${req.protocol}://${req.get('host')}/api/uploads/${qrCodeFileName}`;

    const newStation = await chargingStation.create({
      Name,
      Location,
      Email,
      Password,
      Latitude,
      Longitude,
      AvailableStartTime: availableStartTime,
      AvailableEndTime: availableEndTime,
      Prices: JSON.stringify(Prices),
      ImageUrl,
      VerificationCode: verificationCode,
      QRCode: qrCodeUrl,
    });

    res.status(201).json({
      message: 'Station registered successfully.'
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
      { expiresIn: '12h' }
    );

    res.json({ message: 'Login successful', token, ProviderId: station.StationID ,Name: station.Name, Email: station.Email, ImageUrl: station.ImageUrl, QRCode: station.QRCode, VerificationCode: station.VerificationCode }); 
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

exports.getMyStation = async (req, res) => {
  try {
    const station = req.provider;

    if (station.Prices && typeof station.Prices === 'string') {
      station.Prices = JSON.parse(station.Prices); 
    }

    res.json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update specific fields of a station
exports.partialUpdateStation = async (req, res) => {
  try {
    const id = req.provider.id;
    const {
      Name,
      Location,
      AvailableStartTime,
      AvailableEndTime,
      ImageUrl
    } = req.body;

    // Check if station exists
    const station = req.provider;

    // Validate input data
    const urlRegex = /^(http|https):\/\/[^ "\n]+$/;
    if (ImageUrl && !urlRegex.test(ImageUrl)) {
      return res.status(400).json({ message: 'Invalid ImageUrl format.' });
    }

    const moment = require('moment');
    const updatedData = {};

    if (Name) updatedData.Name = Name;
    if (Location) updatedData.Location = Location;
    if (AvailableStartTime) {
      updatedData.AvailableStartTime = moment(AvailableStartTime, ["h:mm:ss A"]).format("HH:mm:ss");
    }
    if (AvailableEndTime) {
      updatedData.AvailableEndTime = moment(AvailableEndTime, ["h:mm:ss A"]).format("HH:mm:ss");
    }
    if (ImageUrl) updatedData.ImageUrl = ImageUrl;

    // Perform the update
    await chargingStation.update(updatedData, { where: { StationID: id } });

    // Fetch the updated station
    const updatedStation = await chargingStation.findByPk(id);

    res.json({ message: 'Station updated successfully.', station: updatedStation });
  } catch (error) {
    console.error('Error updating station:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
