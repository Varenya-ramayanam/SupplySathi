const express = require('express');
const router = express.Router();

const vendorCtrl = require('../controllers/vendorController');
const auth = require('../middleware/authMiddleware');
const StreetVendor = require('../models/StreetVendor');

// Public routes (no auth)
router.post('/signup', vendorCtrl.vendorSignup);
router.post('/login', vendorCtrl.vendorLogin);

// Protected routes (require auth)
router.get('/me', auth(StreetVendor), vendorCtrl.getVendorProfile);

// Todo operations
router.post('/todo', auth(StreetVendor), vendorCtrl.addTodoItem);
router.get('/todo', auth(StreetVendor), vendorCtrl.getTodoItems);
router.put('/todo/:id', auth(StreetVendor), vendorCtrl.updateTodoItem);
router.delete('/todo/:id', auth(StreetVendor), vendorCtrl.deleteTodoItem);
router.delete('/todo', auth(StreetVendor), vendorCtrl.deleteAllTodoItems);

// Reviews
router.post('/review', auth(StreetVendor), vendorCtrl.addReview);

// Delivery details and status updates
router.get('/delivery/:deliveryId', auth(StreetVendor), vendorCtrl.getDeliveryById);
router.patch('/delivery/:deliveryId', auth(StreetVendor), vendorCtrl.updateDeliveryStatus);

// Confirm delivery reached (optional route)
router.patch('/delivery/:id/reached', auth(StreetVendor), vendorCtrl.confirmDeliveryReached);

// List all deliveries for the vendor
router.get('/deliveries', auth(StreetVendor), vendorCtrl.getAllDeliveries);

module.exports = router;
