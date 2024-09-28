const mongoose = require('mongoose');

const AdBannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  type: { type: String, default: 'ad' },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  url: { type: String, required: true },
  position: { type: Number, unique: true }
});

module.exports = mongoose.model('AdBanner', AdBannerSchema);