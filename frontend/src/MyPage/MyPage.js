import React, { useState, useEffect } from 'react';
import './MyPage.css';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // 날짜 포맷 함수
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // 로그인 상태 확인
  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/check-auth', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.loggedIn && data.user) {
          setUser(data.user);
          return true;
        }
      }
      
      // 로그인되지 않음
      navigate('/login');
      return false;
    } catch (error) {
      console.error('Auth 확인 에러:', error);
      navigate('/login');
      return false;
    }
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
        setCapsules(data.capsules || []);
        console.log('✅ 캡슐 목록 로드됨:', data.capsules.length, '개');
      } else {
        throw new Error(data.message || 'Failed to fetch capsules');
      }

    } catch (error) {
      console.error('캡슐 목록 가져오기 에러:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 캡슐 삭제
  const deleteCapsule = async (capsuleId) => {
    if (!window.confirm('정말로 이 캡슐을 삭제하시겠습니까?')) {
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
        // 삭제된 캡슐을 목록에서 제거
        setCapsules(prev => prev.filter(capsule => capsule.id !== capsuleId));
        alert('캡슐이 삭제되었습니다.');
      } else {
        throw new Error(data.message || 'Failed to delete capsule');
      }

    } catch (error) {
      console.error('캡슐 삭제 에러:', error);
      alert(`캡슐 삭제에 실패했습니다: ${error.message}`);
    }
  };

  // 캡슐 클릭 핸들러 (TimeResult 페이지로 이동)
  const handleCapsuleClick = (capsule) => {
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
      alert('공유 링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      // 클립보드 API가 지원되지 않는 경우
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('공유 링크가 복사되었습니다!');
    }
  };

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    const initPage = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        await fetchCapsules();
      }
    };

    initPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로딩 중
  if (loading) {
    return (
      <div className="mypage-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '18px' 
        }}>
          🔍 Loading your time capsules...
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="mypage-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2 style={{ color: '#d32f2f' }}>❌ Error</h2>
          <p>{error}</p>
          <button 
            onClick={fetchCapsules}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 className="mypage-title">
          📋 My Time Capsules
          {user && <span style={{ fontSize: '16px', color: '#666', marginLeft: '10px' }}>
            Welcome, {user.name}!
          </span>}
        </h1>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🏠 Back to Home
        </button>
      </div>

      {capsules.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3 style={{ color: '#666' }}>📦 No time capsules yet</h3>
          <p style={{ color: '#999', marginBottom: '20px' }}>
            Create your first time capsule by selecting a date!
          </p>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ⏰ Create Time Capsule
          </button>
        </div>
      ) : (
        <>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            총 <strong>{capsules.length}개</strong>의 캡슐이 저장되어 있습니다.
          </p>
          
          <div className="capsule-grid">
            {capsules.map(capsule => (
              <div key={capsule.id} className="capsule-card">
                <div
                  className="capsule-content"
                  onClick={() => handleCapsuleClick(capsule)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{formatDate(capsule.selected_date)}</h3>
                  <p className="capsule-title">{capsule.title}</p>
                  <p className="capsule-summary">
                    Created: {new Date(capsule.created_at).toLocaleDateString()}
                  </p>
                  {capsule.is_public && (
                    <span style={{ 
                      backgroundColor: '#4caf50', 
                      color: 'white', 
                      padding: '2px 6px', 
                      borderRadius: '3px', 
                      fontSize: '12px' 
                    }}>
                      Public
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button 
                    className="capsule-share"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyShareLink(capsule.share_token);
                    }}
                    title="Share this capsule"
                    style={{
                      padding: '8px',
                      backgroundColor: '#2196f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🔗
                  </button>
                  
                  <button 
                    className="capsule-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCapsule(capsule.id);
                    }}
                    title="Delete this capsule"
                    style={{
                      padding: '8px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyPage;