const express = require('express');
router = express.Router();
const cartController = require('../controllers/cartController')
const { protect } = require('../middleware/auth')
router.post(
    '/addCart',
    protect,
    cartController.addToCart
);

router.get(
    '/getCart',
    protect,
    cartController.getCart
);

router.delete(
    '/deleteCart/:productId',
    protect,
    cartController.removeFromCart
);

router.put(
    '/updateCart/:productId/:delta',
    protect,
    cartController.updateCart
);
module.exports = router;