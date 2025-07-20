if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// MongoDB connection will be handled in main() function
const express = require('express');
const app = express();
const port = 8080;

const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const path = require("path");
const multer = require('multer');
const methodOverride = require('method-override');
const wrapasync = require('./utils/wrapasync.js');
const ExpressError = require('./utils/expressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Replaced SQLite with MongoDB session store

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");
const { checkNotifications } = require('./middleware.js');
const GoogleStrategy = require('passport-google-oidc').Strategy;
var logger = require('morgan');

// Routers 
const itemRouter = require('./routes/items.js');
const claimRouter = require('./routes/claims.js');
const userRouter = require('./routes/user.js');
const emailRoutes = require('./routes/mailer.js');
const notificationRouter = require('./routes/notify.js');
const adminRoutes = require('./routes/admin.js');


// DB Connection
main()
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.error("MongoDB Connection Error:", err));

async function main() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URL, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority'
    });
    console.log(' Connected to MongoDB Atlas successfully!');
  } catch (error) {
    console.error(' MongoDB Atlas connection failed:', error.message);
    
    // Fallback to local MongoDB if Atlas fails
    console.log(' Attempting to connect to local MongoDB...');
    try {
      await mongoose.connect(process.env.MONGO_URL_LOCAL || 'mongodb://127.0.0.1:27017/LostLink');
      console.log('Connected to local MongoDB successfully!');
    } catch (localError) {
      console.error('Local MongoDB connection also failed:', localError.message);
      console.log('   Please either:');
      console.log('   1. Add your IP to MongoDB Atlas whitelist, or');
      console.log('   2. Install and start MongoDB locally');
      throw new Error('Both Atlas and local MongoDB connections failed');
    }
  }
}

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

// Session setup

app.use((req, res, next) => {
  res.locals.searchQuery = '';
  next();
});

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600,
  ttl: 14 * 24 * 60 * 60 // 14 days expiration
});

store.on("error", (err) => {
  console.log("Error in mongo session store:", err);
});

// Session configuration (using MongoDB instead of SQLite)
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionOptions));

// Passport setup
// Authentication Setup
app.use(passport.initialize());
app.use(passport.session());

// 1. Local Strategy (unchanged)
passport.use(new LocalStrategy(User.authenticate()));

// Add this check before initializing the strategy
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing Google OAuth credentials!');
}

//google strategy 
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

// Serialization (works for both strategies)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash and user context
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

// Notification middleware
app.use(checkNotifications);

// Routes
app.get('/', (req, res) => res.render('home.ejs'));
app.use('/items', itemRouter);
app.use('/items/:id/claim', claimRouter);
app.use('/', userRouter);
app.use('/', notificationRouter);
app.use("/",emailRoutes);
app.use('/admin', adminRoutes);



app.get('/help', (req, res) => res.render('help.ejs'));
app.get('/error', (req, res) => res.render('error/404.ejs'));

// Error handling
app.use((req, res, next) => next(new ExpressError(404, "Page Not Found")));

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  console.error('Error:', err);
  res.status(statusCode).render('error/404.ejs', { message });
});

app.listen(port, () => console.log(`Server running on port ${port}`));