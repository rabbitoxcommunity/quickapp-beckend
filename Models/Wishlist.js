const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlist = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bids: [{
    type: Schema.Types.ObjectId,
    ref: 'Bid'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlist);
