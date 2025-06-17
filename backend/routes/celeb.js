const express = require('express');
const router = express.Router();
const axios = require('axios');

// byabbe.se API 사용 
router.get('/:month/:day', async (req, res) => {
  const { month, day } = req.params;

  try {
    const url = `https://byabbe.se/on-this-day/${month}/${day}/births.json`;
    const deathUrl = `https://byabbe.se/on-this-day/${month}/${day}/deaths.json`;

    const [birthRes, deathRes] = await Promise.all([
      axios.get(url),
      axios.get(deathUrl),
    ]);

    const born = birthRes.data.births.slice(0, 2).map(p => ({
      name: p.description,
      year: p.year,
      wikipedia: p.wikipedia[0]?.wikipedia || ''
    }));

    const died = deathRes.data.deaths.slice(0, 2).map(p => ({
      name: p.description,
      year: p.year,
      wikipedia: p.wikipedia[0]?.wikipedia || ''
    }));

    res.json({ born, died });
  } catch (error) {
    console.error('Celeb API error:', error.message);
    res.status(500).json({ message: 'Failed to fetch celeb data' });
  }
});

module.exports = router;
