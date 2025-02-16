const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const helpController = require("../controllers/helps.js");
// const { isAuth } = require("../middleware.js");


router.get("/", helpController.help);

module.exports = router;