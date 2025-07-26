const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/middlemanController');
const auth = require('../middleware/authMiddleware');
const Middleman = require('../models/Middleman');

router.post('/signup', ctrl.middlemanSignup);
router.post('/login', ctrl.middlemanLogin);
router.get('/me', auth(Middleman), ctrl.getProfile);
router.get('/vendor-requests', auth(Middleman), ctrl.getVendorRequests);
router.get('/available-products', auth(Middleman), ctrl.getAvailableProducts);
router.post('/deliver', auth(Middleman), ctrl.initiateDelivery);
router.put('/verify/:id', auth(Middleman), ctrl.updateDeliveryStatus);
router.get('/deliveries', auth(Middleman), ctrl.getMyDeliveries);

module.exports = router;
