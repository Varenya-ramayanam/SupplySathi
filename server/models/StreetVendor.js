const mongoose = require('mongoose');
const streetVendorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  location: String,
  role: { type: String, default: 'vendor' }
}, { timestamps: true });
module.exports = mongoose.model('StreetVendor', streetVendorSchema);