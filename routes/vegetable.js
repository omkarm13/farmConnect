const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isOwner, isFarmer} = require("../middleware.js");
const vegetableController = require("../controllers/vegetables.js");
const { isAuth } = require("../middleware.js");
const TryCatch = require("../utils/TryCatch.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage})

router.route("/")
.get(wrapAsync(vegetableController.indexVegetable))
.post(isAuth, isFarmer, upload.single('image'), wrapAsync(vegetableController.createVegetable));
// .post(upload.single('image'), (req, res, next) =>{
    
// });

router.get("/", wrapAsync(vegetableController.indexVegetable));

//New Route
router.get("/new", isAuth, isFarmer, vegetableController.newVegetable);

router.route("/:id")
.get(wrapAsync(vegetableController.showVegetable))
.put(isAuth, isFarmer, isOwner, wrapAsync(vegetableController.updateVegetable))
// .delete(isAuth, isFarmer, isOwner, wrapAsync(vegetableController.deleteVegetable));

// //Edit Route
router.get("/:id/edit", isAuth, isFarmer, isOwner, wrapAsync(vegetableController.editVegetable));



module.exports = router;