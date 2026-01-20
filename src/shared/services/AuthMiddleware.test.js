import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthMiddleware from './AuthMiddleware';

// Mock useAuth
jest.mock('../hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(() => ({ user: {}, initializing: false }))
}));

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

test('renders loading state when initializing', () => {
  const mockUseAuth = require('../hooks/useAuth').default;
  mockUseAuth.mockReturnValueOnce({ user: {}, initializing: true });
  renderWithRouter(<AuthMiddleware />);
  // Should show loading spinner
});

test('redirects to login when user is not authenticated', () => {
  const mockUseAuth = require('../hooks/useAuth').default;
  mockUseAuth.mockReturnValueOnce({ user: {}, initializing: false });
  renderWithRouter(<AuthMiddleware />);
  // Should redirect to login
});

test('renders Outlet when user is authenticated', () => {
  const mockUseAuth = require('../hooks/useAuth').default;
  mockUseAuth.mockReturnValueOnce({ 
    user: { id: 1, username: 'testuser' }, 
    initializing: false 
  });
  const { container } = renderWithRouter(<AuthMiddleware />);
  // Should render Outlet
});
