const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreetVendor', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopOwner', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  middlemanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Middleman' },
  deliveryDate: { type: Date },
  status: {
    type: String,
    enum: ['in_progress', 'started_to_deliver', 'delivered', 'cancelled'],
    default: 'in_progress'
  },
  verifiedByMiddleman: { type: Boolean, default: false },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema);
