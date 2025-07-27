const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ShopOwner = require('../models/ShopOwner');
const Product = require('../models/Product');
const Review = require('../models/Review');

// ✅ Shop Signup
exports.shopSignup = async (req, res) => {
  try {
    const { name, email, password, shopName, phone, address } = req.body;

    if (!name || !email || !password || !shopName || !phone || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await ShopOwner.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ message: 'Email or phone already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await ShopOwner.create({
      name,
      email,
      password: hashed,
      shopName,
      phone,
      address
    });

    res.status(201).json({ message: 'Signup successful', user });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// ✅ Shop Login
exports.shopLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await ShopOwner.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { name: user.name, email: user.email, shopName: user.shopName } });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get Shop Owner Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await ShopOwner.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// ✅ Add Product (merge if name exists for that shop)
exports.addProduct = async (req, res) => {
  const { name, description, price, quantity, photoUrl, expiryDate } = req.body;
  try {
    const trimmedName = name.trim().toLowerCase();
    let existingProduct = await Product.findOne({
      name: trimmedName,
      shopOwnerId: req.user._id,
    });

    if (existingProduct) {
      existingProduct.quantity += parseInt(quantity);
      existingProduct.price = price;
      existingProduct.photoUrl = photoUrl;
      existingProduct.expiryDate = expiryDate;
      await existingProduct.save();

      return res.status(200).json({
        message: 'Product quantity updated',
        product: existingProduct,
      });
    }

    const product = await Product.create({
      name: trimmedName,
      description,
      price,
      quantity,
      photoUrl,
      expiryDate,
      shopOwnerId: req.user._id,
    });

    res.status(201).json({ message: 'New product added', product });
  } catch (err) {
    console.error('❌ Error adding product:', err);
    res.status(500).json({ message: 'Failed to add product', error: err.message });
  }
};

// ✅ Get All Products of Shop Owner
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ shopOwnerId: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

// ✅ Update a Product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// ✅ Delete a Product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

// ✅ Get All Reviews of a Product
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id }).populate('vendorId', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};


const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.uploadProductImage = async (req, res) => {
  try {
    console.log("📷 Uploaded file:", req.file);

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const url = req.file.path;
    res.status(200).json({ url });
  } catch (err) {
    console.error('❌ Cloudinary Upload Failed:', err);
    res.status(500).json({ message: 'Cloudinary upload failed', error: err.message });
  }
};


