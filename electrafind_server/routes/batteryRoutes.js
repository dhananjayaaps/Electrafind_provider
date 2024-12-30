const express = require('express');
const router = express.Router();
const batteryController = require('../controllers/batteryController');

router.get('/', batteryController.getAllBatteries);
router.get('/:id', batteryController.getBatteryById);
router.post('/', batteryController.createBattery);
router.put('/:id', batteryController.updateBattery);
router.delete('/:id', batteryController.deleteBattery);

module.exports = router;
