const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [
        {
            productId: Number,
            title: String,
            price: Number,
            thumbnail: String,
            quantity: Number
        }
    ]
})

module.exports = mongoose.model("Cart", cartSchema);