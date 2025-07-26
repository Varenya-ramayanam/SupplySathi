const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const StreetVendor = require('../models/StreetVendor');
const VendorTodo = require('../models/VendorTodo');
const Review = require('../models/Review');

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

exports.getVendorProfile = (req, res) => {
  res.json(req.user);
};

exports.addTodoItem = async (req, res) => {
  const { productName, quantity } = req.body;
  const vendorId = req.user._id;
  let todo = await VendorTodo.findOne({ vendorId });
  if (!todo) todo = new VendorTodo({ vendorId, items: [] });
  todo.items.push({ productName, quantity });
  await todo.save();
  res.status(201).json(todo);
};

exports.getTodoItems = async (req, res) => {
  const todo = await VendorTodo.findOne({ vendorId: req.user._id });
  res.json(todo || { items: [] });
};

exports.updateTodoItem = async (req, res) => {
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
};

exports.deleteTodoItem = async (req, res) => {
  const { id } = req.params;
  const todo = await VendorTodo.findOne({ vendorId: req.user._id });
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  todo.items = todo.items.filter(item => item._id.toString() !== id);
  await todo.save();
  res.json(todo);
};

exports.addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const review = await Review.create({ vendorId: req.user._id, productId, rating, comment });
  res.status(201).json(review);
};