const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreetVendor' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Review', reviewSchema);
