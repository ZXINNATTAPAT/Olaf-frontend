import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import User from './User';

// Mock dependencies
const mockLogout = jest.fn();

jest.mock('../../shared/hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: { id: 1, username: 'testuser', email: 'test@test.com' }
  }))
}));

jest.mock('../../shared/hooks/useLogout', () => {
  return jest.fn(() => mockLogout);
});

test('renders User page with user data', () => {
  render(<User />);
  expect(screen.getByText('User Profile')).toBeInTheDocument();
  expect(screen.getByText('testuser')).toBeInTheDocument();
  expect(screen.getByText('test@test.com')).toBeInTheDocument();
});

test('renders logout button', () => {
  render(<User />);
  expect(screen.getByText('Logout')).toBeInTheDocument();
});

test('calls logout when logout button is clicked', async () => {
  render(<User />);
  const logoutButton = screen.getByText('Logout');
  fireEvent.click(logoutButton);
  
  await waitFor(() => {
    expect(mockLogout).toHaveBeenCalled();
  });
});

test('shows loading state when logging out', async () => {
  mockLogout.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
  
  render(<User />);
  const logoutButton = screen.getByText('Logout');
  fireEvent.click(logoutButton);
  
  await waitFor(() => {
    expect(screen.getByText('Logging out...')).toBeInTheDocument();
  });
});
