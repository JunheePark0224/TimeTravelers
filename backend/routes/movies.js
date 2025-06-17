// routes/movies.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;

    // 날짜 기반 30일 범위 계산
    const inputDate = new Date(date);
    const from = new Date(inputDate);
    const to = new Date(inputDate);
    from.setDate(from.getDate() - 15);
    to.setDate(to.getDate() + 15);

    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];

    const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        sort_by: 'popularity.desc',
        'primary_release_date.gte': fromStr,
        'primary_release_date.lte': toStr,
        language: 'en-US',
        page: 1
      }
    });

    const topMovies = response.data.results.slice(0, 3).map(movie => ({
      title: movie.title,
      overview: movie.overview,
      release_date: movie.release_date,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
    }));

    res.json({ date, movies: topMovies });

  } catch (error) {
    console.error('TMDB fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
});

module.exports = router;
