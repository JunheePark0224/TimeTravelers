import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App', () => {
  test('renders TimeTravelers app', () => {
    render(<App />);
    // Check if the logo is rendered (which indicates the app is working)
    const logoElement = screen.getByAltText(/Time Travelers Logo/i);
    expect(logoElement).toBeInTheDocument();
  });

  test('app renders without crashing', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders router structure', () => {
    const { container } = render(<App />);
    // Check if the main App div with proper class exists
    const appDiv = container.querySelector('.App');
    expect(appDiv).toBeInTheDocument();
  });
});