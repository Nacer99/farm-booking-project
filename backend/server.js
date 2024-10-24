require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const farmRoutes = require('./routes/farmRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// CORS Configuration - Update with your Netlify URL in production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', 
    'https://farm-booking-project.netlify.app', 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Enable CORS with options
app.use(cors(corsOptions));

// Increase payload size limit if needed
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware with more details
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// MongoDB connection with retries and timeout
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10s
  retryWrites: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB');
  // Log the database name to verify connection
  console.log('Connected to database:', mongoose.connection.db.databaseName);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Add this to monitor MongoDB connection status
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected');
});

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/farms', (req, res, next) => {
  console.log('Farm route accessed:', req.method, req.path);
  next();
}, farmRoutes);

app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Farm Booking API' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Send appropriate error response
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'An error occurred' 
      : err.message,
    error: process.env.NODE_ENV === 'production'
      ? {}
      : {
          details: err.message,
          path: req.path,
          timestamp: new Date()
        }
  });
});

// Start server with error handling
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;