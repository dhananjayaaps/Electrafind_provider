const express = require('express');
const router = express.Router();
const chargingStationController = require('../controllers/chargingStationController');
const providerProtect = require('../middlewares/providerMiddleware');

// Routes for charging station management
router.get('/', chargingStationController.getAllStations); // Get all stations
router.get('/mystation', providerProtect, chargingStationController.getMyStation); // Get station by ID
router.get('/:id', chargingStationController.getStationById); // Get station by ID
router.post('/', chargingStationController.createStation); // Create a new station
router.put('/:id', chargingStationController.updateStation); // Update a station
router.delete('/:id', chargingStationController.deleteStation); // Delete a station
router.patch('/', providerProtect, chargingStationController.partialUpdateStation); // update a station

// Routes for station authentication
router.post('/register', chargingStationController.registerStation); // Register a new station
router.post('/login', chargingStationController.loginStation); // Login for a station

module.exports = router;
