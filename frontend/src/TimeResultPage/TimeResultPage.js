import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TimeResultPage.css';

const TimeResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDate = location.state?.selectedDate || "1995-03-15"; // YYYY-MM-DD 형식으로 변경
  
  // 로그인 상태 확인 (실제로는 context나 props로 받아야 함)
  const isLoggedIn = location.state?.isLoggedIn || false;

  // 새로 추가: Weather API 상태 관리
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  // 날짜 포맷 변환 함수 (표시용)
  const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Weather API 호출 함수
  const fetchWeatherData = async (date) => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);
      
      const response = await fetch(`http://localhost:5000/api/time-data/${date}/weather`, {
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

  const handleSaveCapsule = () => {
    if (isLoggedIn) {
      // 로그인된 상태면 바로 저장
      alert('🎉 Time Capsule saved successfully!\nYou can share it with your friends!');
      // TODO: 실제 저장 API 호출
    } else {
      // 게스트면 로그인 페이지로 이동 (현재 날짜 정보 전달)
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
            
            {/* 날씨 섹션 - 실제 API 데이터로 업데이트 */}
            <div className="news-section sidebar-section">
              <div className="section-header">WEATHER REPORT</div>
              {renderWeatherSection()}
            </div>

            {/* 시장 가격 섹션 - 기존 그대로 */}
            <div className="news-section sidebar-section">
              <div className="section-header">MARKET PRICES</div>
              <div className="section-content">
                <p><strong>API Calling</strong></p>
                <p>Market price API will be integrated here.</p>
                <p><em>Historical price data loading...</em></p>
              </div>
            </div>
            
          </div>

          {/* 메인 뉴스 영역 - 기존 그대로 */}
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

          {/* 오른쪽 사이드바 - 기존 그대로 */}
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

        {/* 하단 버튼 - 기존 그대로 */}
        <div className="newspaper-footer">
          <div className="save-capsule-content">
            <h3 style={{ marginBottom: '10px', color: '#3b2f2f', fontSize: '1.2rem' }}>
              💎 Want to save this time capsule and share it with friends?
            </h3>
            <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
              Log in to save your personal time capsule and share it with friends!
            </p>
            <div className="save-buttons">
              <button onClick={handleSaveCapsule} className="save-capsule-button">
                {isLoggedIn ? '💾 Save as Time Capsule' : '🔐 Login to Save Capsule'}
              </button>
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