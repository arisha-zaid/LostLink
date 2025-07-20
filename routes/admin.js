const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const {isAdmin} = require('../middleware.js');
const User = require('../models/User');
const Item = require('../models/Item');


router.get('/dashboard', isAdmin, async (req, res) => {
  const claims = await Claim.find()
     .populate('claimant') 
    .sort({ createdAt: -1 });
  res.render('admin/dashboard', { claims });
});

router.post('/approve/:id', isAdmin, async (req, res) => {
  await Claim.findByIdAndUpdate(req.params.id, { status: 'approved' });
  res.redirect('/admin/dashboard');
});

router.post('/reject/:id', isAdmin, async (req, res) => {
  await Claim.findByIdAndUpdate(req.params.id, { status: 'rejected' });
  res.redirect('/admin/dashboard');
});


router.get('/users', isAdmin, async (req, res) => {
  const users = await User.find({ role: 'user' }).lean(); // don’t show admins

   // For each user, fetch their LostItems
  for (let user of users) {
    const lostItems = await Item.find({ owner: user._id , type: 'lost'}).lean();
    user.lostItems = lostItems;
  }

  res.render('admin/users', { users });
});

router.post('/lostitems/delete/:id', isAdmin, async (req, res) => {
  await LostItem.findByIdAndDelete(req.params.id);
  res.redirect('/admin/users');
});


router.post('/users/delete/:id', isAdmin, async (req, res) => {
  const userId = req.params.id;

  // delete user's claims or items too
  await User.findByIdAndDelete(userId);
  res.redirect('/admin/users');
});


module.exports = router;