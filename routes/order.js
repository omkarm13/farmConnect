const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders.js");
const { isAuth } = require("../middleware.js");

// ✅ Place an order
router.post("/place", isAuth, orderController.placeOrder);

// ✅ Get all orders for the authenticated user
router.get("/", isAuth, orderController.showOrder);

// ✅ Get details of a specific order
router.get("/:id", isAuth, orderController.getOrderById);  // ✅ This will now work

// ✅ Cancel an order
router.delete("/:id/cancel", isAuth, orderController.cancelOrder);

module.exports = router;
