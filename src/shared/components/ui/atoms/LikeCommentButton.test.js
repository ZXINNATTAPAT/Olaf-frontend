import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LikeCommentButton from './LikeCommentButton';

// Mock dependencies
jest.mock('../../../hooks/useAuth', () => {
  return jest.fn(() => ({ user: { id: 1, username: 'testuser' } }));
});

jest.mock('../../../services/ApiController', () => ({
  likeComment: jest.fn(),
  unlikeComment: jest.fn()
}));

import ApiController from '../../../services/ApiController';

// Mock alert
global.alert = jest.fn();

test('renders LikeCommentButton with initial likes count', () => {
  render(<LikeCommentButton comment_id={1} initialLikesCount={3} />);
  expect(screen.getByText('3')).toBeInTheDocument();
});

test('calls likeComment when clicked and not liked', async () => {
  ApiController.likeComment.mockResolvedValue({ success: true, data: { like_count: 4 } });
  
  render(<LikeCommentButton comment_id={1} initialLikesCount={3} initialLiked={false} />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  await waitFor(() => {
    expect(ApiController.likeComment).toHaveBeenCalledWith(1, 1);
  });
});

test('shows alert when user is not logged in', () => {
  const mockUseAuth = require('../../../hooks/useAuth');
  mockUseAuth.default.mockReturnValueOnce({ user: null });
  
  render(<LikeCommentButton comment_id={1} />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  expect(global.alert).toHaveBeenCalledWith('You need to log in to like comments.');
});

test('calls onLikesCountChange when likes change', async () => {
  const onLikesCountChange = jest.fn();
  ApiController.likeComment.mockResolvedValue({ success: true, data: { like_count: 4 } });
  
  render(
    <LikeCommentButton 
      comment_id={1} 
      initialLikesCount={3}
      onLikesCountChange={onLikesCountChange}
    />
  );
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  await waitFor(() => {
    expect(onLikesCountChange).toHaveBeenCalled();
  });
});
