import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout: authLogout } = useAuth();
  
  const [logoPhase, setLogoPhase] = useState('start');
  const [showContent, setShowContent] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // AuthContext에서 로그인 상태 가져오기
  const isLoggedIn = isAuthenticated;
  const userName = user?.name || '';
  
  // 날짜 입력 상태
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  useEffect(() => {
    const timer1 = setTimeout(() => setLogoPhase('moving'), 1000);
    const timer2 = setTimeout(() => setShowContent(true), 1500);
    const timer3 = setTimeout(() => setLogoPhase('done'), 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleTimeTravel = () => {
    if (!year || !month || !day) {
      alert('Please fill in all date fields for your time travel!');
      return;
    }
    
    // 날짜 검증
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    
    if (yearNum < 1900 || yearNum > 2099) {
      alert('Please enter a year between 1900 and 2099');
      return;
    }
    
    if (monthNum < 1 || monthNum > 12) {
      alert('Please enter a valid month (1-12)');
      return;
    }
    
    if (dayNum < 1 || dayNum > 31) {
      alert('Please enter a valid day (1-31)');
      return;
    }
    
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    setIsLoading(true);
    
    // 2초 후 TimeResultPage로 이동
    setTimeout(() => {
      navigate('/timeresult', { 
        state: { 
          selectedDate: formattedDate 
        } 
      });
    }, 2000);
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    await authLogout();
    alert('Logged out successfully!');
  };

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
            <p>1.  Enter any date you want to travel to.</p>
            <p>2.  Press 'Time Travel' to see that day's world.</p>
            <p>3.  Log in to save your historical journeys!</p>
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
          
          {/* 로그인된 사용자 환영 메시지 */}
          {isLoggedIn && userName && (
            <p className="welcome-message" style={{ 
              color: '#fff', 
              fontSize: '16px', 
              marginBottom: '10px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              Welcome back, <strong>{userName}</strong>! 🎉
            </p>
          )}
          
          <p className="subtitle">Enter the date you want to travel to</p>
          <div className="date-form">
            <input 
              type="number" 
              placeholder="YYYY" 
              min="1900" 
              max="2099" 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={isLoading}
            />
            <input 
              type="number" 
              placeholder="MM" 
              min="1" 
              max="12" 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              disabled={isLoading}
            />
            <input 
              type="number" 
              placeholder="DD" 
              min="1" 
              max="31" 
              value={day}
              onChange={(e) => setDay(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="button"
              onClick={handleTimeTravel}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              disabled={isLoading}
              className={isLoading ? 'loading' : ''}
            >
              {isLoading ? '⏳ Traveling...' : '🚀 Time Travel!'}
            </button>
          </div>
          
          {/* 슬라이딩 캐러셀 */}
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
          {isLoggedIn ? (
            <>
              <button onClick={() => navigate('/mypage')}>
                👤 My Page
              </button>
              <button onClick={handleLogout}>
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSignUp}>Sign Up</button>
              <button onClick={handleLogin}>Login</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;