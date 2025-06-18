// routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const capsuleRoutes = require('./capsules');
const timeDataRoutes = require('./timeData'); 

// Use routes
router.use('/auth', authRoutes);
router.use('/capsules', capsuleRoutes);
router.use('/time-data', timeDataRoutes); 

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TimeTravelers API is running!',
    timestamp: new Date().toISOString(),
    user: req.user ? req.user.email : 'Not logged in',
    availableEndpoints: {
      auth: '/api/auth/*',
      capsules: '/api/capsules/*',
      timeData: '/api/time-data/*', 
      health: '/api/health'
    }
  });
});

module.exports = router;