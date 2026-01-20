import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from './PostCard';

// Mock LazyImage
jest.mock('../../index', () => {
  const React = require('react');
  return {
    LazyImage: ({ alt }) => React.createElement('img', { alt, 'data-testid': 'lazy-image' })
  };
});

test('renders PostCard with post data', () => {
  const post = {
    post_id: 1,
    header: 'Test Header',
    short: 'Test Short',
    post_datetime: '2024-01-01T00:00:00Z',
    topic: 'Technology',
    user: 'testuser'
  };
  
  render(<PostCard post={post} />);
  expect(screen.getByText('Test Header')).toBeInTheDocument();
  expect(screen.getByText('Test Short')).toBeInTheDocument();
});

test('calls onClick when card is clicked', () => {
  const post = {
    post_id: 1,
    header: 'Test',
    post_datetime: '2024-01-01T00:00:00Z',
    topic: 'Tech',
    user: 'testuser'
  };
  const handleClick = jest.fn();
  const { container } = render(<PostCard post={post} onClick={handleClick} />);
  const article = container.querySelector('article');
  fireEvent.click(article);
  expect(handleClick).toHaveBeenCalled();
});

test('renders PostCard with image', () => {
  const post = {
    post_id: 1,
    header: 'Test',
    post_datetime: '2024-01-01T00:00:00Z',
    image: 'https://example.com/image.jpg',
    topic: 'Tech',
    user: 'testuser'
  };
  render(<PostCard post={post} />);
  expect(screen.getByTestId('lazy-image')).toBeInTheDocument();
});

test('renders PostCard without image', () => {
  const post = {
    post_id: 1,
    header: 'Test',
    post_datetime: '2024-01-01T00:00:00Z',
    topic: 'Tech',
    user: 'testuser'
  };
  render(<PostCard post={post} />);
  expect(screen.queryByTestId('lazy-image')).not.toBeInTheDocument();
});
