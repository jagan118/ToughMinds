const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true }
})
module.exports = mongoose.model('User',userSchema)