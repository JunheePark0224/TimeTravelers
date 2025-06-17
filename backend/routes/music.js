// backend/routes/music.js

const express = require('express');
const router = express.Router();
const axios = require('axios');

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

router.get('/:date', async (req, res) => {
  const { date } = req.params;
  const year = date.split('-')[0];

  try {
    // 연도 기반 tag 사용 (예: 1995년 → tag=1995)
    const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'tag.gettoptracks',
        tag: year, // 여기서 연도 기반
        api_key: LASTFM_API_KEY,
        format: 'json'
      }
    });

    const topTracks = response.data.tracks.track.slice(0, 3).map(track => ({
      title: track.name,
      artist: track.artist.name,
    }));

    res.json({ date, topTracks });

  } catch (error) {
    console.error('🎵 Music API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch music data' });
  }
});

module.exports = router;
