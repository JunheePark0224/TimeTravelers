// routes/timeData.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Weather API 함수
const fetchWeatherData = async (date, latitude, longitude, timezone, cityName) => {
  try {
    const response = await axios.get('https://archive-api.open-meteo.com/v1/archive', {
      params: {
        latitude: latitude,
        longitude: longitude,
        start_date: date,
        end_date: date,
        daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum',
        timezone: timezone
      },
      timeout: 10000 // 10초 타임아웃
    });

    const daily = response.data.daily;
    return {
      city: cityName,
      tempMax: daily?.temperature_2m_max?.[0] || null,
      tempMin: daily?.temperature_2m_min?.[0] || null,
      weatherCode: daily?.weathercode?.[0] || 0,
      precipitation: daily?.precipitation_sum?.[0] || 0,
      status: 'success'
    };
  } catch (error) {
    console.error(`Weather API Error for ${cityName}:`, error.message);
    return {
      city: cityName,
      tempMax: null,
      tempMin: null,
      weatherCode: 0,
      precipitation: 0,
      status: 'error',
      error: error.message
    };
  }
};

// News API 함수 (추후 구현)
const fetchNewsData = async (date) => {
  try {
    // TODO: 실제 News API 통합
    // 현재는 더미 데이터 반환
    return {
      headlines: [
        {
          title: `Major events from ${date}`,
          description: "Historical news data will be integrated here",
          source: "News API",
          publishedAt: date
        }
      ],
      status: 'placeholder'
    };
  } catch (error) {
    console.error('News API Error:', error.message);
    return {
      headlines: [],
      status: 'error',
      error: error.message
    };
  }
};

// Music API 함수 (추후 구현)
const fetchMusicData = async (date) => {
  try {
    // TODO: Last.fm API 또는 Spotify API 통합
    return {
      topSongs: [
        {
          title: "Popular song from this era",
          artist: "Famous Artist",
          rank: 1
        }
      ],
      status: 'placeholder'
    };
  } catch (error) {
    console.error('Music API Error:', error.message);
    return {
      topSongs: [],
      status: 'error',
      error: error.message
    };
  }
};

// Movie API 함수 (추후 구현)
const fetchMovieData = async (date) => {
  try {
    // TODO: TMDb API 통합
    return {
      popularMovies: [
        {
          title: "Popular movie from this time",
          overview: "Movie data will be integrated here",
          releaseDate: date
        }
      ],
      status: 'placeholder'
    };
  } catch (error) {
    console.error('Movie API Error:', error.message);
    return {
      popularMovies: [],
      status: 'error',
      error: error.message
    };
  }
};

// 날짜 검증 함수
const validateDate = (dateString) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return { valid: false, message: 'Invalid date format. Use YYYY-MM-DD' };
  }

  const inputDate = new Date(dateString);
  const minDate = new Date('1940-01-01');
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - 1); // 어제까지만

  if (inputDate < minDate || inputDate > maxDate) {
    return { 
      valid: false, 
      message: 'Date must be between 1940-01-01 and yesterday' 
    };
  }

  return { valid: true };
};

// 메인 라우트: 특정 날짜의 모든 데이터 가져오기
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // 날짜 검증
    const validation = validateDate(date);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    console.log(`🕰️ Fetching time data for date: ${date}`);
    
    // 병렬로 모든 API 호출
    const startTime = Date.now();
    
    const [seoulWeather, newYorkWeather, londonWeather, news, music, movies] = await Promise.all([
      fetchWeatherData(date, 37.5665, 126.978, 'Asia/Seoul', 'Seoul'),
      fetchWeatherData(date, 40.7128, -74.006, 'America/New_York', 'New York'),
      fetchWeatherData(date, 51.5074, -0.1278, 'Europe/London', 'London'),
      fetchNewsData(date),
      fetchMusicData(date),
      fetchMovieData(date)
    ]);

    const responseTime = Date.now() - startTime;

    // 응답 데이터 구성
    const responseData = {
      success: true,
      date: date,
      data: {
        weather: {
          seoul: seoulWeather,
          newYork: newYorkWeather,
          london: londonWeather
        },
        news: news,
        music: music,
        movies: movies
      },
      meta: {
        generatedAt: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        dataSource: 'TimeTravelers API v1.0'
      }
    };

    console.log(`✅ Time data fetched successfully in ${responseTime}ms`);
    res.json(responseData);
    
  } catch (error) {
    console.error('❌ Time data API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch time data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// 날씨만 가져오는 별도 라우트
router.get('/:date/weather', async (req, res) => {
  try {
    const { date } = req.params;
    const { cities } = req.query; // ?cities=seoul,newYork,london
    
    const validation = validateDate(date);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // 도시 선택 (기본값: 모든 도시)
    const cityList = cities ? cities.split(',') : ['seoul', 'newYork', 'london'];
    
    const cityData = {
      seoul: { lat: 37.5665, lon: 126.978, tz: 'Asia/Seoul', name: 'Seoul' },
      newYork: { lat: 40.7128, lon: -74.006, tz: 'America/New_York', name: 'New York' },
      london: { lat: 51.5074, lon: -0.1278, tz: 'Europe/London', name: 'London' }
    };

    const weatherPromises = cityList
      .filter(city => cityData[city])
      .map(city => {
        const { lat, lon, tz, name } = cityData[city];
        return fetchWeatherData(date, lat, lon, tz, name);
      });

    const weatherResults = await Promise.all(weatherPromises);
    
    const weatherData = {};
    weatherResults.forEach(result => {
      const cityKey = result.city.toLowerCase().replace(' ', '');
      weatherData[cityKey] = result;
    });

    res.json({
      success: true,
      date: date,
      weather: weatherData,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// API 상태 확인 라우트
router.get('/status/health', (req, res) => {
  res.json({
    success: true,
    message: 'Time Data API is healthy',
    endpoints: [
      'GET /:date - Get all time data for a specific date',
      'GET /:date/weather - Get weather data only',
      'GET /status/health - This health check'
    ],
    supportedDateRange: '1940-01-01 to yesterday',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;