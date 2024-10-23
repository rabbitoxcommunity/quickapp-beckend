const mongoose = require('mongoose');

const AdPrivacySchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
});

module.exports = mongoose.model('Privacy', AdPrivacySchema);