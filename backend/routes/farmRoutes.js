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
    newFarm.manager = req.user.userId;
    await newFarm.save();
    res.status(201).json(newFarm);
  } catch (error) {
    res.status(400).json({ message: 'Error creating farm', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, manager: req.user.userId },
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
    const farm = await Farm.findOneAndDelete({ _id: req.params.id, manager: req.user.userId });
    if (!farm) return res.status(404).json({ message: 'Farm not found or you\'re not authorized' });
    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting farm', error: error.message });
  }
});

module.exports = router;