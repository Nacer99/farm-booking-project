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
  photos: { type: [String], required: true },
  meals: [mealSchema],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    default: '507f1f77bcf86cd799439011' // Temporary default ObjectId for testing
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Add some helper methods for validation
farmSchema.statics.createTestFarm = async function(farmData) {
  const farm = new this({
    ...farmData,
    manager: '507f1f77bcf86cd799439011' // Use the same testing ObjectId
  });
  return farm.save();
};

module.exports = mongoose.model('Farm', farmSchema);