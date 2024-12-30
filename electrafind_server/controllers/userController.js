const { user } = require('../models');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await user.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await user.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { UserType, Name, Email, Password, PhoneNumber, Address } = req.body;

  try {
    const newUser = await user.create({
      UserType,
      Name,
      Email,
      PasswordHash: Password, // Pass the plain password (it will be hashed automatically)
      PhoneNumber,
      Address,
    });

    res.status(201).json({
      message: 'User created successfully',
      userId: newUser.UserID,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      message: 'An error occurred while creating the user.',
      error: error.message,
    });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const updated = await user.update(req.body, { where: { UserID: req.params.id } });
    res.json({ updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await user.destroy({ where: { UserID: req.params.id } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
