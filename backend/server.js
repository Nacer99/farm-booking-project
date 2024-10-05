// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const farmRoutes = require('./routes/farmRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/farms', farmRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// models/Farm.js
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  availability: Number,
});

const farmSchema = new mongoose.Schema({
  name: String,
  description: String,
  photos: [String],
  menus: [menuSchema],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model('Farm', farmSchema);

// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  },
  client: {
    name: String,
    email: String,
  },
  date: Date,
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm.menus'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
});

module.exports = mongoose.model('Booking', bookingSchema);

// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['client', 'manager'],
    default: 'client'
  },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

// routes/farmRoutes.js
const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const farms = await Farm.find();
    // In a real application, you'd implement logic to filter farms based on availability for the given date
    res.json(farms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farms', error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const newFarm = new Farm(req.body);
    newFarm.manager = req.user._id;
    await newFarm.save();
    res.status(201).json(newFarm);
  } catch (error) {
    res.status(400).json({ message: 'Error creating farm', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, manager: req.user._id },
      req.body,
      { new: true }
    );
    if (!farm) return res.status(404).json({ message: 'Farm not found or you\'re not authorized' });
    res.json(farm);
  } catch (error) {
    res.status(400).json({ message: 'Error updating farm', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const farm = await Farm.findOneAndDelete({ _id: req.params.id, manager: req.user._id });
    if (!farm) return res.status(404).json({ message: 'Farm not found or you\'re not authorized' });
    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting farm', error: error.message });
  }
});

module.exports = router;

// routes/bookingRoutes.js
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

// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = new User({ email, password, role });
    await user.save();
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, userId: user._id, role: user.role });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;

// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendConfirmationEmail = async (email, booking) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Booking Confirmation',
      text: `Your booking for ${booking.farm.name} on ${booking.date} has been confirmed.`,
      html: `<p>Your booking for <strong>${booking.farm.name}</strong> on <strong>${booking.date}</strong> has been confirmed.</p>`
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};