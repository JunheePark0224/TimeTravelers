import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TimeResultPage.css';

const TimeResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDate = location.state?.selectedDate || "1995-03-15";
  
  // 로그인 상태 관리
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 캡슐 저장 상태 관리
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Weather API 상태 관리
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  // 로그인 상태 확인 함수
  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      
      const response = await fetch('http://localhost:5000/api/auth/check-auth', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.loggedIn && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth 확인 에러:', error);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkAuth();
  }, []);

  // 날짜 포맷 변환 함수
  const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // 캡슐 저장 함수
  const saveCapsule = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      const historicalData = {
        weather: weatherData,
        news: null,
        music: null,
        movies: null,
        market: null,
        pageSnapshot: {
          selectedDate: selectedDate,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      };

      const capsuleData = {
        selected_date: selectedDate,
        historical_data: historicalData,
        title: `Time Capsule - ${formatDateForDisplay(selectedDate)}`,
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to save capsule');
      }

      setSaveSuccess(true);

      const shareUrl = `${window.location.origin}/capsule/share/${result.capsule.share_token}`;
      
      alert(`🎉 Time Capsule saved successfully!
      
📋 Capsule ID: ${result.capsule.id}
🔗 Share URL: ${shareUrl}

You can now share this link with your friends or find it in your MY PAGE!`);

    } catch (error) {
      console.error('Save capsule error:', error);
      setSaveError(error.message);
      alert(`❌ Failed to save capsule: ${error.message}`);
    } finally {
      setIsSaving(false);
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
      
    } catch (error) {
      console.error('Weather API Error:', error);
      setWeatherError(error.message);
    } finally {
      setWeatherLoading(false);
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

  // 컴포넌트 마운트 시 Weather API 호출
  useEffect(() => {
    if (selectedDate) {
      fetchWeatherData(selectedDate);
    }
  }, [selectedDate]);



  const handleBackHome = () => {
    navigate('/');
  };

  // Save Capsule 핸들러
  const handleSaveCapsule = () => {
    const isLoggedIn = !!user;
    
    if (isLoggedIn) {
      saveCapsule();
    } else {
      navigate('/login', { 
        state: { 
          redirectTo: '/timeresult',
          saveData: {
            selectedDate: selectedDate,
            fromSave: true
          }
        }
      });
    }
  };

  const handleGoToMyPage = () => {
    navigate('/mypage');
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
          {/* 서울 날씨 */}
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

          {/* 뉴욕 날씨 */}
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

          {/* 런던 날씨 */}
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

  // 로딩 중일 때는 로딩 화면 표시
  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px' 
      }}>
        🔍 Checking login status...
      </div>
    );
  }

  const isLoggedIn = !!user;

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
                <p><strong>API Calling</strong></p>
                <p>Market price API will be integrated here.</p>
                <p><em>Historical price data loading...</em></p>
              </div>
            </div>
            
          </div>

          {/* 메인 뉴스 영역 */}
          <div className="main-content">
            
            <div className="breaking-news">
              <h2>BREAKING NEWS</h2>
              
              {/* 뉴스 이미지 */}
              <div className="news-image">
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>📰</div>
                <p><strong>API Calling</strong></p>
                <p>News API will be integrated here</p>
              </div>

              {/* 뉴스 본문 */}
              <div className="news-text">
                <p><strong>API Calling - News Content</strong></p>
                <p>
                  This section will integrate News API to fetch major headlines and events from {formatDateForDisplay(selectedDate)}.
                </p>
                <p>
                  We will display real-time news data covering politics, economics, culture, sports, and other major events from the selected date.
                </p>
                <p>
                  Historical news data will provide insights into what was happening in the world on your chosen date.
                </p>
              </div>
            </div>
            
          </div>

          {/* 오른쪽 사이드바 */}
          <div className="right-sidebar">
            
            {/* 인기 음악 섹션 */}
            <div className="news-section sidebar-section">
              <div className="section-header">TOP HITS</div>
              <div className="section-content">
                <p><strong>API Calling</strong></p>
                <p>Music chart API will be integrated here.</p>
                <p><em>Popular songs data loading...</em></p>
              </div>
            </div>

            {/* 영화 섹션 */}
            <div className="news-section sidebar-section">
              <div className="section-header">CINEMA</div>
              <div className="section-content">
                <p><strong>API Calling</strong></p>
                <p>Movie data API will be integrated here.</p>
                <p><em>Popular movies data loading...</em></p>
              </div>
            </div>

            {/* 재미있는 사실들 */}
            <div className="news-section sidebar-section">
              <div className="section-header">DID YOU KNOW?</div>
              <div className="section-content">
                <p><strong>API Calling</strong></p>
                <p>Historical facts API will be integrated here.</p>
                <p><em>Fun facts data loading...</em></p>
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
            
            <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
              {isLoggedIn 
                ? `Welcome back, ${user?.name}! Save your time capsule and get a shareable link.`
                : "Log in to save your personal time capsule and share it with friends!"
              }
            </p>
            
            {/* 성공 메시지 */}
            {saveSuccess && (
              <div style={{ 
                marginBottom: '15px', 
                padding: '15px', 
                backgroundColor: '#d4edda', 
                border: '1px solid #c3e6cb', 
                borderRadius: '4px',
                color: '#155724',
                fontSize: '14px'
              }}>
                ✅ <strong>Time Capsule saved successfully!</strong><br/>
                <small>Check your MY PAGE or use the share link to view it anytime.</small>
              </div>
            )}
            
            {/* 저장 에러 표시 */}
            {saveError && (
              <div style={{ 
                marginBottom: '15px', 
                padding: '10px', 
                backgroundColor: '#ffebee', 
                border: '1px solid #ffcdd2', 
                borderRadius: '4px',
                color: '#c62828',
                fontSize: '14px'
              }}>
                ❌ {saveError}
              </div>
            )}

            <div className="save-buttons">
              <button 
                onClick={handleSaveCapsule} 
                className="save-capsule-button"
                disabled={isSaving}
                style={{
                  opacity: isSaving ? 0.7 : 1,
                  cursor: isSaving ? 'not-allowed' : 'pointer'
                }}
              >
                {isSaving 
                  ? '💾 Saving...' 
                  : (isLoggedIn ? '💾 Save as Time Capsule' : '🔐 Login to Save Capsule')
                }
              </button>
              
              {/* 로그인된 사용자에게만 MY PAGE 버튼 표시 */}
              {isLoggedIn && (
                <button 
                  onClick={handleGoToMyPage} 
                  className="mypage-button"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginLeft: '10px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📋 View My Capsules
                </button>
              )}
              
              <button onClick={handleBackHome} className="back-button">
                ← RETURN TO TIME MACHINE
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimeResultPage;