const mongoose = require('mongoose');

const AdTermsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
});

module.exports = mongoose.model('Terms', AdTermsSchema);