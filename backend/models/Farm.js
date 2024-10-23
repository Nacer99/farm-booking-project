const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: Number, required: true },
});

const farmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  photos: { type: [String], required: true }, // Changed to an array for multiple photos
  meals: [mealSchema],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Assuming a manager is required
  },
});

module.exports = mongoose.model('Farm', farmSchema);