const Vegetable = require("../models/vegetable.js");

module.exports.indexVegetable = async(req, res, next)=>{

    if(req.query.search && req.query.search.length>0){
    let searchQ = req.query.search;
    let searchVegetables = await Vegetable.find({title: `${searchQ}`}).collation({ locale: 'en', strength: 2 });

    if(searchVegetables.length == 0){
        req.flash("error", "Vegetable does not exist!");
        return res.redirect("/vegetables");
    }
    return res.render("vegetables/search.ejs", {searchVegetables, searchQ});
    }else{
    const allVegetables = await Vegetable.find();
    res.render("vegetables/index.ejs", {allVegetables});
}
};

module.exports.newVegetable = (req, res)=>{
    res.render("vegetables/new.ejs");
};

module.exports.createVegetable = async(req, res, next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    
    let newVegetable = new Vegetable(req.body);
    newVegetable.owner = req.user._id;
    newVegetable.image = {url, filename};
    await newVegetable.save();
    req.flash("success", "New Vegetable Created!");
    res.redirect("/Vegetables");
};

module.exports.showVegetable = async(req, res)=>{

    let {id} = req.params;
    const vegetable = await Vegetable.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    
    if(!vegetable){
        req.flash("error", "vegetable does not exist!");
        return res.redirect("/vegetables");
    };
    res.render("vegetables/show.ejs", {vegetable});
};

module.exports.editVegetable = async(req, res, next)=>{
    let {id} = req.params;
    const vegetable = await Vegetable.findById(id);
    
    if(!vegetable){
        req.flash("error", "vegetables does not exist!");
        return res.redirect("/vegetables");
    };
    res.render("vegetables/edit.ejs", {vegetable});
};

module.exports.updateVegetable = async(req, res, next)=>{

    let {id} = req.params;
    await Vegetable.findByIdAndUpdate(id, {...req.body});

    req.flash("success", "vegetables Updated!");
    res.redirect(`/vegetables/${id}`);
};

module.exports.deleteVegetable = async(req, res)=>{
    let {id} = req.params;
    await Vegetable.findByIdAndDelete(id);
    req.flash("success", "vegetables Deleted!");
    res.redirect("/vegetables");
};
