const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Middleman = require('../models/Middleman');
const VendorTodo = require('../models/VendorTodo');
const Product = require('../models/Product');
const Delivery = require('../models/Delivery');

exports.middlemanSignup = async (req, res) => {
  const { name, email, password, godownAddress } = req.body;
  const existing = await Middleman.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await Middleman.create({ name, email, password: hashed, godownAddress });
  res.status(201).json(user);
};

exports.middlemanLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await Middleman.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};

exports.getProfile = (req, res) => {
  res.json(req.user);
};

exports.getVendorRequests = async (req, res) => {
  try {
    const todos = await VendorTodo.find().populate('vendorId');

    const allItems = todos.flatMap(todo =>
      todo.items.map(item => ({
        _id: item._id,
        productName: item.productName,
        quantity: item.quantity,
        vendorId: todo.vendorId?._id,
        vendorName: todo.vendorId?.name
      }))
    );

    res.json(allItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vendor requests' });
  }
};

exports.getAvailableProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('shopOwnerId', 'name shopName');
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.initiateDelivery = async (req, res) => {
  const { vendorId, shopId, productId, quantity } = req.body;
  const delivery = await Delivery.create({
    vendorId,
    shopId,
    productId,
    quantity,
    middlemanId: req.user._id,
    status: 'in_progress'
  });
  res.status(201).json(delivery);
};

exports.updateDeliveryStatus = async (req, res) => {
  const { id } = req.params;
  const { status, verifiedByMiddleman, notes } = req.body;
  const updated = await Delivery.findByIdAndUpdate(id, { status, verifiedByMiddleman, notes }, { new: true });
  res.json(updated);
};

exports.getMyDeliveries = async (req, res) => {
  const deliveries = await Delivery.find({ middlemanId: req.user._id });
  res.json(deliveries);
};

// ✅ Updated: Add matched product to vendor's memo and remove it from availability
// Updated logic: reduce product quantity instead of deleting
exports.addToMemo = async (req, res) => {
  const { vendorId, productName, quantity, shopProductId } = req.body;

  console.log("🧪 Incoming data:", { vendorId, productName, quantity, shopProductId });

  try {
    const product = await Product.findById(shopProductId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check quantity
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough quantity available" });
    }

    // Find or create vendor todo
    let vendorTodo = await VendorTodo.findOne({ vendorId });
    if (!vendorTodo) {
      vendorTodo = new VendorTodo({ vendorId, items: [] });
    }

    const alreadyExists = vendorTodo.items.some(
      item =>
        item.productName.toLowerCase() === productName.toLowerCase() &&
        item.shopProductId?.toString() === shopProductId
    );
    if (alreadyExists) {
      return res.status(409).json({ message: "Product already added to memo" });
    }

    vendorTodo.items.push({
      productName,
      quantity,
      status: "started_to_deliver",
      shopProductId,
      addedByMiddleman: true,
    });

    await vendorTodo.save();

    // Decrease quantity instead of deleting
    product.quantity -= quantity;
    let updatedProduct = null;

    if (product.quantity <= 0) {
      await Product.findByIdAndDelete(shopProductId);
    } else {
      updatedProduct = await product.save();
    }

    const delivery = await Delivery.create({
      vendorId,
      productId: shopProductId,
      quantity,
      middlemanId: req.user._id,
      status: "started_to_deliver",
    });

    res.status(200).json({
      message: "✅ Added to vendor memo and delivery started.",
      delivery,
      updatedProduct,
    });
  } catch (error) {
    console.error("🔥 Error in addToMemo:", error);
    res.status(500).json({ message: "Server error" });
  }
};


