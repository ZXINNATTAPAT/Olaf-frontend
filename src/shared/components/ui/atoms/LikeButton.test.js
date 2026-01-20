import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LikeButton from './LikeButton';

// Mock dependencies
jest.mock('../../../hooks/useAuth', () => {
  return jest.fn(() => ({ user: { id: 1, username: 'testuser' } }));
});

jest.mock('../../../services/ApiController', () => ({
  likePost: jest.fn(),
  unlikePost: jest.fn()
}));

import ApiController from '../../../services/ApiController';

// Mock alert
global.alert = jest.fn();

test('renders LikeButton with initial likes count', () => {
  render(<LikeButton post_id={1} initialLikesCount={5} />);
  expect(screen.getByText('5')).toBeInTheDocument();
});

test('renders LikeButton with initial liked state', () => {
  const { container } = render(<LikeButton post_id={1} initialLiked={true} />);
  const button = container.querySelector('button');
  expect(button).toBeInTheDocument();
});

test('calls likePost when clicked and not liked', async () => {
  ApiController.likePost.mockResolvedValue({ success: true, data: { like_count: 6 } });
  
  render(<LikeButton post_id={1} initialLikesCount={5} initialLiked={false} />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  await waitFor(() => {
    expect(ApiController.likePost).toHaveBeenCalledWith(1, 1);
  });
});

test('shows alert when user is not logged in', () => {
  const mockUseAuth = require('../../../hooks/useAuth');
  mockUseAuth.default.mockReturnValueOnce({ user: null });
  
  render(<LikeButton post_id={1} />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  expect(global.alert).toHaveBeenCalledWith('You need to log in to like posts.');
});

test('calls onLikesCountChange when likes change', async () => {
  const onLikesCountChange = jest.fn();
  ApiController.likePost.mockResolvedValue({ success: true, data: { like_count: 6 } });
  
  render(
    <LikeButton 
      post_id={1} 
      initialLikesCount={5}
      onLikesCountChange={onLikesCountChange}
    />
  );
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  await waitFor(() => {
    expect(onLikesCountChange).toHaveBeenCalled();
  });
});
