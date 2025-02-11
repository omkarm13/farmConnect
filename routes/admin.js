const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admins.js");
const { isAuth, isAdminAuth} = require("../middleware.js");


router.get("/login", adminController.adminForm);
router.post("/login", adminController.adminLogin);


router.get("/logout",isAdminAuth, adminController.logoutAdmin);


module.exports = router;