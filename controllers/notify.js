// Import Mongoose Notification model
const Notification = require("../models/Notification");

module.exports.showNotifications = async (req, res) => {
        // Fetch notifications of the logged-in user, most recent first
        const notifications = await Notification
            .find({ userId: req.user._id })
            .sort('-createdAt');

        // Render the notifications view
        res.render('items/notification.ejs', { notifications });
    }

module.exports.markAllAsRead = async (req, res) => {
        // Update all unread notifications of this user to `read: true`
        await Notification.updateMany(
            { userId: req.user._id, read: false },
            { $set: { read: true } }
        );

        // Show a success flash message
        req.flash('success', 'All notifications marked as read!');

        // Redirect back to notifications page
        res.redirect('/notifications');
    }

module.exports.markSingleAsRead= async (req, res) => {
        const { notificationId } = req.params;

        // Update the specific notification's read status
        await Notification.findByIdAndUpdate(notificationId, { read: true });

        req.flash('success', 'Notification marked as read!');
        res.redirect('/notifications');
    }