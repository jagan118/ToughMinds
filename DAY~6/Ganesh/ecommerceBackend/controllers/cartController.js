exports.addToCart = async (req, res) => {

    const { productId, title, price, thumbnail } = req.body;

    let cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {

        cart = await Cart.create({
            user: req.user._id,
            items: [{
                productId,
                title,
                price,
                thumbnail,
                quantity: 1
            }]
        });

        return res.json(cart);
    }

    const item = cart.items.find(
        p => p.productId === productId
    );

    if (item) {

        item.quantity++;

    } else {

        cart.items.push({
            productId,
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