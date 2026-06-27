const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const User = require('../models/user.model')
exports.signUpUser = async (req, res) => {
    console.log(req.body);
    
    const { name, email, phoneNo, password } = req.body;
    try {
        if (!name || !password)
            return res.status(400).json({ message: 'Name and password are required.' });
        if (password.length < 6)
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });

        if (email) {
            const exists = await User.findOne({ email });
            if (exists) return res.status(409).json({ message: 'Email already registered.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            password: hashedPassword,
            email: email
        };
        const user = new User(userData);
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            message: 'Account created successfully.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Server error.' });
    }
}
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if ((!email && !phone) || !password)
            return res.status(400).json({ message: 'Credentials and password are required.' });
        let user;
        user = await User.find({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
}