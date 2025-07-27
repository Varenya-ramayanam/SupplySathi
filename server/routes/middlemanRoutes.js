const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/middlemanController');
const auth = require('../middleware/authMiddleware');
const Middleman = require('../models/Middleman');

// Auth protected middleware
const protect = auth(Middleman);

// Middleman Auth
router.post('/signup', ctrl.middlemanSignup);
router.post('/login', ctrl.middlemanLogin);
router.get('/me', protect, ctrl.getProfile);

// Core Actions
router.get('/vendor-requests', protect, ctrl.getVendorRequests);
router.get('/available-products', protect, ctrl.getAvailableProducts);

// Delivery Actions
router.post('/deliver', protect, ctrl.initiateDelivery);
router.patch('/delivery/:id', protect, ctrl.updateDeliveryStatus);
router.get('/deliveries', protect, ctrl.getMyDeliveries);

// Memo Management
router.post('/add-to-memo', protect, ctrl.addToMemo);

module.exports = router;
