// frontend/src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TimeTravelers app', () => {
  render(<App />);
  const element = screen.getByText(/TimeTravelers|Time Travel|Travel|Home|Login|Welcome/i);
  expect(element).toBeInTheDocument();
});

test('app renders without crashing', () => {
  render(<App />);
  expect(document.body).toBeInTheDocument();
});



