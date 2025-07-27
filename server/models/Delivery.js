const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreetVendor', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopOwner', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },

  middlemanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Middleman', required: true },

  status: {
    type: String,
    enum: ['in_progress', 'started_to_deliver', 'reached', 'reviewed'],
    default: 'in_progress',
    required: true
  },

  verifiedByMiddleman: { type: Boolean, default: false },

  // Optional notes or comments related to delivery or issues found
  notes: { type: String, default: '' },

  // Store timestamp when delivery status changed to reached or reviewed (optional)
  reachedAt: { type: Date },
  reviewedAt: { type: Date },
}, { timestamps: true });

// Middleware to update reachedAt and reviewedAt timestamps on status change
deliverySchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'reached' && !this.reachedAt) {
      this.reachedAt = new Date();
    }
    if (this.status === 'reviewed' && !this.reviewedAt) {
      this.reviewedAt = new Date();
    }
  }
  next();
});

module.exports = mongoose.model('Delivery', deliverySchema);
