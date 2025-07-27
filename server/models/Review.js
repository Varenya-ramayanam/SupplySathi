const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StreetVendor',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  deliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
    required: true,
  },
  middlemanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Middleman',
    required: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopOwner',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  productQuality: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
