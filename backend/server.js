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
  origin: (origin, callback) => {
    console.log('Incoming origin:', origin); // Log the incoming origin
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000'
    ];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Enable preflight for all routes
app.options('*', cors(corsOptions)); // This line ensures preflight requests are handled

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
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});