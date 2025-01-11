const express = require('express');
const router = express.Router();
const chargingSessionController = require('../controllers/chargingSessionController');
const providerProtect = require('../middlewares/providerMiddleware');
const userProtect = require('../middlewares/authmiddleware');

router.get('/', providerProtect, chargingSessionController.getAllChargingSessions);
router.get('/mysessions', userProtect, chargingSessionController.getMychargingSessions);
router.post('/startSession', providerProtect, chargingSessionController.startSession);
router.post('/endSession', providerProtect, chargingSessionController.stopSession);
router.get('/earnings', providerProtect, chargingSessionController.getClosedChargingSessions);
router.get('/:id', chargingSessionController.getChargingSessionById);
router.put('/:id', chargingSessionController.updateChargingSession);
router.delete('/:id', chargingSessionController.deleteChargingSession);
router.patch('/close', providerProtect, chargingSessionController.closeSession);

module.exports = router;
