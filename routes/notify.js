// Import express and initialize the router
const express = require('express');
const router = express.Router();

// Import middleware
const { checkNotifications, isLoggedIn } = require('../middleware.js');

// Import Mongoose Notification model
const Notification = require("../models/Notification");

// Utility to wrap async functions and handle errors
const wrapasync = require('../utils/wrapasync.js');

const notificationController = require('../controllers/notify');

// -------------------------------------------------------
// ✅ GET: Show all notifications for a logged-in user
// -------------------------------------------------------
router.get('/notifications',
    isLoggedIn,             // Ensure user is logged in
    checkNotifications,     // Optional: Sets unread count in flash/res.locals
    wrapasync(notificationController.showNotifications));


// -------------------------------------------------------
// ✅ POST: Mark all notifications as read
// -------------------------------------------------------
router.post('/notifications/mark-all-read',
    isLoggedIn,
    wrapasync(notificationController.markAllAsRead));


// -------------------------------------------------------
// ✅ POST: Mark a single notification as read
// -------------------------------------------------------
router.post('/notifications/:notificationId/read',
    isLoggedIn,
    wrapasync(notificationController.markSingleAsRead));


// Export the router so it can be used in app.js
module.exports = router;
