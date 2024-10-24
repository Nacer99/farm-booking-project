const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const mongoose = require('mongoose');

// Add logging middleware
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  next();
};

router.use(logRequest);

// Get available farms
router.get('/available', async (req, res) => {
  try {
    console.log('Fetching available farms');
    const farms = await Farm.find({})
      .select('-__v') // Exclude version key
      .exec();
    console.log(`Found ${farms.length} farms`);
    res.json(farms);
  } catch (error) {
    console.error('Error fetching available farms:', error);
    res.status(500).json({ message: 'Error fetching farms', error: error.message });
  }
});

// Get manager farms
router.get('/manager', async (req, res) => {
  try {
    console.log('Fetching farms for testing manager');
    const farms = await Farm.find({
      manager: '507f1f77bcf86cd799439011' // Use the testing ObjectId
    }).exec();
    console.log(`Found ${farms.length} farms for manager`);
    res.json(farms);
  } catch (error) {
    console.error('Error fetching manager farms:', error);
    res.status(500).json({ message: 'Error fetching manager farms', error: error.message });
  }
});

// Create new farm
router.post('/', async (req, res) => {
  try {
    console.log('Creating new farm with data:', req.body);
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'photos'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        fields: missingFields 
      });
    }

    // Use the createTestFarm method
    const newFarm = await Farm.createTestFarm({
      name: req.body.name,
      description: req.body.description,
      photos: req.body.photos,
      meals: req.body.meals || []
    });

    console.log('Farm created successfully:', newFarm._id);
    res.status(201).json(newFarm);
  } catch (error) {
    console.error('Error creating farm:', error);
    res.status(400).json({ 
      message: 'Error creating farm', 
      error: error.message,
      details: error
    });
  }
});

// Get specific farm
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid farm ID format' });
    }
    
    const farm = await Farm.findById(req.params.id).exec();
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    res.json(farm);
  } catch (error) {
    console.error('Error fetching specific farm:', error);
    res.status(500).json({ message: 'Error fetching farm', error: error.message });
  }
});

// Update farm
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid farm ID format' });
    }

    const farm = await Farm.findByIdAndUpdate(
      req.params.id,
      { ...req.body, manager: '507f1f77bcf86cd799439011' }, // Keep the testing manager ID
      { new: true, runValidators: true }
    ).exec();
    
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    res.json(farm);
  } catch (error) {
    console.error('Error updating farm:', error);
    res.status(400).json({ message: 'Error updating farm', error: error.message });
  }
});

// Delete farm
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid farm ID format' });
    }

    const farm = await Farm.findByIdAndDelete(req.params.id).exec();
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    console.error('Error deleting farm:', error);
    res.status(400).json({ message: 'Error deleting farm', error: error.message });
  }
});

module.exports = router;