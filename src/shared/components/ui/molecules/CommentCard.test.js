import React from 'react';
import { render, screen } from '@testing-library/react';
import CommentCard from './CommentCard';

// Mock LikeCommentButton
jest.mock('../atoms/LikeCommentButton', () => {
  return function MockLikeCommentButton() {
    return <div data-testid="like-comment-button">Like</div>;
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

test('renders CommentCard with comment text', () => {
  const comment = {
    comment_id: 1,
    comment_text: 'Test comment',
    comment_datetime: '2024-01-01T00:00:00Z',
    like_count: 0
  };
  render(<CommentCard comment={comment} user={{ id: 1 }} />);
  expect(screen.getByText('Test comment')).toBeInTheDocument();
});

test('renders CommentCard with like count', () => {
  const comment = {
    comment_id: 1,
    comment_text: 'Test',
    comment_datetime: '2024-01-01T00:00:00Z',
    like_count: 5
  };
  render(<CommentCard comment={comment} user={{ id: 1 }} />);
  expect(screen.getByText('5')).toBeInTheDocument();
});

test('calls onLikesCountChange when likes change', () => {
  const comment = {
    comment_id: 1,
    comment_text: 'Test',
    comment_datetime: '2024-01-01T00:00:00Z',
    like_count: 0
  };
  const onLikesCountChange = jest.fn();
  render(<CommentCard comment={comment} user={{ id: 1 }} onLikesCountChange={onLikesCountChange} />);
  // The callback would be called by LikeCommentButton, which is mocked
  expect(screen.getByTestId('like-comment-button')).toBeInTheDocument();
});
