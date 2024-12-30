const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

router.get('/', ratingController.getAllRatings);
router.get('/:id', ratingController.getRatingById);
router.post('/', ratingController.createRating);

module.exports = router;
