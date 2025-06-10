
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };
