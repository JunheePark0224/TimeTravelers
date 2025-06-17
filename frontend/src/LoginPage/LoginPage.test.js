import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthContext';
import LoginPage from './LoginPage';

// Helper function to wrap component with Router and AuthProvider
const renderWithProviders = (component) => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </AuthProvider>
  );
};

// Mock useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    fetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders without crashing', () => {
    const { container } = renderWithProviders(<LoginPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders login form elements', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText('🚀 Login')).toBeInTheDocument();
  });

  test('navigates back to home when Back button clicked', () => {
    renderWithProviders(<LoginPage />);
    
    const backButton = screen.getByText('🔙 Back to Home');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});