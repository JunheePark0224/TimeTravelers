import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function SignUpPage() {
  const navigate = useNavigate();
  
  // ✅ 모든 필드를 빈 문자열로 초기화 (undefined 방지)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    dateOfBirth: '' // ✅ date input을 위한 단일 필드
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
    
    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) { // ✅ 백엔드와 일치시킴
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // ✅ 생년월일 검증 수정
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Please select your birth date';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const currentDate = new Date();
      const minDate = new Date('1900-01-01');
      
      if (birthDate > currentDate) {
        newErrors.dateOfBirth = 'Birth date cannot be in the future';
      } else if (birthDate < minDate) {
        newErrors.dateOfBirth = 'Please enter a valid birth date';
      } else if (isNaN(birthDate.getTime())) {
        newErrors.dateOfBirth = 'Please enter a valid date';
      }
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
    
    try {
      // ✅ 실제 API 호출
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          birth_date: formData.dateOfBirth
        })
      });

      const result = await response.json();

      if (result.success) {
        // 회원가입 성공 메시지
        alert(`🎉 Welcome to Time Travelers, ${formData.name}!\n\nYour account has been created successfully!\nLet's explore what the world was like on your birthday!`);
        
        // 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please login.',
              email: formData.email
            }
          });
        }, 1000);
        
      } else {
        // 회원가입 실패 처리
        if (result.message.includes('email')) {
          setErrors({ email: result.message });
        } else {
          alert(`❌ Registration Failed\n\n${result.message}`);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('❌ Connection Error\n\nUnable to connect to the server. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="signup-container" style={{ backgroundImage: `url(/background.png)` }}>
      <div className="overlay" />
      
      <div className="signup-content">
        <div className="signup-header">
          <img src="/clock-logo.png" alt="Time Travelers Logo" className="signup-logo" />
          <h1 className="signup-title bangers-regular">Join Time Travelers</h1>
          <p className="signup-subtitle">Create your account to save your time journeys</p>
        </div>

        <div className="signup-form">
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
            <label htmlFor="name">👤 Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={errors.name ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">🔒 Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="At least 6 characters"
              className={errors.password ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">🎂 Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              min="1900-01-01"
              max={new Date().toISOString().split('T')[0]}
              className={errors.dateOfBirth ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            <p className="birth-hint">We'll show you what the world was like on your special day!</p>
          </div>

          <div className="form-buttons">
            <button 
              type="button" 
              className="signup-btn"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                '🚀 Sign Up'
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

        <div className="signup-footer">
          <p>Already have an account? <button onClick={goToLogin} className="login-link">Login here</button></p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;