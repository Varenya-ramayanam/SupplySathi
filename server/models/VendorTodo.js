const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  productName: String,
  quantity: Number,
  status: { type: String, default: 'pending' },
  deliveryDate: Date,
  reviewGiven: { type: Boolean, default: false }
});
const vendorTodoSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreetVendor' },
  items: [itemSchema]
}, { timestamps: true });
module.exports = mongoose.model('VendorTodo', vendorTodoSchema);