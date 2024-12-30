const { Rating, User, ChargingStation } = require('../models');

// Get all ratings
exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({ include: [User, ChargingStation] });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get rating by ID
exports.getRatingById = async (req, res) => {
  try {
    const rating = await Rating.findByPk(req.params.id, { include: [User, ChargingStation] });
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new rating
exports.createRating = async (req, res) => {
  try {
    const newRating = await Rating.create(req.body);
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
