import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TimeResultPage.css';

const TimeResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDate = location.state?.selectedDate || "March 15, 1995";
  
  // 로그인 상태 확인 (실제로는 context나 props로 받아야 함)
  const isLoggedIn = location.state?.isLoggedIn || false;

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
          <div className="newspaper-date">{selectedDate}</div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="newspaper-content">
          
          {/* 왼쪽 사이드바 */}
          <div className="left-sidebar">
            
            {/* 날씨 섹션 */}
            <div className="news-section sidebar-section">
              <div className="section-header">WEATHER REPORT</div>
              <div className="section-content">
                <p><strong>API Calling</strong></p>
                <p>Weather API will be integrated here.</p>
                <p><em>Historical weather data loading...</em></p>
              </div>
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
                  This section will integrate News API to fetch major headlines and events from {selectedDate}.
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

        {/* 하단 버튼 - 기존 스타일과 통합 */}
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