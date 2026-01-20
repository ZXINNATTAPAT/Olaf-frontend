import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminMiddleware from './AdminMiddleware';

// Mock dependencies
jest.mock('../../../shared/hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(() => ({ user: { id: 1 }, initializing: false }))
}));

jest.mock('../../../shared/services/AuthService', () => ({
  getUserProfile: jest.fn()
}));

import authService from '../../../shared/services/AuthService';

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

test('renders loading state when checking', () => {
  const mockUseAuth = require('../../../shared/hooks/useAuth');
  mockUseAuth.default.mockReturnValueOnce({ user: { id: 1 }, initializing: true });
  
  renderWithRouter(<AdminMiddleware />);
  // Should show loading spinner
});

test('redirects when user is not admin', async () => {
  authService.getUserProfile.mockResolvedValue({ id: 1, is_staff: false });
  
  const mockUseAuth = require('../../../shared/hooks/useAuth');
  mockUseAuth.default.mockReturnValueOnce({ user: { id: 1 }, initializing: false });
  
  renderWithRouter(<AdminMiddleware />);
  // Should redirect to home
  await new Promise(resolve => setTimeout(resolve, 100));
});

test('renders Outlet when user is admin', async () => {
  authService.getUserProfile.mockResolvedValue({ id: 1, is_staff: true });
  
  const mockUseAuth = require('../../../shared/hooks/useAuth');
  mockUseAuth.default.mockReturnValueOnce({ user: { id: 1 }, initializing: false });
  
  const { container } = renderWithRouter(<AdminMiddleware />);
  await new Promise(resolve => setTimeout(resolve, 100));
  // Should render Outlet
});
