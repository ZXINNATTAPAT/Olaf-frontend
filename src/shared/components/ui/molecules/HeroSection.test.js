import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HeroSection from './HeroSection';

// Mock useAuth
const mockUseAuth = jest.fn();
jest.mock('../../../hooks/useAuth', () => {
  return function useAuth() {
    return mockUseAuth();
  };
});

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

beforeEach(() => {
  mockUseAuth.mockReturnValue({ user: { email: null } });
  mockNavigate.mockClear();
});

test('renders HeroSection component', () => {
  renderWithRouter(<HeroSection />);
  expect(screen.getByText('OLAF.')).toBeInTheDocument();
  expect(screen.getByText('Start Writing')).toBeInTheDocument();
});

test('renders hero text', () => {
  renderWithRouter(<HeroSection />);
  expect(screen.getByText(/Put your story ideas into words/)).toBeInTheDocument();
});

test('navigates to login when user is not logged in', () => {
  renderWithRouter(<HeroSection />);
  const button = screen.getByText('Start Writing');
  button.click();
  expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
});

test('navigates to feed when user is logged in', () => {
  mockUseAuth.mockReturnValue({ user: { email: 'test@example.com' } });
  renderWithRouter(<HeroSection />);
  const button = screen.getByText('Start Writing');
  button.click();
  expect(mockNavigate).toHaveBeenCalledWith('/feed');
});
