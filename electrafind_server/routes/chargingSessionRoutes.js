const express = require('express');
const router = express.Router();
const chargingSessionController = require('../controllers/chargingSessionController');
const providerProtect = require('../middlewares/providerMiddleware');

router.get('/', providerProtect, chargingSessionController.getAllChargingSessions);
router.get('/:id', chargingSessionController.getChargingSessionById);
router.post('/', chargingSessionController.createChargingSession);
router.put('/:id', chargingSessionController.updateChargingSession);
router.delete('/:id', chargingSessionController.deleteChargingSession);

module.exports = router;
