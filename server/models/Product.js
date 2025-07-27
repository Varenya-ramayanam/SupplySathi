const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  photoUrl: String,
  shopOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopOwner' },
  averageRating: { type: Number, default: 0 },
  acceptanceCount: { type: Number, default: 0 }, // 🔥 track how many times accepted
  accepted: { type: Boolean, default: false }, // ✅ when fully taken
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
