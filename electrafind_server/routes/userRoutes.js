const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const userProtect = require('../middlewares/authmiddleware');


// Routes for users
router.get('/', userController.getAllUsers);
router.get('/profile', userProtect ,userController.getUserprofile);
router.post('/login', userController.signIn);
router.get('/garages', userController.getAllGarages);
router.get('/mechanics', userController.getAllMechanics);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/', userProtect, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;