import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // TimeResultPage에서 전달된 리다이렉트 정보 확인
  const redirectTo = location.state?.redirectTo;
  const redirectData = location.state?.redirectData;
  const redirectMessage = location.state?.message;
  
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
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
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
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      alert(`🎉 Welcome back, ${result.user.name}!\n\nYou have successfully logged in!`);
      
      setTimeout(() => {
        // TimeResultPage에서 온 경우 해당 페이지로 돌아가기
        if (redirectTo === '/timeresult' && redirectData) {
          navigate('/timeresult', { 
            state: { 
              selectedDate: redirectData.selectedDate 
            } 
          });
        } else {
          // 일반적인 경우 홈으로 이동
          navigate('/');
        }
      }, 1000);
    } else {
      if (result.message && (result.message.includes('email') || result.message.includes('password'))) {
        setErrors({
          email: result.message,
          password: result.message
        });
      } else {
        alert(`❌ Login Failed\n\n${result.message}`);
      }
    }
    
    setIsLoading(false);
  };

  const goBack = () => {
    // TimeResultPage에서 온 경우 해당 페이지로 돌아가기
    if (redirectTo === '/timeresult' && redirectData) {
      navigate('/timeresult', { 
        state: { 
          selectedDate: redirectData.selectedDate 
        } 
      });
    } else {
      navigate('/');
    }
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
          
          {redirectMessage ? (
            <p className="login-subtitle" style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
              {redirectMessage}
            </p>
          ) : (
            <p className="login-subtitle">Sign in to continue your time journey</p>
          )}
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
              disabled={isLoading}
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
              disabled={isLoading}
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