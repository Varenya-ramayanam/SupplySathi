const mongoose = require('mongoose');
const middlemanSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  godownAddress: String,
  role: { type: String, default: 'middleman' }
}, { timestamps: true });
module.exports = mongoose.model('Middleman', middlemanSchema);