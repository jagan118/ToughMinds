const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
router.post('/login', protect , authController.loginUser);
module.exports = router;