// models/ShopOwner.js
const mongoose = require('mongoose');

const shopOwnerSchema = new mongoose.Schema({
  name: String,
  shopName: String,
  email: { type: String, required: true, unique: true },
  password: String,
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  role: { type: String, default: 'shop_owner' }
}, { timestamps: true });

module.exports = mongoose.model('ShopOwner', shopOwnerSchema);
