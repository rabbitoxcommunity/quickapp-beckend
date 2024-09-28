const mongoose = require('mongoose');

const FeedBack = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      number: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
});

module.exports = mongoose.model('Feedback', FeedBack);