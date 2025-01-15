const mongoose = require('mongoose');

const VersionSchema = new mongoose.Schema({
  version: { type: String, required: true }, // e.g., "2.0.0"
  updateRequired: { type: Boolean, default: false }, // Force update
  androidUrl: { type: String, required: true },
  iosUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Version', VersionSchema);
