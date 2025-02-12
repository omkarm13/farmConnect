const express = require("express");
const router = express.Router();
const Order = require("../models/order.js");
const deliveryBoyController = require("../controllers/deliveryBoys.js");
const { isAuth} = require("../middleware.js");


router.get("/orders",isAuth, deliveryBoyController.viewOrder);

router.post("/orders/:id/deliver", isAuth, deliveryBoyController.updateOrderStatus);

module.exports = router;