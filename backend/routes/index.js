// routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const capsuleRoutes = require('./capsules');

// Use routes
router.use('/auth', authRoutes);
router.use('/capsules', capsuleRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TimeTravelers API is running!',
    timestamp: new Date().toISOString(),
    user: req.user ? req.user.email : 'Not logged in'
  });
});

module.exports = router;