const Cart = require('../models/cart.model')
exports.addToCart = async (req, res) => {

    const { id, title, price, thumbnail } = req.body;
    console.log(id);

    // console.log(req.user.userId);

    let cart = await Cart.findOne({
        user: req.user._id
    });
    // console.log(cart);

    if (!cart) {

        cart = await Cart.create({
            user: req.user._id,
            items: [{
                productId: id,
                title,
                price,
                thumbnail,
                quantity: 1
            }]
        });

        return res.json(cart);
    }

    const item = cart.items.find(
        p => p.productId === id
    );

    if (item) {

        item.quantity++;

    } else {

        cart.items.push({
            productId: id,
            title,
            price,
            thumbnail,
            quantity: 1
        });

    }

    await cart.save();

    res.json(cart);

};
exports.getCart = async (req, res) => {

    const cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {
        return res.json({
            items: []
        });
    }

    res.json(cart);

};
exports.removeFromCart = async (req, res) => {

    const productId = Number(req.params.productId);

    const cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {

        return res.status(404).json({
            message: 'Cart not found'
        });

    }

    cart.items = cart.items.filter(
        item => item.productId !== productId
    );

    await cart.save();

    res.json(cart);

};
exports.updateCart = async (req, res) => {
    const productId = Number(req.params.productId);
    const delta = Number(req.params.delta);
    const userId = req.user._id;
    let cart = Cart.findOne({ user: userId });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }
    console.log(cart);
    
    const cartItem = cart.items.find(item => item.productId == productId);
    if (cartItem.quantity == 1 && delta == -1) {
        await Cart.updateOne(
            { user: userId },
            { $pull: { items: { productId: productId } } }
        );
        return res.status(200).json({ message: "Item removed from cart" });
    }
    else {
        await Cart.updateOne(
            { user: userId, "items.productId": productId },
            { $inc: { "items.$.quantity": delta } }
        );
        return res.status(200).json({ message: "Item Quantity Updated" });
    }
}