const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  availability: Number,
});

const farmSchema = new mongoose.Schema({
  name: String,
  description: String,
  photo: String,
  meals: [mealSchema],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model('Farm', farmSchema);