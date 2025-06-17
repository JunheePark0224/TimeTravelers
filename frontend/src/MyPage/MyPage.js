// 깔끔한 MyPage.js - Privacy 토글 기능 추가
import React, { useState, useEffect } from 'react';
import './MyPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const MyPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // 상태 관리
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 날짜 포맷 함수
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // 캡슐 목록 가져오기
  const fetchCapsules = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/capsules', {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // localStorage에서 저장된 privacy 설정 불러오기
        const savedPrivacySettings = JSON.parse(localStorage.getItem('capsulePrivacySettings') || '{}');
        
        // 기존 데이터에 localStorage 설정 적용
        const capsulesWithPrivacySettings = data.capsules.map(capsule => ({
          ...capsule,
          is_public: savedPrivacySettings[capsule.id] !== undefined 
            ? savedPrivacySettings[capsule.id] 
            : capsule.is_public
        }));
        
        setCapsules(capsulesWithPrivacySettings || []);
        console.log('✅ Capsules loaded successfully:', capsulesWithPrivacySettings.length, 'items');
      } else {
        throw new Error(data.message || 'Failed to fetch capsules');
      }

    } catch (error) {
      console.error('Error fetching capsules:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Privacy 설정 토글 (localStorage에 저장)
  const togglePrivacy = (capsuleId, currentPublicStatus) => {
    const newPublicStatus = !currentPublicStatus;
    
    // 상태 업데이트
    setCapsules(prev => prev.map(capsule => 
      capsule.id === capsuleId 
        ? { ...capsule, is_public: newPublicStatus }
        : capsule
    ));
    
    // localStorage에 privacy 설정 저장
    const savedPrivacySettings = JSON.parse(localStorage.getItem('capsulePrivacySettings') || '{}');
    savedPrivacySettings[capsuleId] = newPublicStatus;
    localStorage.setItem('capsulePrivacySettings', JSON.stringify(savedPrivacySettings));
    
    const newStatus = newPublicStatus ? 'Public' : 'Private';
    alert(`Capsule has been set to ${newStatus}.`);
  };

  // 캡슐 삭제
  const deleteCapsule = async (capsuleId) => {
    if (!window.confirm('Are you sure you want to delete this time capsule?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/capsules/${capsuleId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // localStorage에서 privacy 설정도 제거
        const savedPrivacySettings = JSON.parse(localStorage.getItem('capsulePrivacySettings') || '{}');
        delete savedPrivacySettings[capsuleId];
        localStorage.setItem('capsulePrivacySettings', JSON.stringify(savedPrivacySettings));
        
        setCapsules(prev => prev.filter(capsule => capsule.id !== capsuleId));
        alert('Time capsule has been deleted successfully.');
      } else {
        throw new Error(data.message || 'Failed to delete capsule');
      }

    } catch (error) {
      console.error('Error deleting capsule:', error);
      alert(`Failed to delete time capsule: ${error.message}`);
    }
  };

  // 캡슐 클릭 핸들러 (TimeResult 페이지로 이동)
  const handleCapsuleClick = (capsule) => {
    // Private 캡슐은 클릭 비활성화
    if (!capsule.is_public) {
      alert('This is a private time capsule. Please set it to public to view the contents.');
      return;
    }

    navigate('/timeresult', {
      state: {
        selectedDate: capsule.selected_date,
        fromMyPage: true,
        capsuleData: capsule
      }
    });
  };

  // 공유 링크 복사
  const copyShareLink = async (shareToken) => {
    const shareUrl = `${window.location.origin}/capsule/share/${shareToken}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link has been copied to clipboard!');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Share link has been copied!');
    }
  };

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      fetchCapsules();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, navigate]);

  // 인증 로딩 중
  if (authLoading) {
    return (
      <div className="mypage-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>🔍 Checking authentication...</h2>
          <p>Please wait a moment</p>
        </div>
      </div>
    );
  }

  // 로딩 중
  if (loading) {
    return (
      <div className="mypage-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>🔍 Loading your time capsules...</h2>
          <p>Gathering your historical journeys</p>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="mypage-container">
        <div className="error-container">
          <h2>❌ Error</h2>
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={fetchCapsules}>
            🔄 Retry
          </button>
          <button className="home-button" onClick={() => navigate('/')}>
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="mypage-container"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/background.png)` }}
    >
      {/* 헤더 섹션 */}
      <div className="mypage-header">
        <div className="header-content">
          <div className="user-welcome">
            <h1 className="page-title">📋 My Time Capsules</h1>
            <p className="welcome-text">
              Welcome back, <strong>{user?.name}</strong>! 🎉
            </p>
          </div>
          <button className="home-button" onClick={() => navigate('/')}>
            🏠 Back to Home
          </button>
        </div>
        
        {/* 통계 섹션 */}
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">{capsules.length}</span>
            <span className="stat-label">Total Capsules</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {capsules.filter(c => c.is_public).length}
            </span>
            <span className="stat-label">Public</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {capsules.filter(c => !c.is_public).length}
            </span>
            <span className="stat-label">Private</span>
          </div>
        </div>
      </div>

      {/* 캡슐 목록 또는 Empty State */}
      {capsules.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No time capsules yet</h3>
          <p>
            Create your first time capsule by selecting a date and exploring history!<br />
            Your saved capsules will appear here.
          </p>
          <button className="create-button" onClick={() => navigate('/')}>
            ⏰ Create Time Capsule
          </button>
        </div>
      ) : (
        <>
          <div className="capsules-grid">
            {capsules.map(capsule => (
              <div key={capsule.id} className="capsule-card">
                {/* 캡슐 헤더 */}
                <div className="capsule-header">
                  <div className="capsule-date">
                    <span className="date-main">{formatDate(capsule.selected_date)}</span>
                    <span className="date-created">
                      Created: {new Date(capsule.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <button 
                    className={`status-badge clickable ${capsule.is_public ? 'public' : 'private'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePrivacy(capsule.id, capsule.is_public);
                    }}
                    title="Click to toggle privacy"
                  >
                    {capsule.is_public ? '🌍 Public' : '🔒 Private'}
                  </button>
                </div>

                {/* 캡슐 컨텐츠 */}
                <div 
                  className={`capsule-content ${!capsule.is_public ? 'disabled' : ''}`} 
                  onClick={() => handleCapsuleClick(capsule)}
                  style={{
                    cursor: capsule.is_public ? 'pointer' : 'not-allowed',
                    opacity: capsule.is_public ? 1 : 0.6
                  }}
                >
                  <h3 className="capsule-title">
                    {capsule.title || `Time Capsule from ${formatDate(capsule.selected_date)}`}
                  </h3>
                  
                  <div className="capsule-preview">
                    <div className="preview-items">
                      <span className="preview-item">📰 News</span>
                      <span className="preview-item">🎵 Music</span>
                      <span className="preview-item">🎬 Movies</span>
                      <span className="preview-item">🌤️ Weather</span>
                      <span className="preview-item">💸 Prices</span>
                    </div>
                  </div>
                  
                  <div className="view-capsule">
                    {capsule.is_public ? '👁️ View Capsule' : '🔒 Private Capsule'}
                  </div>
                </div>

                {/* 캡슐 액션 버튼 */}
                <div className="capsule-actions">
                  <button 
                    className="action-button share"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyShareLink(capsule.share_token);
                    }}
                    title="Share this capsule"
                  >
                    🔗 Share
                  </button>
                  
                  <button 
                    className="action-button delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCapsule(capsule.id);
                    }}
                    title="Delete this capsule"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 하단 액션 */}
          <div className="bottom-actions">
            <button className="create-new-button" onClick={() => navigate('/')}>
              ✨ Create New Time Capsule
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyPage;