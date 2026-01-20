import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

test('renders Footer component', () => {
  renderWithRouter(<Footer />);
  const olafElements = screen.getAllByText('Olaf');
  expect(olafElements.length).toBeGreaterThan(0);
});

test('renders footer links', () => {
  renderWithRouter(<Footer />);
  expect(screen.getByText('About Us')).toBeInTheDocument();
  expect(screen.getByText('Contact')).toBeInTheDocument();
});
