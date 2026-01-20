import React from 'react';
import { render, screen } from '@testing-library/react';
import Contact from './Contact';

test('renders Contact component', () => {
  render(<Contact />);
  expect(screen.getByText('Contact Page')).toBeInTheDocument();
});
