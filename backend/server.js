require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const farmRoutes = require('./routes/farmRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: '*', // Temporarily allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true, // Allow credentials (if needed)
};

// Enable CORS for all routes
app.use(cors(corsOptions)); // Use CORS middleware with options
app.use(express.json()); // Middleware to parse JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/farms', farmRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);

// Optional: Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Farm Booking API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err); // Log the error details
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});