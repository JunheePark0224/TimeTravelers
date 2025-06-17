// backend/routes/music.js

const express = require('express');
const router = express.Router();
const axios = require('axios');

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

router.get('/:date', async (req, res) => {
  const { date } = req.params;

  try {
    // 연도만 추출 (YYYY-MM-DD → YYYY)
    const year = date.split('-')[0];

    // Last.fm은 날짜별 API가 없으므로 chart 기준으로 인기곡 받아오기
    const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'chart.gettoptracks',
        api_key: LASTFM_API_KEY,
        format: 'json'
      }
    });

    // 상위 5~10곡만 잘라서 구성
    const topTracks = response.data.tracks.track.slice(0, 10).map(track => ({
      title: track.name,
      artist: track.artist.name,
      image: track.image?.[2]?.['#text'] || null  // medium 사이즈 앨범 커버
    }));

    res.json({ date, topTracks });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch music data' });
  }
});

module.exports = router;
