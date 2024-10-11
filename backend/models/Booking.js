const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  },
  date: Date,
  meals: [{
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm.meals'
    },
    quantity: Number
  }],
  totalAmount: Number,
  clientEmail: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
});

module.exports = mongoose.model('Booking', bookingSchema);