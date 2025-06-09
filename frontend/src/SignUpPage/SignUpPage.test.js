import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import SignUpPage from './SignUpPage';

// Helper function to wrap component with Router
const renderWithRouter = (component) => {
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
}));

describe('SignUpPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders without crashing', () => {
    const { container } = renderWithRouter(<SignUpPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders signup form elements', () => {
    renderWithRouter(<SignUpPage />);
    
    expect(screen.getByText('Join Time Travelers')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByText('🚀 Sign Up')).toBeInTheDocument();
  });

  test('navigates back to home when Back button clicked', () => {
    renderWithRouter(<SignUpPage />);
    
    const backButton = screen.getByText('🔙 Back to Home');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});