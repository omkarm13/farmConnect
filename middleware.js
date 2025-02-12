const Vegetable = require("./models/vegetable.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { vegetableSchema, reviewSchema } = require("./schema.js");
const jwt = require("jsonwebtoken");
const User = require("./models/user.js");

module.exports.isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      req.flash("error", "Please Login!");
      return res.status(403).redirect("/user/login");
    };
    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    if (!decodedData) {
      req.flash("error", "Token expired, Please Login Again!");
      return res.status(403).redirect("/user/login");
    };

    const userId = await User.findById(decodedData.id);
    req.user = userId;

    next();

  } catch (error) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
};


module.exports.isOwner = async (req, res, next) => {

  let { id } = req.params;
  let vegetable = await Vegetable.findById(id);

  const token = req.cookies.token;
  if (!token) {
    req.flash("error", "Please Login!");
    return res.status(403).redirect("/user/login");
  };

  const decodedData = jwt.verify(token, process.env.JWT_SEC);

  if (!decodedData) {
    req.flash("error", "Token expired, Please Login Again!");
    return res.status(403).redirect("/user/login");
  };
  // console.log(decodedData);


  // let currUser = await User.findById(decodedData.id);

  if (!vegetable.owner._id.equals(decodedData.id)) {
    req.flash("error", "You don't have permission!");
    return res.redirect(`/vegetables/${id}`);
  };
  next();



}

module.exports.validateVegetable = (req, res, next) => {
  let { error } = vegetableSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser)) {
    req.flash("error", "You don't have permission!");
    return res.redirect(`/vegetables/${id}`);
  };
  next();

}


module.exports.setCurrUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.locals.currUser = undefined;
    return next();
  }

  try {
    // Verify the token
    const decodedData = jwt.verify(token, process.env.JWT_SEC);
    // console.log(decodedData);
    // console.log(decodedData.id);
    // console.log(decodedData.role);
    res.locals.currUser = decodedData.id;
    res.locals.roles = decodedData.role;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    req.flash("error", "You must be logged in!");
    return res.status(401).redirect(`/vegetables`);
  }
};


module.exports.isAdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log(token);

    if (!token) {
      req.flash("error", "Unauthorized Please");
      return res.status(403).redirect("/admin/login");
    };
    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    if (decodedData.role !== "admin") {
      req.flash("error", "Unauthorized Please Login!");
      return res.status(403).redirect("/admin/login");
    }
    next();


  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    res.status(500).json({ message: "Authorization error. Please log in." });




  }
};


//roles auth
module.exports.isFarmer = async(req, res, next) => {

  const token = req.cookies.token;
  // console.log(token);

  if (!token) {
    req.flash("error", "Unauthorized Please");
    return res.status(403).redirect("/user/login");
  };
  const decodedData = jwt.verify(token, process.env.JWT_SEC);
  // console.log(decodedData);

  if (decodedData.role !== "farmer") {
    req.flash("error", "Unauthorized Access!");
    return res.status(403).redirect("/vegetables");
  }
  next();
};


module.exports.isCustomer = async(req, res, next) => {


  const token = req.cookies.token;
  // console.log(token);

  if (!token) {
    req.flash("error", "Unauthorized Please");
    return res.status(403).redirect("/user/login");
  };
  const decodedData = jwt.verify(token, process.env.JWT_SEC);
  // console.log(decodedData);

  if (decodedData.role !== "customer") {
    req.flash("error", "Unauthorized Access!");
    return res.status(403).redirect("/vegetables");
  }
  next();
};


module.exports.isdeliveryBoy = async(req, res, next) => {

  const token = req.cookies.token;
  // console.log(token);

  if (!token) {
    req.flash("error", "Unauthorized Please");
    return res.status(403).redirect("/user/login");
  };
  const decodedData = jwt.verify(token, process.env.JWT_SEC);
  // console.log(decodedData);

  if (decodedData.role !== "delivery_boy") {
    req.flash("error", "Unauthorized Access!");
    return res.status(403).redirect("/delivery/orders");
  }
  next();
};