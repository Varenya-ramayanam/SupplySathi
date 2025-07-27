// models/Middleman.js
const mongoose = require('mongoose');

const middlemanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  godownAddress: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'middleman' }
}, { timestamps: true });

module.exports = mongoose.model('Middleman', middlemanSchema);
