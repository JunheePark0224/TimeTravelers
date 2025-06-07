import React, { useEffect, useState } from 'react';
import './HomePage.css';

function HomePage() {
  const [logoPhase, setLogoPhase] = useState('start'); // 'start' -> 'moving' -> 'done'
  const [showContent, setShowContent] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [isHovering, setIsHovering] = useState(false); // 호버 상태 추가

  useEffect(() => {
    const timer1 = setTimeout(() => setLogoPhase('moving'), 1000); // 1초 후 이동 시작
    const timer2 = setTimeout(() => setShowContent(true), 1500);   // 1.5초 후 콘텐츠 페이드 인
    const timer3 = setTimeout(() => setLogoPhase('done'), 3000);   // 3초 후 로고 이동 완료 처리
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(/background.png)` }}
    >
      <div className="overlay" />

      {showContent && (
        <button className="how-button fade-in-delayed" onClick={() => setShowHowTo(true)}>
          How to use
        </button>
      )}

      {showHowTo && (
        <div className="modal">
          <div className="modal-content">
            <h2>📜 How to Use</h2>
            <p>1. Enter any date you want to travel to.</p>
            <p>2. Press 'Time Travel' to see that day's world.</p>
            <p>3. Log in to save your historical journeys!</p>
            <button onClick={() => setShowHowTo(false)}>Close</button>
          </div>
        </div>
      )}

      <img
        src="/clock-logo.png"
        alt="Time Travelers Logo"
        className={`logo ${logoPhase === 'start' ? 'logo-start' : logoPhase === 'moving' ? 'logo-moving' : 'logo-final'} ${isHovering ? 'logo-spinning' : ''}`}
      />

      {showContent && (
        <div className="content fade-in-delayed">
          <h1 className="title bangers-regular">Time Travelers</h1>
          <p className="subtitle">Enter the date you want to travel to</p>
          <div className="date-form">
            <input type="number" placeholder="YYYY" min="1900" max="2099" />
            <input type="number" placeholder="MM" min="1" max="12" />
            <input type="number" placeholder="DD" min="1" max="31" />
            <button 
              type="button"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Time Travel
            </button>
          </div>
          
          {/* 슬라이딩 캐러셀 추가 */}
          <div className="carousel-container">
            <div className="carousel-track">
              <img src="/news-icon.jpg" alt="News" className="carousel-item" />
              <img src="/song-icon.webp" alt="Song" className="carousel-item" />
              <img src="/movie-icon.jpg" alt="Movie" className="carousel-item" />
              <img src="/weather-icon.jpg" alt="Weather" className="carousel-item" />
              <img src="/cost-icon.jpg" alt="Cost of Living" className="carousel-item" />
              {/* 무한 루프를 위한 복사본 */}
              <img src="/news-icon.jpg" alt="News" className="carousel-item" />
              <img src="/song-icon.webp" alt="Song" className="carousel-item" />
              <img src="/movie-icon.jpg" alt="Movie" className="carousel-item" />
              <img src="/weather-icon.jpg" alt="Weather" className="carousel-item" />
              <img src="/cost-icon.jpg" alt="Cost of Living" className="carousel-item" />
            </div>
          </div>
        </div>
      )}

      {showContent && (
        <div className="auth-buttons fade-in-delayed">
          <button onClick={() => alert('Sign up coming soon!')}>Sign Up</button>
          <button onClick={() => alert('Login coming soon!')}>Login</button>
        </div>
      )}
    </div>
  );
}

export default HomePage;