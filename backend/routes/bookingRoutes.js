const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { sendConfirmationEmail } = require('../utils/emailService');
// const authMiddleware = require('../middleware/authMiddleware'); // Comment out the import if not needed

// Public route - Create a booking
router.post('/', async (req, res) => {
  try {
    const { farmId, date, meals, totalAmount } = req.body;
    const newBooking = new Booking({
      farm: farmId,
      date,
      meals,
      totalAmount,
      status: 'pending'
    });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking', error: error.message });
  }
});

// Protected route - Confirm a booking
router.post('/confirm', /* authMiddleware, */ async (req, res) => { // Comment out authMiddleware
  try {
    const { bookingId, clientEmail } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'confirmed', clientEmail },
      { new: true }
    ).populate('farm');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    await sendConfirmationEmail(clientEmail, booking);
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Error confirming booking', error: error.message });
  }
});

// New protected route - Get all bookings (for managers)
router.get('/', /* authMiddleware, */ async (req, res) => { // Comment out authMiddleware
  try {
    // Temporarily allow all requests to proceed
    // if (req.user.role !== 'manager') {
    //   return res.status(403).json({ message: 'Access denied. Managers only.' });
    // }
    const bookings = await Booking.find().populate('farm');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// New protected route - Get user's bookings
router.get('/my-bookings', /* authMiddleware, */ async (req, res) => { // Comment out authMiddleware
  try {
    // Temporarily allow fetching all bookings for testing
    // const bookings = await Booking.find({ clientEmail: req.user.email }).populate('farm');
    const bookings = await Booking.find().populate('farm'); // Allow fetching all bookings for testing
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
  }
});

module.exports = router;