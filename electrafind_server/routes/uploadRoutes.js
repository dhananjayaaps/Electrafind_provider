const express = require('express');
const router = express.Router();

const upload = require('../config/multerConfig');
const { uploadImage } = require('../controllers/uploadController');

router.post('/', upload.single('file'), uploadImage);

module.exports = router;
