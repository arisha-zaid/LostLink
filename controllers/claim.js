const Claim = require("../models/Claim");
const Notification = require("../models/Notification");
const Item = require("../models/Item");

module.exports.addNewClaim = async (req, res) => {
  const itemId = req.params.id;

  const item = await Item.findById(itemId).populate('owner');
  
  if (!item) {
    req.flash("error", "Item not found!");
    return res.redirect('/items');
  }

  const newClaim = new Claim({
    itemId: item._id,
    itemType: item.type, // Use the actual item type instead of hardcoded 'lost'
    message: req.body.message,
    claimant: req.user._id  
  });

  await newClaim.save();

  item.claims.push(newClaim._id);
  await item.save();

  // Create notification for the item owner when a new claim is submitted
  if (item.owner && item.owner._id.toString() !== req.user._id.toString()) {
    try {
      await Notification.create({
        userId: item.owner._id,
        message: `Someone has submitted a claim for your ${item.type} item '${item.title}'.`,
      });
      console.log(` Notification created for item owner: ${item.owner.email || item.owner.name}`);
    } catch (notificationError) {
      console.error(' Failed to create notification:', notificationError);
    }
  } else {
    console.log(' No notification created - either no owner or claimant is the owner');
  }

  req.flash("success", "Your claim has been submitted!");
  res.redirect(`/items/${itemId}`);
}

module.exports.approveClaim  = async (req, res) => {
  const { id, claimid } = req.params;
  const claim = await Claim.findById(claimid).populate('claimant');
  const item = await Item.findById(id).populate('owner');

  if (!claim) {
    req.flash("error", "Claim not found");
    return res.redirect(`/items/${id}`);
  }

  if (!item) {
    req.flash("error", "Item not found");
    return res.redirect(`/items`);
  }

  claim.status = "approved";
  await claim.save();

  // Update item status to claimed
  item.status = "claimed";
  await item.save();

  // Get all other claims for this item to notify rejected claimants
  const otherClaims = await Claim.find({ 
    itemId: claim.itemId, 
    _id: { $ne: claim._id },
    status: 'pending'
  }).populate('claimant');

  // Reject all other claims for this item
  await Claim.updateMany(
    { itemId: claim.itemId, _id: { $ne: claim._id } },
    { $set: { status: "rejected" } }
  );

  // Notify the approved claimant
  try {
    await Notification.create({
      userId: claim.claimant._id,
      message: `🎉 Your claim on item '${item.title}' has been approved!`,
    });
    console.log(`✅ Approval notification sent to: ${claim.claimant.email || claim.claimant.name}`);
  } catch (error) {
    console.error('❌ Failed to create approval notification:', error);
  }

  // Notify all other claimants that their claims were rejected
  for (const otherClaim of otherClaims) {
    if (otherClaim.claimant) {
      try {
        await Notification.create({
          userId: otherClaim.claimant._id,
          message: `❌ Your claim on item '${item.title}' has been rejected because another claim was approved.`,
        });
        console.log(`✅ Rejection notification sent to: ${otherClaim.claimant.email || otherClaim.claimant.name}`);
      } catch (error) {
        console.error('❌ Failed to create rejection notification:', error);
      }
    }
  }

  req.flash("success", "Claim approved!");
  res.redirect(`/items/${id}`);
}

module.exports.destroyClaim = async(req,res) => {
    let {id,claimid}=req.params;
    await Item.findByIdAndUpdate(id, { $pull:{claims :claimid}});
    await Claim.findByIdAndDelete(claimid);
    req.flash("success","Your claim has been deleted!");
    res.redirect(`/items/${id}`);
}

module.exports.rejectClaim = async (req, res) => {
  const { id, claimid } = req.params;
  const claim = await Claim.findById(claimid).populate('claimant');
  const item = await Item.findById(id).populate('owner');

  if (!claim) {
    req.flash("error", "Claim not found");
    return res.redirect(`/items/${id}`);
  }

  if (!item) {
    req.flash("error", "Item not found");
    return res.redirect(`/items`);
  }

  claim.status = "rejected";
  await claim.save();

  // Create notification for rejected claim
  try {
    await Notification.create({
      userId: claim.claimant._id,
      message: `❌ Your claim on item '${item.title}' has been rejected.`,
    });
    console.log(`✅ Rejection notification sent to: ${claim.claimant.email || claim.claimant.name}`);
  } catch (error) {
    console.error('❌ Failed to create rejection notification:', error);
  }

  req.flash("success", "Claim rejected.");
  res.redirect(`/items/${id}`);
}
