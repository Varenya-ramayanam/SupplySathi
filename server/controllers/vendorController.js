const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const StreetVendor = require('../models/StreetVendor');
const VendorTodo = require('../models/VendorTodo');
const Review = require('../models/Review');
const Delivery = require('../models/Delivery');

// Vendor Signup
exports.vendorSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await StreetVendor.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const vendor = await StreetVendor.create({ name, email, password: hashed });

    res.status(201).json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Vendor Login
exports.vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const vendor = await StreetVendor.findOne({ email });
    if (!vendor) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: vendor._id, role: 'vendor' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error('Vendor login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Vendor Profile
exports.getVendorProfile = (req, res) => {
  res.json(req.user);
};

// Add a todo item
exports.addTodoItem = async (req, res) => {
  try {
    const { productName, quantity } = req.body;
    const vendorId = req.user._id;

    let todo = await VendorTodo.findOne({ vendorId });
    if (!todo) todo = new VendorTodo({ vendorId, items: [] });

    todo.items.push({ productName, quantity });
    await todo.save();

    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Error adding todo item', error: err.message });
  }
};

// Get todo items
exports.getTodoItems = async (req, res) => {
  try {
    const todo = await VendorTodo.findOne({ vendorId: req.user._id });
    res.json(todo || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching todo items', error: err.message });
  }
};

// Update todo item status or reviewGiven
exports.updateTodoItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewGiven } = req.body;

    const todo = await VendorTodo.findOne({ vendorId: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    const item = todo.items.id(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (status) item.status = status;
    if (reviewGiven !== undefined) item.reviewGiven = reviewGiven;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Error updating todo item', error: err.message });
  }
};

// Delete a todo item
exports.deleteTodoItem = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await VendorTodo.findOne({ vendorId: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.items = todo.items.filter(item => item._id.toString() !== id);
    await todo.save();

    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting todo item', error: err.message });
  }
};

// Delete all todo items
exports.deleteAllTodoItems = async (req, res) => {
  try {
    await VendorTodo.deleteMany({ vendorId: req.user._id });
    res.json({ message: 'All todo items deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting all todo items', error: err.message });
  }
};

// Add a review
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment, productQuality } = req.body;
    const review = await Review.create({
      vendorId: req.user._id,
      productId,
      rating,
      comment,
      productQuality,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error adding review', error: err.message });
  }
};

// Get delivery by ID
exports.getDeliveryById = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const delivery = await Delivery.findOne({ _id: deliveryId, vendorId: req.user._id });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json({ delivery });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching delivery', error: err.message });
  }
};

// Update delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status } = req.body;

    const delivery = await Delivery.findOne({ _id: deliveryId, vendorId: req.user._id });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    delivery.status = status;
    await delivery.save();

    res.json({ delivery });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating delivery status', error: err.message });
  }
};

// Confirm delivery reached (alternative endpoint)
exports.confirmDeliveryReached = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findOne({ _id: id, vendorId: req.user._id });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    delivery.status = 'reached';
    await delivery.save();

    res.json({ message: 'Delivery status updated to reached' });
  } catch (err) {
    res.status(500).json({ message: 'Server error confirming delivery reached', error: err.message });
  }
};

// Get all deliveries for the vendor
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ vendorId: req.user._id });
    res.json({ deliveries });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching deliveries', error: err.message });
  }
};
