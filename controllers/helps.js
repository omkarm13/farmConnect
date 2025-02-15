const TryCatch = require("../utils/TryCatch.js");


module.exports.help = TryCatch(async (req, res) => {
    res.render("help/help.ejs");
});