const express = require("express");
const router = express.Router();
const cartController = require("../controllers/carts.js");
const Cart = require("../models/cart.js");
const Vegetable = require("../models/vegetable");
const { isAuth } = require("../middleware.js");

router.post('/add/:vegId', isAuth, cartController.addCart);

router.get("/", isAuth, cartController.viewCart);

router.put("/update/:id", isAuth, cartController.updateCart);

router.delete("/remove/:vegId", isAuth, cartController.deleteCart);

// router.get("/demo", cartController.demo);

module.exports = router;
