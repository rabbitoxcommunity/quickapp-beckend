const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, 
  location: { type: String, required: true },
  image: { type: String },
  category: { type: String, required: true },
  title: { type: String, required: true },
  tags: [{ type: String }],
  viewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  bidAmount: { type: String },
  amountTitle: { type: String },
  contactNumber: { type: String, required: true },
  isWhatsapp: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', BidSchema);