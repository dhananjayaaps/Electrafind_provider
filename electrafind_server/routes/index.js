const express = require('express');
const router = express.Router();

// Import individual route modules
const userRoutes = require('./userRoutes');
const vehicleRoutes = require('./vehicleRoutes');
const batteryRoutes = require('./batteryRoutes');
const chargingStationRoutes = require('./chargingStationRoutes');
const timeSlotRoutes = require('./timeSlotRoutes');
const bookingRoutes = require('./bookingRoutes');
const chargingSessionRoutes = require('./chargingSessionRoutes');
const transactionRoutes = require('./transactionRoutes');
const ratingRoutes = require('./ratingRoutes');
const marketplaceRoutes = require('./marketplaceRoutes');
const uploadRouter = require('./uploadRoutes')

// Mount routes to their respective paths
router.use('/users', userRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/batteries', batteryRoutes);
router.use('/stations', chargingStationRoutes);
router.use('/time-slots', timeSlotRoutes);
router.use('/bookings', bookingRoutes);
router.use('/sessions', chargingSessionRoutes);
router.use('/transactions', transactionRoutes);
router.use('/ratings', ratingRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/upload', uploadRouter)
router.use('/uploads', express.static('uploads'));

module.exports = router;
