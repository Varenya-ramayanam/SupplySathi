const mongoose = require('mongoose');
const shopOwnerSchema = new mongoose.Schema({
  name: String,
  shopName: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  role: { type: String, default: 'shop_owner' }
}, { timestamps: true });
module.exports = mongoose.model('ShopOwner', shopOwnerSchema);