import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostMenuDropdown from './PostMenuDropdown';

// Mock dependencies
jest.mock('../../../hooks/useAuth', () => {
  return jest.fn(() => ({ user: { id: 1 } }));
});

jest.mock('../../../services/ApiController', () => ({
  deletePost: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

import ApiController from '../../../services/ApiController';

global.window.confirm = jest.fn(() => true);
global.alert = jest.fn();

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

test('renders PostMenuDropdown when user is owner', () => {
  const post = { post_id: 1, user: { id: 1 } };
  renderWithRouter(<PostMenuDropdown post={post} />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

test('does not render PostMenuDropdown when user is not owner', () => {
  const post = { post_id: 1, user: { id: 2 } };
  renderWithRouter(<PostMenuDropdown post={post} />);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('opens dropdown when clicked', () => {
  const post = { post_id: 1, user: { id: 1 } };
  renderWithRouter(<PostMenuDropdown post={post} />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(screen.getByText('Edit')).toBeInTheDocument();
});
