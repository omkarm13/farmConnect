const User = require("../models/user.js");
// const generateAdminToken = require("../utils/generateAdminToken.js");
const generateAdminToken = require("../utils/generateAdminToken.js");
const TryCatch = require("../utils/TryCatch.js");
const bcrypt = require("bcrypt");
const Order = require("../models/order.js");


module.exports.adminForm = (req, res) => {
    res.render("admin/login.ejs");
};


module.exports.adminLogin = TryCatch(async (req, res) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_UNAME && password === process.env.ADMIN_PASSWD) {

        generateAdminToken(res);

        req.flash("success", "You are logged in!");
        return res.redirect("/admin/orders");

    } else {
        req.flash("error", "Incorrect username or password!");
        return res.redirect("/admin/login");
    }
});

//viewOrder
module.exports.viewOrders = TryCatch(async (req, res) => {
    // console.log("helloadmin");
    const orders = await Order.find().populate("user").populate("assignedTo");
    const deliveryBoys = await User.find({ role: "delivery_boy" }); //all delivery boys
    res.render("admin/orders.ejs", { orders, deliveryBoys });
});

//assignOrder
module.exports.assignOrders = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { deliveryBoyId } = req.body;

    const order = await Order.findById(id);
    if (!order) {
        req.flash("error", "Order not found!");
        return res.redirect("/admin/orders");
    };

    if (order.status === "Delivered") {
        req.flash("error", "Cannot assign a delivered order!");
        return res.redirect("/admin/orders");
    };


    await Order.findByIdAndUpdate(id, { assignedTo: deliveryBoyId, status: "Assigned" });
    req.flash("success", "Order assigned to Delivery Boy!");
    res.redirect("/admin/orders");
});











module.exports.logoutAdmin = TryCatch(async (req, res) => {
    res.cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "strict" });


    req.flash("success", "You are logged out!");
    res.status(200).redirect("/admin/login");
});
