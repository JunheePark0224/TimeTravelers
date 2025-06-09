import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

// Helper function to wrap component with Router
const renderWithRouter = (component, options = {}) => {
  const { initialEntries = ['/'] } = options;
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
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

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders without crashing', () => {
    const { container } = renderWithRouter(<HomePage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders logo', () => {
    renderWithRouter(<HomePage />);
    const logoElement = screen.getByAltText(/Time Travelers Logo/i);
    expect(logoElement).toBeInTheDocument();
  });

  test('shows content after loading', async () => {
    renderWithRouter(<HomePage />);
    
  })
});