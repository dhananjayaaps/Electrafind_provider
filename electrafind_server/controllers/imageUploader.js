const multer = require('multer');
const path = require('path');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the destination directory for uploaded images
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Set the filename format (e.g., using current timestamp to ensure uniqueness)
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1638452645089.jpg
  }
});

// Create multer upload instance with the defined storage
const upload = multer({ storage });

// Controller for handling the image upload
const uploadImageWeb = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Construct the file URL
  const fileUrl = `${req.protocol}://${req.get('host')}/api/uploads/${req.file.filename}`;
  console.log('Uploaded file URL:', fileUrl);

  // Send the URL as a JSON response
  res.json({ url: fileUrl });
};

module.exports = {
  upload,
  uploadImageWeb
};
