import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import SignUpPage from './SignUpPage/SignUpPage';
import LoginPage from './LoginPage/LoginPage';
import TimeResultPage from './TimeResultPage/TimeResultPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/timeresult" element={<TimeResultPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;