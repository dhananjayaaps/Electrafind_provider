const { vehicle, battery } = require('../models');

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicle.findAll({ include: battery });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await vehicle.findByPk(req.params.id, { include: battery });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const newVehicle = await vehicle.create(req.body);
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const updated = await vehicle.update(req.body, { where: { VehicleID: req.params.id } });
    res.json({ updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const deleted = await vehicle.destroy({ where: { VehicleID: req.params.id } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
