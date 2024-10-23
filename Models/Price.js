const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Price', PriceSchema);