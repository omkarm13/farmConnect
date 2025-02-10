const express = require("express");
const router = express.Router();
const cartController = require("../controllers/carts.js");
const Cart = require("../models/cart.js");
const Vegetable = require("../models/vegetable");
const vegetableController = require("../controllers/vegetables.js");

const Order = require("../models/order.js");
const orderController = require("../controllers/orders.js");

const { isAuth } = require("../middleware.js");


router.post("/place", isAuth, orderController.placeOrder);

router.get("/", isAuth, orderController.showOrder);

router.get("/:id", isAuth, vegetableController.showVegetable);

module.exports = router;