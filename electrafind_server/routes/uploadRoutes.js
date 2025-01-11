const express = require('express');
const router = express.Router();

const upload = require('../config/multerConfig');
const { uploadImage } = require('../controllers/uploadController');
const { uploadImageWeb } = require('../controllers/imageUploader');

router.post('/', upload.single('file'), uploadImage);
router.post('/image', upload.single('file'), uploadImageWeb);

module.exports = router;
