
const mongoose = require('mongoose');

const CategoryRequestSchema = new mongoose.Schema({
    category_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  }
});

module.exports = mongoose.model('CategoryRequest', CategoryRequestSchema);