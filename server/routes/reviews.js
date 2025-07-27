// routes/reviews.js
const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const StreetVendor = require("../models/StreetVendor");
const authMiddleware = require("../middleware/authMiddleware")(StreetVendor); // protect route for vendors only

router.post("/", authMiddleware, async (req, res) => {
  const { productId, rating, comment, deliveryId, middlemanId, shopId, productQuality } = req.body;

  if (!rating || !comment || !productId || !deliveryId || !middlemanId || !shopId || !productQuality) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newReview = new Review({
      vendorId: req.user._id,
      productId,
      rating,
      comment,
      deliveryId,
      middlemanId,
      shopId,
      productQuality
    });

    await newReview.save();
    res.status(201).json({ message: "Review submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
