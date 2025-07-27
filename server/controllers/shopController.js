// ✅ Updated: controllers/shopController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ShopOwner = require('../models/ShopOwner');
const Product = require('../models/Product');
const Review = require('../models/Review');

exports.shopSignup = async (req, res) => {
  const { name, email, password, shopName } = req.body;
  const existing = await ShopOwner.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await ShopOwner.create({ name, email, password: hashed, shopName });
  res.status(201).json(user);
};

exports.shopLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await ShopOwner.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};

exports.getProfile = (req, res) => {
  res.json(req.user);
};

// ✅ Updated function: merge if shop+name exists, else add new
exports.addProduct = async (req, res) => {
  const { name, description, price, quantity, photoUrl, expiryDate } = req.body;
  try {
    let existingProduct = await Product.findOne({
      name: name.trim().toLowerCase(),
      shopOwnerId: req.user._id,
    });

    if (existingProduct) {
      existingProduct.quantity += parseInt(quantity);
      existingProduct.price = price;
      existingProduct.photoUrl = photoUrl;
      existingProduct.expiryDate = expiryDate;
      await existingProduct.save();
      return res.status(200).json({
        message: "Product quantity updated",
        product: existingProduct,
      });
    }

    const product = await Product.create({
      name: name.trim().toLowerCase(),
      description,
      price,
      quantity,
      photoUrl,
      expiryDate,
      shopOwnerId: req.user._id,
    });

    res.status(201).json({
      message: "New product added",
      product,
    });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyProducts = async (req, res) => {
  const products = await Product.find({ shopOwnerId: req.user._id });
  res.json(products);
};

exports.updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

exports.getReviews = async (req, res) => {
  const reviews = await Review.find({ productId: req.params.id });
  res.json(reviews);
};
