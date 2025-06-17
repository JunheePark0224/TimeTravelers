// src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // 🔥 핵심: 앱 시작 시 서버에서 인증 상태 확인
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-auth`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.loggedIn && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // 네트워크 오류 시 localStorage 확인
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 함수
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true, user: result.user };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Connection error' };
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    }
  };

  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};