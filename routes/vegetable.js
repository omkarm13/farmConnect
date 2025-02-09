const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isOwner} = require("../middleware.js");
const vegetableController = require("../controllers/vegetables.js");
const { isAuth } = require("../middleware.js");
const TryCatch = require("../utils/TryCatch.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage})

router.route("/")
.get(wrapAsync(vegetableController.indexVegetable))
.post(isAuth, upload.single('image'), wrapAsync(vegetableController.createVegetable));
// .post(upload.single('image'), (req, res, next) =>{
    
// });

router.get("/", wrapAsync(vegetableController.indexVegetable));

//New Route
router.get("/new", isAuth, vegetableController.newVegetable);

router.route("/:id")
.get(wrapAsync(vegetableController.showVegetable))
.put(isAuth, isOwner, wrapAsync(vegetableController.updateVegetable))
.delete(isAuth, isOwner, wrapAsync(vegetableController.deleteVegetable));

// //Edit Route
router.get("/:id/edit", isAuth, isOwner, wrapAsync(vegetableController.editVegetable));



module.exports = router;