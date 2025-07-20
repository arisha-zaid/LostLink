const express = require('express');
const router = express.Router();
const wrapasync = require('../utils/wrapasync.js');
const User = require("../models/User");
const passport = require("passport"); 
const { saveRedirectUrl, isLoggedIn } = require('../middleware.js');
const userController = require('../controllers/user.js');


router
   .route("/signup") 
   .get( userController.renderSignupForm)// Local Authentication Routes (Unchanged)
   .post( wrapasync(userController.signupUser));


router
   .route("/login")
   .get( userController.renderLoginForm)
   .post(saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true
  }),
  wrapasync(userController.loginUser));



// Google OAuth Routes (Updated for consistency)
router.get('/login/federated/google', 
  passport.authenticate('google', 
    { scope: ['profile', 'email'],
      prompt: 'select_account' // forces account chooser
     })
);

router.get('/oauth2/redirect/google', 
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureFlash: 'Failed to authenticate with Google'
  }),
  (req, res) => {
    req.flash('success', 'Successfully logged in with Google!');
    res.redirect('/items');
  }
);

// Logout (Unchanged)
router.get('/logout', userController.logoutUser);

router.get('/profile', 
   isLoggedIn,
   userController.renderProfilePage);

module.exports = router;