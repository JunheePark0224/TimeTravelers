// frontend/src/components/HomePage.test.js
import { render } from '@testing-library/react';
import HomePage from './HomePage';

test('HomePage renders without crashing', () => {
  render(<HomePage />);
  expect(document.body).toBeInTheDocument();
});