const mongoose = require('mongoose');
const deliverySchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreetVendor' },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopOwner' },
  middlemanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Middleman' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  status: { type: String, default: 'in_progress' },
  verifiedByMiddleman: { type: Boolean, default: false },
  notes: String,
  deliveryDate: Date
}, { timestamps: true });
module.exports = mongoose.model('Delivery', deliverySchema);