const express = require('express');
const router = express.Router();
const vendorCtrl = require('../controllers/vendorController');
const auth = require('../middleware/authMiddleware');
const StreetVendor = require('../models/StreetVendor');

// 🔐 Vendor Auth Routes
router.post('/signup', vendorCtrl.vendorSignup);
router.post('/login', vendorCtrl.vendorLogin);
router.get('/me', auth(StreetVendor), vendorCtrl.getVendorProfile);

// ✅ Todo Routes
router.get('/todo', auth(StreetVendor), vendorCtrl.getTodos);
router.post('/todo', auth(StreetVendor), vendorCtrl.addTodo);
router.delete('/todo/:id', auth(StreetVendor), vendorCtrl.deleteTodo);
router.delete('/todo', auth(StreetVendor), vendorCtrl.clearTodos);

// ✅ Review + Delivery
router.post('/review', auth(StreetVendor), vendorCtrl.addReview);
router.patch('/delivery/:id/reached', auth(StreetVendor), vendorCtrl.markReached);

// ✅ Deliveries
router.get('/deliveries', auth(StreetVendor), vendorCtrl.getDeliveries);

module.exports = router;
