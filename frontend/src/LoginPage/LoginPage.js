import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    // 여기에 실제 로그인 API 호출 로직 추가
    try {
      // 임시로 2초 딜레이
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 로그인 성공 메시지
      alert(`🎉 Welcome back!\n\nYou have successfully logged in!`);
      
      // 잠시 후 자동으로 홈페이지로 이동
      setTimeout(() => {
        navigate('/', { state: { 
          isLoggedIn: true, 
          userName: formData.email.split('@')[0], // 이메일 앞부분을 이름으로 사용
          loginMethod: 'login'
        }});
      }, 1000); // 1초 후 자동 이동
      
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(/background.png)` }}>
      <div className="overlay" />
      
      <div className="login-content">
        <div className="login-header">
          <img src="/clock-logo.png" alt="Time Travelers Logo" className="login-logo" />
          <h1 className="login-title bangers-regular">Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue your time journey</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">🔒 Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-buttons">
            <button 
              type="button" 
              className="login-btn"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing in...
                </>
              ) : (
                '🚀 Login'
              )}
            </button>
            
            <button 
              type="button" 
              className="back-btn"
              onClick={goBack}
              disabled={isLoading}
            >
              🔙 Back to Home
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>Don't have an account? <button onClick={goToSignUp} className="signup-link">Sign up here</button></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;