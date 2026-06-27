const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
router.post('/signUp', authController.signUpUser);
module.exports = router;