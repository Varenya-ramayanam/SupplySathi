const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StreetVendor',
    required: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopOwner',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  middlemanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Middleman',
    required: true,
  },
  status: {
    type: String,
    enum: ['in_progress', 'started_to_deliver', 'reached', 'reviewed'],
    default: 'in_progress',
    required: true,
  },
  verifiedByMiddleman: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: '',
    trim: true,
  },
  reachedAt: {
    type: Date,
  },
  reviewedAt: {
    type: Date,
  },
}, { timestamps: true });

// Auto-update timestamps when status changes
deliverySchema.pre('save', function (next) {
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
