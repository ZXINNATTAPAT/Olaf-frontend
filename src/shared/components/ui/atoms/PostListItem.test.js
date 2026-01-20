import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PostListItem from './PostListItem';

// Mock LazyImage
jest.mock('../../LazyImage', () => {
  return function MockLazyImage({ alt }) {
    return <img alt={alt} data-testid="lazy-image" />;
  };
});

test('renders PostListItem with post data', () => {
  const post = {
    post_id: 1,
    header: 'Test Header',
    short: 'Test Short',
    post_datetime: '2024-01-01T00:00:00Z'
  };
  
  render(<PostListItem post={post} />);
  expect(screen.getByText('Test Header')).toBeInTheDocument();
  expect(screen.getByText('Test Short')).toBeInTheDocument();
});

test('calls onClick when item is clicked', () => {
  const post = {
    post_id: 1,
    header: 'Test',
    post_datetime: '2024-01-01T00:00:00Z'
  };
  const handleClick = jest.fn();
  render(<PostListItem post={post} onClick={handleClick} />);
  fireEvent.click(screen.getByText('Test').closest('article'));
  expect(handleClick).toHaveBeenCalled();
});

test('renders PostListItem with image', () => {
  const post = {
    post_id: 1,
    header: 'Test',
    post_datetime: '2024-01-01T00:00:00Z',
    image: 'https://example.com/image.jpg'
  };
  render(<PostListItem post={post} />);
  expect(screen.getByTestId('lazy-image')).toBeInTheDocument();
});

test('renders default description when short is missing', () => {
  const post = {
    post_id: 1,
    header: 'Test',
    post_datetime: '2024-01-01T00:00:00Z'
  };
  render(<PostListItem post={post} />);
  expect(screen.getByText('No description available.')).toBeInTheDocument();
});
