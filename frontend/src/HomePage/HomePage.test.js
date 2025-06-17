import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthContext';
import HomePage from './HomePage';

// Helper function to wrap component with Router and AuthProvider
const renderWithProviders = (component, options = {}) => {
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
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default'
  }),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    fetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders without crashing', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders logo', () => {
    renderWithProviders(<HomePage />);
    const logoElement = screen.getByAltText(/Time Travelers Logo/i);
    expect(logoElement).toBeInTheDocument();
  });

  test('shows content after loading', async () => {
    renderWithProviders(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Time Travelers')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
