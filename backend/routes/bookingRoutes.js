const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { sendConfirmationEmail } = require('../utils/emailService');

router.post('/', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    await sendConfirmationEmail(newBooking.client.email, newBooking);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking', error: error.message });
  }
});

module.exports = router;