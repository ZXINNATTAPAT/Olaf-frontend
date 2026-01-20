import React from 'react';
import { render, screen } from '@testing-library/react';
import PostHeader from './PostHeader';

// Mock PostMenuDropdown
jest.mock('../molecules/PostMenuDropdown', () => {
  return function MockPostMenuDropdown() {
    return <div data-testid="post-menu">Menu</div>;
  };
});

test('renders PostHeader with post data', () => {
  const post = {
    post_id: 1,
    header: 'Test Header',
    short: 'Test Short',
    post_datetime: '2024-01-01T00:00:00Z',
    user: {
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe'
    }
  };
  
  render(<PostHeader post={post} likesCount={5} commentsCount={3} />);
  expect(screen.getByText('Test Header')).toBeInTheDocument();
  expect(screen.getByText('Test Short')).toBeInTheDocument();
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
});

test('renders PostHeader with Unknown Author when user is missing', () => {
  const post = {
    post_id: 1,
    header: 'Test',
    short: 'Test',
    post_datetime: '2024-01-01T00:00:00Z'
  };
  
  render(<PostHeader post={post} likesCount={0} commentsCount={0} />);
  expect(screen.getByText('Unknown Author')).toBeInTheDocument();
});
