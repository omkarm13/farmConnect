const User = require("../models/user.js");
// const generateAdminToken = require("../utils/generateAdminToken.js");
const generateAdminToken = require("../utils/generateAdminToken.js");
const TryCatch = require("../utils/TryCatch.js");
const bcrypt = require("bcrypt");


module.exports.adminForm = (req, res) => {
    res.render("users/admin.ejs");
};


module.exports.adminLogin = TryCatch(async (req, res) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_UNAME && password === process.env.ADMIN_PASSWD) {

        generateAdminToken(res);

        req.flash("success", "You are logged in!");
        return res.redirect("/");

    } else {
        req.flash("error", "Incorrect username or password!");
        return res.redirect("/admin/login");
    }
});



module.exports.logoutAdmin = TryCatch(async (req, res) => {
    res.cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "strict" });


    req.flash("success", "You are logged out!");
    res.status(200).redirect("/admin/login");
});
