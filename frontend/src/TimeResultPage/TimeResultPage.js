import { fetchTopTracks } from '../api/music';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './TimeResultPage.css';
import { fetchCelebrityData } from '../api/celeb';

const TimeResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const selectedDate = location.state?.selectedDate || "1995-03-15";
  const isLoggedIn = isAuthenticated;

  // 🔥 MyPage에서 온 캡슐 데이터 확인
  const fromMyPage = location.state?.fromMyPage || false;
  const savedCapsuleData = location.state?.capsuleData || null;

  // API 상태 관리
  const [priceData, setPriceData] = useState(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const [priceError, setPriceError] = useState(null);

  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  const [musicTracks, setMusicTracks] = useState([]);
  const [musicLoading, setMusicLoading] = useState(true);
  const [musicError, setMusicError] = useState(null);

  const [newsArticles, setNewsArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);

  const [movieList, setMovieList] = useState([]);
  const [movieLoading, setMovieLoading] = useState(true);
  const [movieError, setMovieError] = useState(null);

  const [celebData, setCelebData] = useState(null);
  const [celebLoading, setCelebLoading] = useState(true);
  const [celebError, setCelebError] = useState(null);


  const [isSaving, setIsSaving] = useState(false);

  // 날짜 포맷 변환 함수
  const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Celeb API 호출 함수
  const fetchCelebData = async () => {
    try {
      setCelebLoading(true);
      setCelebError(null);

      const dateObj = new Date(selectedDate);
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();

      const data = await fetchCelebrityData(month, day);
      setCelebData(data);  // data: { born: [...], died: [...] }
      console.log("🎂 Celeb data loaded:", data);
    } catch (err) {
      console.error("Celeb fetch error:", err);
      setCelebError("Celebrity data unavailable");
    } finally {
      setCelebLoading(false);
    }
  };

  // Weather API 호출 함수
  const fetchWeatherData = async (date) => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);

      const response = await fetch(`http://localhost:5000/api/time/${date}/weather`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch weather data');
      }

      setWeatherData(data.weather);
      console.log('🌤️ Weather data loaded:', data.weather);

    } catch (error) {
      console.error('Weather API Error:', error);
      setWeatherError(error.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Price API 호출 함수
  const fetchPriceData = async (date) => {
    try {
      setPriceLoading(true);
      setPriceError(null);

      const response = await fetch(`http://localhost:5000/api/price/${date}`);
      const data = await response.json();

      if (!data.exchangeRates || !data.consumerPrices) {
        throw new Error("Incomplete price data");
      }

      setPriceData(data);
      console.log("💸 Price data loaded:", data);
    } catch (err) {
      console.error("Price fetch error:", err);
      setPriceError("Failed to load price data");
    } finally {
      setPriceLoading(false);
    }
  };

  // 날씨 코드를 이모지로 변환하는 함수
  const getWeatherEmoji = (code) => {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌦️';
    if (code <= 99) return '⛈️';
    return '🌤️';
  };

  // Movie API 호출
  const fetchMovieData = async (date) => {
    try {
      setMovieLoading(true);
      setMovieError(null);

      const response = await fetch(`http://localhost:5000/api/movies/${date}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMovieList(data.movies);
      console.log('🎬 Movie data loaded:', data.movies);
    } catch (err) {
      console.error('Movie fetch error:', err);
      setMovieError('Movie data unavailable');
    } finally {
      setMovieLoading(false);
    }
  };

  // News API 호출
  const fetchNewsArticles = async (date) => {
    try {
      setNewsLoading(true);
      setNewsError(null);

      const response = await fetch(`http://localhost:5000/api/news/${date}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNewsArticles(data.articles);
      console.log('📰 News loaded:', data.articles);
    } catch (err) {
      console.error('News fetch error:', err);
      setNewsError('News data unavailable');
    } finally {
      setNewsLoading(false);
    }
  };

  // Save Time Capsule 함수
  const saveTimeCapsule = async () => {
    try {
      setIsSaving(true);

      const capsuleData = {
        selected_date: selectedDate,
        title: `Time Capsule from ${formatDateForDisplay(selectedDate)}`,
        historical_data: {
          priceData,
          weatherData,
          musicTracks: musicTracks.slice(0, 3),
          newsArticles: newsArticles.slice(0, 6),
          movieList: movieList.slice(0, 3),
          createdAt: new Date().toISOString()
        },
        is_public: false
      };

      const response = await fetch('http://localhost:5000/api/capsules', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(capsuleData)
      });

      if (!response.ok) {
        throw new Error('Failed to save time capsule');
      }

      const result = await response.json();

      if (result.success) {
        alert(`🎉 Time Capsule saved successfully!\n\nHi ${user.name}! Your time capsule from ${formatDateForDisplay(selectedDate)} has been saved.\nYou can view it in My Page!`);

        const goToMyPage = window.confirm('Would you like to view your saved capsules in My Page?');
        if (goToMyPage) {
          navigate('/mypage');
        }
      } else {
        throw new Error(result.message || 'Failed to save');
      }

    } catch (error) {
      console.error('Save time capsule error:', error);
      alert(`❌ Failed to save time capsule\n\n${error.message}\nPlease try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  // 🔥 저장된 캡슐 데이터 로드 함수
  const loadSavedCapsuleData = () => {
    if (savedCapsuleData && savedCapsuleData.historical_data) {
      try {
        let historicalData = savedCapsuleData.historical_data;

        // 문자열이면 파싱
        if (typeof historicalData === 'string') {
          historicalData = JSON.parse(historicalData);
        }

        // 저장된 데이터로 상태 설정
        if (historicalData.priceData) {
          setPriceData(historicalData.priceData);
          setPriceLoading(false);
        }

        if (historicalData.weatherData) {
          setWeatherData(historicalData.weatherData);
          setWeatherLoading(false);
        }

        if (historicalData.musicTracks) {
          setMusicTracks(historicalData.musicTracks);
          setMusicLoading(false);
        }

        if (historicalData.newsArticles) {
          setNewsArticles(historicalData.newsArticles);
          setNewsLoading(false);
        }

        if (historicalData.movieList) {
          setMovieList(historicalData.movieList);
          setMovieLoading(false);
        }

        console.log('✅ 저장된 캡슐 데이터 로드 완료');
        return true;
      } catch (error) {
        console.error('캡슐 데이터 파싱 에러:', error);
        return false;
      }
    }
    return false;
  };

  // 컴포넌트 마운트 시 API 호출들
  useEffect(() => {
    if (selectedDate) {
      // MyPage에서 온 경우 저장된 데이터 사용
      if (fromMyPage && savedCapsuleData) {
        const loaded = loadSavedCapsuleData();
        if (loaded) {
          console.log('🎯 저장된 캡슐 데이터 사용');
          return; // 저장된 데이터를 사용하므로 API 호출 건너뛰기
        }
      }

      // 새로운 날짜이거나 저장된 데이터가 없으면 API 호출
      console.log('🌐 새로운 API 호출');
      fetchWeatherData(selectedDate);
      fetchNewsArticles(selectedDate);
      fetchMovieData(selectedDate);
      fetchPriceData(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, fromMyPage, savedCapsuleData]);


  useEffect(() => {
    fetchCelebData();
  }, [selectedDate]);

  // Music API 호출
  useEffect(() => {
    const loadMusic = async () => {
      try {
        setMusicLoading(true);
        setMusicError(null);
        const tracks = await fetchTopTracks(selectedDate);
        setMusicTracks(tracks);
        console.log('🎵 Music loaded:', tracks);
      } catch (err) {
        console.error('Music fetch error:', err);
        setMusicError('Music data unavailable');
      } finally {
        setMusicLoading(false);
      }
    };

    if (selectedDate) {
      // MyPage에서 온 경우이고 저장된 음악 데이터가 있으면 건너뛰기
      if (fromMyPage && savedCapsuleData && savedCapsuleData.historical_data?.musicTracks) {
        console.log('🎵 저장된 음악 데이터 사용');
        return;
      }

      // 새로운 데이터 로드
      loadMusic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, fromMyPage, savedCapsuleData]);

  const handleBackHome = () => {
    navigate('/');
  };

  const handleSaveCapsule = () => {
    if (authLoading) {
      return;
    }

    if (isLoggedIn && user) {
      saveTimeCapsule();
    } else {
      navigate('/login', {
        state: {
          redirectTo: '/timeresult',
          redirectData: { selectedDate: selectedDate },
          message: 'Please log in to save your time capsule!'
        }
      });
    }
  };

  // Price 섹션 렌더링 함수
  const renderPriceSection = () => {
    if (priceLoading) return <p>💸 Loading price data...</p>;
    if (priceError) return <p style={{ color: '#d32f2f' }}>⚠️ {priceError}</p>;
    if (!priceData) return <p>No price data available.</p>;

    const { exchangeRates, consumerPrices } = priceData;

    return (
      <div>
        <p>💸 <strong>1 USD = {exchangeRates.USD_KRW.toFixed(1)} KRW</strong></p>
        <p>💶 <strong>1 USD = {exchangeRates.USD_EUR.toFixed(2)} EUR</strong></p>
        <p>💴 <strong>1 USD = {exchangeRates.USD_JPY.toFixed(1)} JPY</strong></p>
        <hr />
        <p>🥛 Milk (1 gallon): ${consumerPrices.milk}</p>
        <p>🍞 Bread (1 lb): ${consumerPrices.bread}</p>
        <p>🥚 Eggs (1 dozen): ${consumerPrices.egg}</p>
        <p>🥩 Beef (1 lb): ${consumerPrices.beef}</p>
      </div>
    );
  };

  // Movie 섹션 렌더링 함수
  const renderMovieSection = () => {
    if (movieLoading) {
      return <p>🎬 Loading movie data...</p>;
    }

    if (movieError) {
      return <p style={{ color: '#d32f2f' }}>⚠️ {movieError}</p>;
    }

    return (
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {movieList.slice(0, 3).map((movie, idx) => (
          <li key={idx} style={{ marginBottom: '15px' }}>
            <img src={movie.poster} alt={movie.title} style={{ width: '100%', borderRadius: '4px', marginBottom: '4px' }} />
            <p style={{ fontSize: '13px', fontWeight: 'bold' }}>{movie.title}</p>
          </li>
        ))}
      </ul>
    );
  };

  // Weather 섹션 렌더링 함수
  const renderWeatherSection = () => {
    if (weatherLoading) {
      return (
        <div className="section-content">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🌤️</div>
            <p>Loading weather data...</p>
          </div>
        </div>
      );
    }

    if (weatherError) {
      return (
        <div className="section-content">
          <div style={{ textAlign: 'center', padding: '20px', color: '#d32f2f' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
            <p>Weather data unavailable</p>
            <button
              onClick={() => fetchWeatherData(selectedDate)}
              style={{
                marginTop: '10px',
                padding: '5px 10px',
                backgroundColor: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (weatherData) {
      return (
        <div className="section-content">
          {weatherData.seoul && (
            <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px dotted #ccc' }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>🏙️ Seoul</h4>
              <p style={{ margin: '0', fontSize: '12px' }}>
                {getWeatherEmoji(weatherData.seoul.weatherCode)}
                <strong> {weatherData.seoul.tempMax}°C / {weatherData.seoul.tempMin}°C</strong>
              </p>
              {weatherData.seoul.precipitation > 0 && (
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#666' }}>
                  🌧️ Rain: {weatherData.seoul.precipitation}mm
                </p>
              )}
            </div>
          )}

          {weatherData.newyork && (
            <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px dotted #ccc' }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>🗽 New York</h4>
              <p style={{ margin: '0', fontSize: '12px' }}>
                {getWeatherEmoji(weatherData.newyork.weatherCode)}
                <strong> {weatherData.newyork.tempMax}°C / {weatherData.newyork.tempMin}°C</strong>
              </p>
              {weatherData.newyork.precipitation > 0 && (
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#666' }}>
                  🌧️ Rain: {weatherData.newyork.precipitation}mm
                </p>
              )}
            </div>
          )}

          {weatherData.london && (
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>🇬🇧 London</h4>
              <p style={{ margin: '0', fontSize: '12px' }}>
                {getWeatherEmoji(weatherData.london.weatherCode)}
                <strong> {weatherData.london.tempMax}°C / {weatherData.london.tempMin}°C</strong>
              </p>
              {weatherData.london.precipitation > 0 && (
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#666' }}>
                  🌧️ Rain: {weatherData.london.precipitation}mm
                </p>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="section-content">
        <p style={{ color: '#666', fontSize: '13px' }}>Weather data not available</p>
      </div>
    );
  };

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        🔄 Loading...
      </div>
    );
  }

  return (
    <div className="newspaper-container">
      <div className="newspaper">

        {/* 신문 헤더 */}
        <div className="newspaper-header">
          <div className="newspaper-info">
            <span>Vol. 1 No. 1</span>
            <span>SEOUL, KOREA</span>
            <span>Price: FREE</span>
          </div>
          <h1 className="newspaper-title">THE TIME TRAVELER</h1>
          <div className="newspaper-date">{formatDateForDisplay(selectedDate)}</div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="newspaper-content">

          {/* 왼쪽 사이드바 */}
          <div className="left-sidebar">

            {/* 날씨 섹션 */}
            <div className="news-section sidebar-section">
              <div className="section-header">WEATHER REPORT</div>
              {renderWeatherSection()}
            </div>

            {/* 시장 가격 섹션 */}
            <div className="news-section sidebar-section">
              <div className="section-header">MARKET PRICES</div>
              <div className="section-content">
                {renderPriceSection()}
              </div>
            </div>

            {/* 인기 음악 섹션 */}
            <div className="news-section sidebar-section">
              <div className="section-header">TOP HITS</div>
              <div className="section-content">
                {musicLoading ? (
                  <p>🎵 Loading music data...</p>
                ) : musicError ? (
                  <p style={{ color: '#d32f2f' }}>⚠️ {musicError}</p>
                ) : (
                  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {musicTracks.slice(0, 3).map((track, idx) => (
                      <li key={idx} style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold' }}>🎵 {track.title}</span><br />
                        <span style={{ fontSize: '12px', color: '#555' }}>{track.artist}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 유명인 생일/사망일 섹션 */}
              <div className="news-section sidebar-section">
                <div className="section-header">FAMOUS BIRTHS & DEATHS</div>
                <div className="section-content">
                  {celebLoading ? (
                    <p>🎂 Loading celebrity data...</p>
                  ) : celebError ? (
                    <p style={{ color: '#d32f2f' }}>⚠️ {celebError}</p>
                  ) : (
                    <>
                      <h4 style={{ marginTop: '8px', marginBottom: '4px' }}>🎉 Born</h4>
                      <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '12px' }}>
                        {celebData?.born?.slice(0, 2).map((person, idx) => (
                          <li key={idx} style={{ marginBottom: '6px' }}>
                            {person.year} – {person.name}
                            {person.wikipedia && (
                              <a href={person.wikipedia} target="_blank" rel="noreferrer"> 🔗</a>
                            )}
                          </li>
                        ))}
                      </ul>

                      <h4 style={{ marginTop: '12px', marginBottom: '4px' }}>🕯️ Died</h4>
                      <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '12px' }}>
                        {celebData?.died?.slice(0, 2).map((person, idx) => (
                          <li key={idx} style={{ marginBottom: '6px' }}>
                            {person.year} – {person.name}
                            {person.wikipedia && (
                              <a href={person.wikipedia} target="_blank" rel="noreferrer"> 🔗</a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>



            </div>

          </div>

          {/* 메인 뉴스 영역 */}
          <div className="main-content">

            <div className="breaking-news">
              <h2>BREAKING NEWS</h2>

              <div className="news-text">
                {newsLoading ? (
                  <p>📰 Loading news data...</p>
                ) : newsError ? (
                  <p style={{ color: '#d32f2f' }}>⚠️ {newsError}</p>
                ) : (
                  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {newsArticles.slice(0, 6).map((article, idx) => (
                      <li key={idx} style={{ marginBottom: '20px', borderBottom: '1px dotted #ccc', paddingBottom: '10px' }}>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '15px', fontWeight: 'bold', color: '#2b2b7f', textDecoration: 'underline' }}
                        >
                          📰 {article.title}
                        </a>
                        {article.summary && (
                          <p style={{ fontSize: '13px', color: '#333', marginTop: '5px' }}>
                            {article.summary.replace(/<[^>]+>/g, '')}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>

          {/* 오른쪽 사이드바 */}
          <div className="right-sidebar">


            {/* 영화 섹션 */}
            <div className="news-section sidebar-section">
              <div className="section-header">CINEMA</div>
              <div className="section-content">
                {renderMovieSection()}
              </div>
            </div>

          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="newspaper-footer">
          <div className="save-capsule-content">
            <h3 style={{ marginBottom: '10px', color: '#3b2f2f', fontSize: '1.2rem' }}>
              💎 Want to save this time capsule and share it with friends?
            </h3>

            {/* 🔥 MyPage에서 온 경우 다른 메시지 표시 */}
            {fromMyPage ? (
              <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
                ✨ This is your saved time capsule from {formatDateForDisplay(selectedDate)}!
              </p>
            ) : isLoggedIn && user ? (
              <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
                Welcome back, <strong>{user.name}</strong>! Ready to save your time capsule from {formatDateForDisplay(selectedDate)}?
              </p>
            ) : (
              <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
                Log in to save your personal time capsule and share it with friends!
              </p>
            )}

            <div className="save-buttons">
              {/* 🔥 MyPage에서 온 경우 저장 버튼 숨기기 */}
              {!fromMyPage && (
                <button
                  onClick={handleSaveCapsule}
                  className="save-capsule-button"
                  disabled={isSaving}
                  style={{
                    opacity: isSaving ? 0.7 : 1,
                    cursor: isSaving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSaving ? (
                    '⏳ Saving...'
                  ) : isLoggedIn ? (
                    '💾 Save as Time Capsule'
                  ) : (
                    '🔐 Login to Save Capsule'
                  )}
                </button>
              )}

              <button onClick={handleBackHome} className="back-button">
                ← RETURN TO TIME MACHINE
              </button>

              {/* 🔥 MyPage에서 온 경우 MyPage로 돌아가는 버튼 추가 */}
              {fromMyPage && (
                <button
                  onClick={() => navigate('/mypage')}
                  className="back-button"
                  style={{ marginLeft: '10px' }}
                >
                  📋 Back to My Capsules
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimeResultPage;