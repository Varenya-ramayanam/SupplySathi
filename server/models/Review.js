const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreetVendor' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  rating: Number,
  comment: String,
  deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' },
  middlemanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Middleman' },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopOwner' },
  productQuality: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Review', reviewSchema);
