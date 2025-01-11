// Controller for handling the image upload
const uploadImage = (req, res) => {

    console.log(req.file)

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
  
    // Construct the file URL
    // const fileUrl = `http://localhost:3000/api/uploads/${req.file.filename}`;
    const fileUrl = `${req.protocol}://${req.get('host')}/api/uploads/${req.file.filename}`;
    console.log(fileUrl)
    res.json({ url: fileUrl });
  };
  
  module.exports = { uploadImage };
  