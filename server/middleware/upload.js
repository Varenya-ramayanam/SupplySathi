// server/middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'supply_sathi_products',
    format: file.mimetype.split('/')[1], // e.g. jpg, png
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
  }),
});

const upload = multer({ storage });
module.exports = upload;
