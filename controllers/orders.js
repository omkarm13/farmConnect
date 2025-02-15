const Order = require("../models/order.js");
const Cart = require("../models/cart.js");
const Vegetable = require("../models/vegetable.js");
const DeliveryBoy = require("../models/deliveryBoy.js"); // Add the DeliveryBoy model
const TryCatch = require("../utils/TryCatch.js");

// ✅ Show all orders for the user
const showOrder = TryCatch(async (req, res) => {
    let orders = await Order.find({ user: req.user._id }).populate("items.vegetable").populate("assignedTo");
    res.render("order/index.ejs", { orders });
});

// ✅ Get a specific order by ID
const getOrderById = TryCatch(async (req, res) => {
    let order = await Order.findById(req.params.id)
        .populate("items.vegetable")
        .populate("assignedTo"); // Include assigned delivery boy info

    if (!order) {
        req.flash("error", "Order not found!");
        return res.redirect("/order");
    }

    res.render("order/show.ejs", { order });
});

// ✅ Place an order (Fix: Properly Update Stock)
const placeOrder = TryCatch(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.vegetable");

    if (!cart || cart.items.length === 0) {
        req.flash("error", "Your cart is empty!");
        return res.redirect("/cart");
    }

    let totalPrice = 0;
    let updates = [];

    for (let item of cart.items) {
        let vegetable = await Vegetable.findById(item.vegetable._id);

        if (!vegetable) {
            req.flash("error", `Vegetable ${item.vegetable.title} not found!`);
            return res.redirect("/cart");
        }

        // ✅ Check if enough stock is available
        if (vegetable.quantity < item.quantity) {
            req.flash("error", `Not enough stock for ${vegetable.title}`);
            return res.redirect("/cart");
        }

        totalPrice += vegetable.price * item.quantity;

        // ✅ Prepare bulk update for better performance
        updates.push({
            updateOne: {
                filter: { _id: vegetable._id },
                update: { $inc: { quantity: -item.quantity } } // ✅ Reduce stock
            }
        });
    }

    // ✅ Bulk update vegetable stock in one go
    if (updates.length > 0) {
        await Vegetable.bulkWrite(updates);
    }

    let newOrder = new Order({
        user: req.user._id,
        items: cart.items,
        totalPrice,
        status: "Pending", // Set initial status as "Pending"
    });

    await newOrder.save();

    // ✅ Clear the user's cart after successful order placement
    await Cart.findOneAndDelete({ user: req.user._id });

    req.flash("success", "Order placed successfully!");
    res.redirect("/order");
});

// ✅ Cancel an order (Fix: Properly Restore Stock)
const cancelOrder = TryCatch(async (req, res) => {
    let order = await Order.findById(req.params.id).populate("items.vegetable");

    if (!order) {
        req.flash("error", "Order not found!");
        return res.redirect("/order");
    }

    let updates = [];

    for (let item of order.items) {
        let vegetable = await Vegetable.findById(item.vegetable._id);
        if (vegetable) {
            updates.push({
                updateOne: {
                    filter: { _id: vegetable._id },
                    update: { $inc: { quantity: item.quantity } } // ✅ Restore stock
                }
            });
        }
    }

    // ✅ Bulk restore stock in one go
    if (updates.length > 0) {
        await Vegetable.bulkWrite(updates);
    }

    await Order.findByIdAndDelete(req.params.id);

    req.flash("success", "Order canceled successfully!");
    res.redirect("/order");
});

// ✅ Assign a delivery boy to an order (Admin Only)
const assignDeliveryBoy = TryCatch(async (req, res) => {
    let { deliveryBoyId } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
        req.flash("error", "Order not found!");
        return res.redirect("/order");
    }

    let deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);

    if (!deliveryBoy) {
        req.flash("error", "Delivery boy not found!");
        return res.redirect("/order");
    }

    // Assign the delivery boy and update the order status
    order.assignedTo = deliveryBoy._id;
    order.status = "Assigned"; // Change the status to "Assigned"
    await order.save();

    req.flash("success", "Delivery boy assigned successfully!");
    res.redirect(`/order/${order._id}`);
});

// ✅ Update order status to "Out for Delivery"
const markOrderOutForDelivery = TryCatch(async (req, res) => {
    let order = await Order.findById(req.params.id);

    if (!order) {
        req.flash("error", "Order not found!");
        return res.redirect("/order");
    }

    order.status = "Out for Delivery"; // Update status
    await order.save();

    req.flash("success", "Order marked as out for delivery!");
    res.redirect(`/order/${order._id}`);
});

// ✅ Update order status to "Delivered"
const markOrderAsDelivered = TryCatch(async (req, res) => {
    let order = await Order.findById(req.params.id);

    if (!order) {
        req.flash("error", "Order not found!");
        return res.redirect("/order");
    }

    order.status = "Delivered"; // Update status
    await order.save();

    req.flash("success", "Order marked as delivered!");
    res.redirect(`/order/${order._id}`);
});
// controllers/orders.js
module.exports.someFunction = (req, res) => {
    // Your logic here
    res.send("Some response");
};

// ✅ Export all functions properly
module.exports = {
    placeOrder,
    showOrder,
    getOrderById,
    cancelOrder,
    assignDeliveryBoy,
    markOrderOutForDelivery,
    markOrderAsDelivered,
};
