import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavbarWrapper from './NavbarWrapper';

// Mock Navbar
jest.mock('./layout/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

const renderWithRouter = (path) => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <NavbarWrapper />
    </MemoryRouter>
  );
};

test('renders Navbar for non-admin routes', () => {
  const { getByTestId } = renderWithRouter('/feed');
  expect(getByTestId('navbar')).toBeInTheDocument();
});

test('does not render Navbar for admin routes', () => {
  const { queryByTestId } = renderWithRouter('/admin');
  expect(queryByTestId('navbar')).not.toBeInTheDocument();
});
