const express = require("express");
const router = express.Router();
const cartController = require("../controllers/carts.js");
const Cart = require("../models/cart.js");
const Vegetable = require("../models/vegetable");
const vegetableController = require("../controllers/vegetables.js");

const Order = require("../models/order.js");
const orderController = require("../controllers/orders.js");

const { isAuth, isCustomer } = require("../middleware.js");


router.post("/place", isAuth, isCustomer, orderController.placeOrder);

router.get("/", isAuth, isCustomer, orderController.showOrder);

// router.get("/:id", isAuth, isCustomer, vegetableController.showVegetable);

module.exports = router;