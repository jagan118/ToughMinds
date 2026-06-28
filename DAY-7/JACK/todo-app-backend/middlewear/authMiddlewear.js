const jwt = require('jsonwebtoken');
const User = require('../models/User');

 const protect = async (req, res, next) => {
    let token;

    // 1. Check for token in headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from string ("Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token payload and attach to req object
            req.user = await User.findById(decoded.id).select('-password');

            // CRITICAL FIX: What if token is valid but user was deleted from DB?
            if (!req.user) {
                return res.status(401).json({
                    message: 'Not authorized, user not found'
                });
            }

            // Everything is good, move to the next middleware/controller
            return next(); 

        } catch (error) {
            console.error(error); // Good practice to log the actual error for debugging
            return res.status(401).json({
                message: 'Not authorized, token failed'
            });
        }
    }

    // 2. If no token was found at all
    if (!token) {
        return res.status(401).json({
            message: 'Not authorized, no token provided'
        });
    }
};

module.exports = protect;