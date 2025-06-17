const express = require('express');
const router = express.Router();
const axios = require('axios');

const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;

// 예: /api/news/2004-06-12
router.get('/:date', async (req, res) => {
  const { date } = req.params;

  try {
    const response = await axios.get('https://content.guardianapis.com/search', {
      params: {
        'from-date': date,
        'to-date': date,
        'order-by': 'relevance', // 또는 newest
        'show-fields': 'headline,trailText',
        'page-size': 6,
        'api-key': GUARDIAN_API_KEY
      }
    });

    const articles = response.data.response.results.slice(0, 6).map(article => ({
      title: article.webTitle,
      summary: article.fields?.trailText || '',
      url: article.webUrl
    }));

    res.json({ date, articles });

  } catch (err) {
    console.error('📰 Guardian API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
});

module.exports = router;
