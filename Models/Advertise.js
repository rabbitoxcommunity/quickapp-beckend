const mongoose = require('mongoose');

const AdvertiseSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
      },
      number: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      description: {
        type: String
      }
});

module.exports = mongoose.model('Advertise', AdvertiseSchema);