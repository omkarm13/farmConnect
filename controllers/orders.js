const Order = require("../models/order.js");
const Cart = require("../models/cart.js");
const TryCatch = require("../utils/TryCatch.js");

// Place order
module.exports.placeOrder = TryCatch(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.vegetable");

    if (!cart || cart.items.length === 0) {
        req.flash("error", "Your cart is empty!");
        return res.redirect("/cart");
    }

    let totalPrice = cart.items.reduce((total, item) => total + item.vegetable.price * item.quantity, 0);

    let newOrder = new Order({
        user: req.user._id,
        items: cart.items,
        totalPrice
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ user: req.user._id });

    req.flash("success", "Order placed successfully!");
    res.redirect("/order");
});

// View orders
module.exports.showOrder = TryCatch(async (req, res) => {
    let orders = await Order.find({ user: req.user._id }).populate("items.vegetable");
    res.render("order/index.ejs", { orders });
});

