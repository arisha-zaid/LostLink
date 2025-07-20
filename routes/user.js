const express = require('express');
const router = express.Router();
const wrapasync = require('../utils/wrapasync.js');
const User = require("../models/User");
const passport = require("passport"); 
const { saveRedirectUrl, isLoggedIn } = require('../middleware.js');
const GoogleStrategy = require('passport-google-oidc').Strategy;
const userController = require('../controllers/user.js');


// Google Strategy Configuration (Updated for MongoDB)
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: 'http://localhost:8080/oauth2/redirect/google',
  scope: ['profile', 'email']
}, async (issuer, profile, done) => {
  try {
    // Case-insensitive email search
    const email = profile.emails[0].value.toLowerCase();
      
    // Find user by Google ID or email
    let user = await User.findOne({
      $or: [
        { googleId: profile.id },
        { email: email },
      ]
    });

    if (!user) {

       // Assign a unique username to Google users only
      const baseUsername = email.split('@')[0]; // e.g., 'arisha'
      let username = baseUsername;
      let count = 1;

      // Avoid duplicate usernames
      while (await User.findOne({ username })) {
        username = `${baseUsername}${count++}`; // arisha1, arisha2...
      }
      // Create new user
      user = new User({
        googleId: profile.id,
        email: email,
        // username: email.split('@')[0], // auto-generate username
        name: profile.displayName,
        username, //  username set only for Google users
        verified: true // Mark Google-authenticated users as verified
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google to existing local account
      user.googleId = profile.id;

       // Optional: Only assign username if missing
      if (!user.username) {
        const baseUsername = email.split('@')[0];
        let username = baseUsername;
        let count = 1;

        while (await User.findOne({ username })) {
          username = `${baseUsername}${count++}`;
        }

        user.username = username;
      }

      await user.save();
    }
    return done(null, user);
  } catch (err) {
    console.error('Google auth error:', err);
    return done(err);
  }
}));

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