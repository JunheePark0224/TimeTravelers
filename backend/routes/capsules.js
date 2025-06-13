// routes/capsules.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/db');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Get all capsules for logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM capsules WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      capsules: rows
    });

  } catch (error) {
    console.error('Get capsules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch capsules'
    });
  }
});

// Create new capsule
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { selected_date, historical_data, title, is_public = false } = req.body;

    if (!selected_date) {
      return res.status(400).json({
        success: false,
        message: 'Selected date is required'
      });
    }

    const share_token = uuidv4();

    const [result] = await pool.execute(
      'INSERT INTO capsules (user_id, selected_date, historical_data, share_token, title, is_public) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, selected_date, JSON.stringify(historical_data), share_token, title, is_public]
    );

    // Get the created capsule
    const [capsules] = await pool.execute(
      'SELECT * FROM capsules WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Capsule created successfully',
      capsule: capsules[0]
    });

  } catch (error) {
    console.error('Create capsule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create capsule'
    });
  }
});

// Get capsule by share token (public access)
router.get('/share/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const [rows] = await pool.execute(
      `SELECT c.*, u.name as user_name 
       FROM capsules c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.share_token = ?`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Capsule not found'
      });
    }

    const capsule = rows[0];
    
    // Parse historical_data if it's a string
    if (typeof capsule.historical_data === 'string') {
      capsule.historical_data = JSON.parse(capsule.historical_data);
    }

    res.json({
      success: true,
      capsule
    });

  } catch (error) {
    console.error('Get shared capsule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch capsule'
    });
  }
});

// Delete capsule
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if capsule belongs to user
    const [capsules] = await pool.execute(
      'SELECT * FROM capsules WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (capsules.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Capsule not found or access denied'
      });
    }

    await pool.execute(
      'DELETE FROM capsules WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    res.json({
      success: true,
      message: 'Capsule deleted successfully'
    });

  } catch (error) {
    console.error('Delete capsule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete capsule'
    });
  }
});

module.exports = router;