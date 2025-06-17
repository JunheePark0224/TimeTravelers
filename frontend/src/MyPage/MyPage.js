import React from 'react';
import './MyPage.css';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate();

  // 💡 임시 더미 데이터 (이건 나중에 백엔드가 실제 데이터로 교체할 예정)
  const mockCapsules = [
    {
      id: 1,
      date: '1969-07-20',
      title: 'Apollo 11 Moon Landing',
      summary: 'Neil Armstrong walks on the moon',
    },
    {
      id: 2,
      date: '2002-06-22',
      title: 'Korea Reaches World Cup Semifinal',
      summary: 'Korea defeats Spain in historic match',
    },
  ];

  return (
    <div className="mypage-container">
      <h1 className="mypage-title"> My Time Capsules</h1>

      <div className="capsule-grid">
        {mockCapsules.map(capsule => (
          <div key={capsule.id} className="capsule-card">
            <div
              className="capsule-content"
              onClick={() => navigate(`/result?date=${capsule.date}`)}
            >
              <h3>{capsule.date}</h3>
              <p className="capsule-title">{capsule.title}</p>
              <p className="capsule-summary">{capsule.summary}</p>
            </div>
            <button className="capsule-delete">🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPage;