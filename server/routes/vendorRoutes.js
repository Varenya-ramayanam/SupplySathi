const express = require('express');
const router = express.Router();
const vendorCtrl = require('../controllers/vendorController');
const auth = require('../middleware/authMiddleware');
const StreetVendor = require('../models/StreetVendor');

router.post('/signup', vendorCtrl.vendorSignup);
router.post('/login', vendorCtrl.vendorLogin);
router.get('/me', auth(StreetVendor), vendorCtrl.getVendorProfile);
router.post('/todo', auth(StreetVendor), vendorCtrl.addTodoItem);
router.get('/todo', auth(StreetVendor), vendorCtrl.getTodoItems);
router.put('/todo/:id', auth(StreetVendor), vendorCtrl.updateTodoItem);
router.delete('/todo/:id', auth(StreetVendor), vendorCtrl.deleteTodoItem);
router.post('/review', auth(StreetVendor), vendorCtrl.addReview);

module.exports = router;