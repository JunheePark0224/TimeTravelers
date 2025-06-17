// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import HomePage from './HomePage/HomePage';
import SignUpPage from './SignUpPage/SignUpPage';
import LoginPage from './LoginPage/LoginPage';
import TimeResultPage from './TimeResultPage/TimeResultPage';
import MyPage from './MyPage/MyPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/timeresult" element={<TimeResultPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;