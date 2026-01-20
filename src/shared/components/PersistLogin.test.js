import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PersistLogin from './PersistLogin';

// Mock dependencies
const mockSetUser = jest.fn();
const mockSetInitializing = jest.fn();

jest.mock('../hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: {},
    setUser: mockSetUser,
    setInitializing: mockSetInitializing
  }))
}));

jest.mock('../services/AuthService', () => ({
  getUserProfile: jest.fn()
}));

import authService from '../services/AuthService';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

test('renders PersistLogin component', () => {
  authService.getUserProfile.mockResolvedValue({ id: 1, username: 'testuser' });
  const { container } = renderWithRouter(<PersistLogin />);
  expect(container.firstChild).toBeInTheDocument();
});

test('verifies user when component mounts', async () => {
  authService.getUserProfile.mockResolvedValue({ id: 1, username: 'testuser' });
  renderWithRouter(<PersistLogin />);
  // Wait for async operation
  await new Promise(resolve => setTimeout(resolve, 100));
  expect(authService.getUserProfile).toHaveBeenCalled();
});
