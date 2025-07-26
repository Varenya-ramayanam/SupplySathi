const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  expiryDate: Date,
  photoUrl: String,
  shopOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopOwner' },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);