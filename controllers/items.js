const Item = require("../models/Item");
const Claim = require("../models/Claim");

module.exports.index = async (req, res) => {
  const category = req.query.category || '';
  const searchQuery = req.query.query || '';

  let filter = {};

  if (category) {
    filter.category = category;
  }

  if (searchQuery) {
    // This assumes 'title' is the field you want to search
    filter.title = { $regex: searchQuery, $options: 'i' }; // 'i' = case-insensitive
  }

  try {
    const allListings = await Item.find(filter);
    res.render('items/list.ejs', {
      allListings,
      category,
      searchQuery
    });
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).send('Server Error');
  }
}

module.exports.renderNewForm = (req,res)=>{
  res.render('items/addNew.ejs');
}

module.exports.showListing =async(req,res)=>{
  const {id}=req.params;
  const listing=await Item.findById(id)
                .populate('owner')
                .populate('claims');
  if(!listing) {
    req.flash('error', "Item does not exists!");
    return res.redirect('/items');
    // throw new ExpressError(404, "Item not found");
  }
  const claims = await Claim.find({
                    itemId: listing._id })
                    .populate('claimant');
  res.render('items/show.ejs',{listing , claims,  currUser: req.user });
}

module.exports.createListing = async(req, res, next) => {
  try{
    console.log("Creating a new lost item...");
  const url = req.file.path;
  const filename = req.file.filename;
  const newListing=new Item(req.body);
  newListing.owner = req.user._id; 
  newListing.image={url,filename};
  await newListing.save();
  req.flash('success', "Your lost item has been added!")
  res.redirect(`/items`);
  console.log("Lost item submitted successfully!");
  }
 catch (err) {
    console.error("❌ Error in createListing:", err);
    next(err);
  }
}

module.exports.renderEditForm = async (req,res) => {
  const {id}= req.params;
  const listing= await Item.findById(id);
  if(!listing) {
    req.flash('error', "Item does not exist!");
    return res.redirect('/items');
  }
  res.render("items/edit.ejs",{listing})
}

module.exports.updateListing = async (req,res) =>{
  const {id}=req.params;
  const updatedItem = await Item.findByIdAndUpdate(id, {...req.body}, {new: true});
  if(!updatedItem) {
    req.flash('error', "Item does not exist!");
    return res.redirect('/items');
  }
  req.flash('success', "Your item has been updated!")
   res.redirect(`/items/${id}`); // Redirect to the list of items
}

module.exports.destroyListing = async(req, res)=>{
  const {id}=req.params;
  const deletedItem = await Item.findByIdAndDelete(id);
  if(!deletedItem) {
    req.flash('error', "Item does not exist!");
    return res.redirect('/items');
  }
  req.flash('success', "Your item has been deleted!")
  res.redirect(`/items`);
}