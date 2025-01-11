const { user } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
  const { UserType, Name, Email, Password, PhoneNumber, Address, ImageUrl } = req.body;

  try {
    const newUser = await user.create({
      UserType,
      Name,
      Email,
      PasswordHash: Password, // Pass the plain password (it will be hashed automatically)
      PhoneNumber,
      Address,
      ImageUrl,
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

// Sign in a user
exports.signIn = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Find user by email
    const foundUser = await user.findOne({ where: { Email } });
    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(Password, foundUser.PasswordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: foundUser.UserID},
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      message: 'Sign-in successful',
      token,
      user: {
        userId: foundUser.UserID,
        email: foundUser.Email,
        name: foundUser.Name,
      },
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: error.message });
  }
};


// Update a user
exports.updateUser = async (req, res) => {
  try {
    const updated = await user.update(req.body, { where: { UserID: req.user.UserID } });
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


exports.getUserprofile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//make a endpoint for get the all mechanics
exports.getAllMechanics = async (req, res) => {
  try {
    const mechanics = await user.findAll({ where: { UserType: 'Mechanics'  } });
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//make a endpoint for get the all garages
exports.getAllGarages = async (req, res) => {
  try {
    const garages = await user.findAll({ where: { UserType: ['Garage', 'Mechanics'] } });
    res.json(garages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

