// if(process.env.NODE_ENV != "production"){
//     require('dotenv').config();
// };
require('dotenv').config();


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const orderRouter = require("./routes/order.js");
const cartRouter = require("./routes/cart.js");
const vegetableRouter = require("./routes/vegetable.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js"); 
const adminRouter = require("./routes/admin.js"); 
const deliveryBoyRouter = require("./routes/deliveryBoy.js"); 

const { setCurrUser } = require("./middleware.js");

const cookieParser = require('cookie-parser');

const ATLAS_URL = process.env.ATLAS_DB_URL;

async function main() {
    await mongoose.connect(ATLAS_URL);
}

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });


app.listen(8888, () => {
    console.log("server is listing to port 8888");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//Authentication

app.use(cookieParser());

app.use ((req, res, next)=>{

    res.locals.success = req.cookies.success || null;
    res.locals.error = req.cookies.error || null;

    // Clear flash cookies after they are read
    res.clearCookie("success");
    res.clearCookie("error");

    // Function to set flash messages
    req.flash = (type, message) => {
        if (type === "success") {
            res.cookie("success", message, { httpOnly: true });
        } else if (type === "error") {
            res.cookie("error", message, { httpOnly: true });
        }
    };
 
    next();

});

app.use(setCurrUser);



//ROOT
app.get("/", (req, res) => {
    // res.send("Root");
    res.redirect("/vegetables");
});


app.use("/vegetables", vegetableRouter);
app.use("/vegetables/:id/reviews", reviewRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/admin", adminRouter);
app.use("/delivery", deliveryBoyRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Not Found!"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "somthing went wrong!" } = err;
    res.status(statusCode).render("vegetables/error.ejs", { message });
});

