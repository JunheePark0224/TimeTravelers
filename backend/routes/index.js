// routes/index.js
// This is the root router for the API. Each sub-route will be attached here.

const express = require('express');
const router = express.Router();

// Test route for verification
router.get('/test', (req, res) => {
  res.send('API is working!');
});

module.exports = router;
