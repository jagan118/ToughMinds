const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
exports.protect = async (req, res, next) => {
    try {
        // console.log(req.headers.authorization);

        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please login.'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found. Please login again.'
            });
        }

        // console.log(decoded.userId);

        req.user = user;
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
}