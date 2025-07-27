const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const VendorTodo = require('../models/VendorTodo');
const Delivery = require('../models/Delivery');
const Review = require('../models/Review');
const Product = require('../models/Product');
const StreetVendor = require('../models/StreetVendor');

// 🔐 Vendor Signup
exports.vendorSignup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingVendor = await StreetVendor.findOne({ email });
    if (existingVendor) return res.status(400).json({ error: 'Vendor already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = await StreetVendor.create({
      name,
      email,
      password: hashedPassword,
      phone
    });

    res.status(201).json({ message: 'Vendor created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// 🔐 Vendor Login
exports.vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await StreetVendor.findOne({ email });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, vendor });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// 👤 Vendor Profile
exports.getVendorProfile = async (req, res) => {
  try {
    const vendor = await StreetVendor.findById(req.user._id).select('-password');
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// ✅ Get Todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await VendorTodo.findOne({ vendorId: req.user._id });
    res.json(todos || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
};

// ✅ Add Todo
exports.addTodo = async (req, res) => {
  try {
    const { productName, quantity } = req.body;
    if (!productName || !productName.trim()) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    let vendorTodo = await VendorTodo.findOne({ vendorId: req.user._id });

    if (!vendorTodo) {
      vendorTodo = new VendorTodo({ vendorId: req.user._id, items: [] });
    }

    vendorTodo.items.push({ productName, quantity });
    await vendorTodo.save();

    res.status(201).json(vendorTodo);
  } catch (err) {
    console.error('Error in addTodo:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✅ Delete Todo
exports.deleteTodo = async (req, res) => {
  try {
    await VendorTodo.updateOne(
      { vendorId: req.user._id },
      { $pull: { items: { _id: req.params.id } } }
    );
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item' });
  }
};

// ✅ Clear All Todos
exports.clearTodos = async (req, res) => {
  try {
    await VendorTodo.updateOne(
      { vendorId: req.user._id },
      { $set: { items: [] } }
    );
    res.json({ message: 'All items deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear items' });
  }
};

// ✅ Get Deliveries
exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ vendorId: req.user._id }).populate('productId');
    res.json({ deliveries });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch deliveries' });
  }
};

// ✅ Mark Delivery as Reached
exports.markReached = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    delivery.status = 'delivered';
    delivery.deliveryDate = new Date();
    await delivery.save();

    await VendorTodo.updateOne(
      { vendorId: req.user._id, 'items.shopProductId': delivery.productId },
      { $set: { 'items.$.status': 'delivered' } }
    );

    res.json({ message: 'Marked as delivered' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark delivery as reached' });
  }
};

// ✅ Add Review
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment, productQuality, shopId } = req.body;

    const review = await Review.create({
      vendorId: req.user._id,
      productId,
      shopId,
      rating,
      comment,
      productQuality,
    });

    const reviews = await Review.find({ productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, { averageRating: avgRating });

    await VendorTodo.updateOne(
      { vendorId: req.user._id, 'items.shopProductId': productId },
      { $set: { 'items.$.reviewGiven': true } }
    );

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error adding review', error: err.message });
  }
};
