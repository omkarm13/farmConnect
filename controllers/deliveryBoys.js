
const Order = require("../models/order.js");
const TryCatch = require("../utils/TryCatch.js");


module.exports.viewOrder =  TryCatch(async (req, res) => {
    const orders = await Order.find({ assignedTo: req.user._id }).populate("user").populate("items.vegetable");
    res.render("delivery/orders.ejs", { orders });
});

//order status 
module.exports.updateOrderStatus =  TryCatch(async (req, res) => {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: "Delivered" });
    req.flash("success", "Order marked as Delivered!");
    res.redirect("/delivery/orders");
});