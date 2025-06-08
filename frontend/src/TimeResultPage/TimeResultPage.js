import React from 'react';
import './TimeResultPage.css';

const TimeResultPage = ({ selectedDate = "March 15, 1995", onBackHome }) => {
  const handleBackHome = () => {
    if (onBackHome) {
      onBackHome();
    } else {
      window.history.back();
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
                <p>날씨 API를 불러올 예정입니다.</p>
                <p><em>Weather data will be loaded via API</em></p>
              </div>
            </div>

            {/* 시장 가격 섹션 */}
            <div className="news-section sidebar-section">
              <div className="section-header">MARKET PRICES</div>
              <div className="section-content">
                <p><strong>API Calling</strong></p>
                <p>시장 가격 API를 불러올 예정입니다.</p>
                <p><em>Market price data will be loaded via API</em></p>
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
                <p>뉴스 API를 불러올 예정입니다</p>
              </div>

              {/* 뉴스 본문 */}
              <div className="news-text">
                <p><strong>API Calling - News Content</strong></p>
                <p>
                  이 섹션에서는 뉴스 API를 통해 {selectedDate}의 주요 뉴스를 불러올 예정입니다.
                </p>
                <p>
                  News API will be integrated here to fetch major headlines and events from {selectedDate}.
                </p>
                <p>
                  정치, 경제, 문화, 스포츠 등 다양한 분야의 뉴스 데이터를 실시간으로 가져와 표시할 계획입니다.
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
                <p>음악 차트 API를 불러올 예정입니다.</p>
                <p><em>Music chart data will be loaded via API</em></p>
              </div>
            </div>

            {/* 영화 섹션 */}
            <div className="news-section sidebar-section">
              <div className="section-header">CINEMA</div>
              <div className="section-content">
                <p><strong>API Calling</strong></p>
                <p>영화 정보 API를 불러올 예정입니다.</p>
                <p><em>Movie data will be loaded via API</em></p>
              </div>
            </div>

            {/* 재미있는 사실들 */}
            <div className="news-section sidebar-section">
              <div className="section-header">DID YOU KNOW?</div>
              <div className="section-content">
                <p><strong>API Calling</strong></p>
                <p>역사적 사실 API를 불러올 예정입니다.</p>
                <p><em>Historical facts will be loaded via API</em></p>
              </div>
            </div>
            
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="newspaper-footer">
          <button onClick={handleBackHome} className="back-button">
            ← RETURN TO TIME MACHINE
          </button>
        </div>

      </div>
    </div>
  );
};

export default TimeResultPage;