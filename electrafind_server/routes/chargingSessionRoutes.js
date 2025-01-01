const express = require('express');
const router = express.Router();
const chargingSessionController = require('../controllers/chargingSessionController');
const providerProtect = require('../middlewares/providerMiddleware');

router.get('/', providerProtect, chargingSessionController.getAllChargingSessions);
router.post('/startSession', providerProtect, chargingSessionController.startSession);
router.get('/:id', chargingSessionController.getChargingSessionById);
router.put('/:id', chargingSessionController.updateChargingSession);
router.delete('/:id', chargingSessionController.deleteChargingSession);

module.exports = router;
