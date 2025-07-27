const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/shopController');
const auth = require('../middleware/authMiddleware');
const ShopOwner = require('../models/ShopOwner');

router.post('/signup', ctrl.shopSignup);
router.post('/login', ctrl.shopLogin);
router.get('/me', auth(ShopOwner), ctrl.getProfile);
router.post('/products', auth(ShopOwner), ctrl.addProduct);
router.get('/products', auth(ShopOwner), ctrl.getMyProducts);
router.put('/product/:id', auth(ShopOwner), ctrl.updateProduct);
router.delete('/product/:id', auth(ShopOwner), ctrl.deleteProduct);
router.get('/reviews/:id', auth(ShopOwner), ctrl.getReviews);

// 🧹 Removed file upload route

module.exports = router;
