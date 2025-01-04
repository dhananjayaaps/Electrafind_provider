const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Routes for users
router.get('/', userController.getAllUsers);
router.post('/login', userController.signIn);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;