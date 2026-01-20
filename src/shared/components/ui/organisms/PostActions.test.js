import React from 'react';
import { render } from '@testing-library/react';
import PostActions from './PostActions';

// Mock dependencies
jest.mock('../atoms/LikeButton', () => {
  return function MockLikeButton() {
    return <div data-testid="like-button">Like</div>;
  };
});

jest.mock('../../../hooks/shares/ShareButtons', () => {
  return function MockShareButtons() {
    return <div data-testid="share-buttons">Share</div>;
  };
});

jest.mock('../molecules/PostMenuDropdown', () => {
  return function MockPostMenuDropdown() {
    return <div data-testid="post-menu">Menu</div>;
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => 'false'),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

test('renders PostActions component', () => {
  const post = {
    post_id: 1,
    header: 'Test Post',
    like_count: 5
  };
  const user = { id: 1 };
  
  const { getByTestId } = render(
    <PostActions post={post} user={user} />
  );
  
  expect(getByTestId('like-button')).toBeInTheDocument();
  expect(getByTestId('share-buttons')).toBeInTheDocument();
  expect(getByTestId('post-menu')).toBeInTheDocument();
});
