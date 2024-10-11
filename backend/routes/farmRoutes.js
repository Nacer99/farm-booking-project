const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check if user is a manager
const isManager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Access denied. Managers only.' });
  }
  next();
};

// Public routes
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const farms = await Farm.find();
    // TODO: Implement logic to filter farms based on availability for the given date
    res.json(farms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farms', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    res.json(farm);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farm', error: error.message });
  }
});

// Protected routes (managers only)
router.post('/', authMiddleware, isManager, async (req, res) => {
  try {
    const newFarm = new Farm({
      ...req.body,
      manager: req.user._id
    });
    await newFarm.save();
    res.status(201).json(newFarm);
  } catch (error) {
    res.status(400).json({ message: 'Error creating farm', error: error.message });
  }
});

router.put('/:id', authMiddleware, isManager, async (req, res) => {
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

router.delete('/:id', authMiddleware, isManager, async (req, res) => {
  try {
    const farm = await Farm.findOneAndDelete({ _id: req.params.id, manager: req.user._id });
    if (!farm) return res.status(404).json({ message: 'Farm not found or you\'re not authorized' });
    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting farm', error: error.message });
  }
});

// New route to get farms managed by the authenticated user
router.get('/my-farms', authMiddleware, isManager, async (req, res) => {
  try {
    const farms = await Farm.find({ manager: req.user._id });
    res.json(farms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your farms', error: error.message });
  }
});

module.exports = router;