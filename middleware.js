const path = require('path');
const Item = require('./models/Item');

const ExpressError = require('./utils/expressError.js');
const {Itemschema, Claimschema} = require('./schema.js');
const Claim = require('./models/Claim.js');
const Notification = require('./models/Notification');

module.exports.isLoggedIn = (req, res, next) => {
  console.log(path, "..", req.originalUrl); // Logs the entire path the user tried to access

  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Store the original URL in session
    req.flash('error', 'You must be logged in to list an item!');
    return res.redirect("/login");
  }
  next();
};

// After login, passport resets locals, so we transfer session data back to locals
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async(req,res,next)=>{
  const { id } = req.params;
  const item = await Item.findById(id);
  if(!item.owner.equals(req.user._id)){
    req.flash("error","You do not have permission to do that!");
    return res.redirect(`/items/${id}`)
  }
  next();
}

module.exports.validateItem = (req,res,next)=>{
  let {error} = Itemschema.validate(req.body);
  if(error){
    let errmsg = error.details.map(el=>el.message).join(', ');
    throw new ExpressError(400,errmsg);
  }
  else{
    next();
  }
}

module.exports.validateClaim = (req,res,next)=>{
  let {error} = Claimschema.validate(req.body);
  if(error){
    let errmsg = error.details.map(el=>el.message).join(', ');
    throw new ExpressError(400,errmsg);
  }
  else{
    next();
  }
}

module.exports.isClaimOwner = async (req, res, next) => {
  const { id, claimid } = req.params; // match route param
  const claim = await Claim.findById(claimid);

  if (!claim) {
    req.flash("error", "Claim not found!");
    return res.redirect(`/items/${id}`);
  }

  if (!claim.claimant || !claim.claimant.equals(req.user._id)) {
    req.flash("error", "You are not the claimant of this claim!");
    return res.redirect(`/items/${id}`);
  }

  next();
};


module.exports.checkNotifications = async (req, res, next) => {
  try {
    if (req.user) {
      const unread = await Notification.find({ userId: req.user._id, read: false });

      if (unread.length > 0) {
        req.flash("success", `🔔 You have ${unread.length} new notification(s)`);
      }

      // Make notifications available to views
      res.locals.unreadNotifications = unread;
    }
    next();
  } catch (err) {
    console.error("Notification check error:", err);
    next(); // continue even if error occurs
  }
};


module.exports.isAdmin = async (req, res, next) =>{
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  req.flash('error', 'Access denied. Only admins can perform this action.');
  res.redirect('/');
}