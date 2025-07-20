const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        sparse: true // Allows null values for Google-authenticated users
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
  type: String,
  select: false,
  sparse: true
},

    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null values for locally-authenticated users
    },
    name: String, // Display name (from Google or local registration)
    phone: Number,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profileImage: String // To store Google profile picture
});

// Add Passport Local Mongoose plugin
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email', // Use email as the username field
    usernameLowerCase: true // Convert email to lowercase
});

module.exports = mongoose.model("User", userSchema);