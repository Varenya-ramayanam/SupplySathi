const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Middleman = require("../models/Middleman");
const VendorTodo = require("../models/VendorTodo");
const Product = require("../models/Product");
const Delivery = require("../models/Delivery");

exports.middlemanSignup = async (req, res) => {
  try {
    const { name, email, password, godownAddress, phone } = req.body;

    if (!name || !email || !password || !godownAddress || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await Middleman.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ message: "Email or phone already exists." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await Middleman.create({
      name,
      email,
      password: hashed,
      godownAddress,
      phone,
    });

    res.status(201).json({ message: "Signup successful", user });
  } catch (error) {
    console.error("Middleman signup error:", error);
    res.status(500).json({ message: "Signup error", error: error.message });
  }
};

// Login
exports.middlemanLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Middleman.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

// Profile
exports.getProfile = (req, res) => {
  res.json(req.user);
};

// Vendor Todos
exports.getVendorRequests = async (req, res) => {
  try {
    const todos = await VendorTodo.find().populate("vendorId");

    const allItems = todos.flatMap(todo =>
      todo.items.map(item => ({
        _id: item._id,
        productName: item.productName,
        quantity: item.quantity,
        vendorId: todo.vendorId?._id,
        vendorName: todo.vendorId?.name,
      }))
    );

    res.json(allItems);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vendor requests" });
  }
};

// Shop Products
exports.getAvailableProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("shopOwnerId", "name shopName");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Start Delivery
exports.initiateDelivery = async (req, res) => {
  try {
    const { vendorId, shopId, productId, quantity } = req.body;

    const delivery = await Delivery.create({
      vendorId,
      shopId,
      productId,
      quantity,
      middlemanId: req.user._id,
      status: "in_progress",
    });

    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: "Error creating delivery", error: error.message });
  }
};

// Update Delivery Status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, verifiedByMiddleman, notes } = req.body;

    const updated = await Delivery.findByIdAndUpdate(
      id,
      { status, verifiedByMiddleman, notes },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Delivery not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating delivery", error: error.message });
  }
};

// Get All Deliveries of this Middleman
exports.getMyDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ middlemanId: req.user._id });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch deliveries" });
  }
};

// Add to Vendor Memo
exports.addToMemo = async (req, res) => {
  const { vendorId, productName, quantity, shopProductId } = req.body;

  try {
    const product = await Product.findById(shopProductId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough quantity available" });
    }

    let vendorTodo = await VendorTodo.findOne({ vendorId });
    if (!vendorTodo) {
      vendorTodo = new VendorTodo({ vendorId, items: [] });
    }

    // Remove existing item for this product
    vendorTodo.items = vendorTodo.items.filter(
      item =>
        !(
          item.productName.toLowerCase() === productName.toLowerCase() &&
          item.shopProductId?.toString() === shopProductId
        )
    );

    // Push new item created by middleman
    vendorTodo.items.push({
      productName,
      quantity,
      status: "started_to_deliver",
      shopProductId,
      addedByMiddleman: true,
    });

    await vendorTodo.save();

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
      shopId: product.shopOwnerId,
      quantity,
      middlemanId: req.user._id,
      status: "started_to_deliver",
    });

    res.status(200).json({
      message: "Old item removed and new product added to memo",
      delivery,
      updatedProduct,
    });
  } catch (error) {
    console.error("Error adding to memo:", error);
    res.status(500).json({ message: "Error adding to memo", error: error.message });
  }
};


