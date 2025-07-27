const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'delivered', 'rejected', 'available', 'started_to_deliver'], // ✅ Added here
    default: 'pending'
  },
  deliveryDate: {
    type: Date
  },
  reviewGiven: {
    type: Boolean,
    default: false
  },
  shopProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  addedByMiddleman: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const vendorTodoSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StreetVendor',
    required: true
  },
  items: [itemSchema]
}, { timestamps: true });

module.exports = mongoose.model('VendorTodo', vendorTodoSchema);
