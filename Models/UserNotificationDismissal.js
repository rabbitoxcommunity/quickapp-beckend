// models/UserNotificationDismissal.js
const mongoose = require('mongoose');

const UserNotificationDismissalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' },
  dismissedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserNotificationDismissal', UserNotificationDismissalSchema);