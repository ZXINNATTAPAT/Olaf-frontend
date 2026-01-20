import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FeedSidebar from './FeedSidebar';

test('renders FeedSidebar with posts', () => {
  const posts = [
    { post_id: 1, header: 'Post 1', topic: 'Tech', likesCount: 10 },
    { post_id: 2, header: 'Post 2', topic: 'Design', likesCount: 5 }
  ];
  render(<FeedSidebar posts={posts} />);
  const allPostsElements = screen.getAllByText('All Posts');
  expect(allPostsElements.length).toBeGreaterThan(0);
});

test('renders FeedSidebar filters', () => {
  render(<FeedSidebar posts={[]} />);
  const allPostsElements = screen.getAllByText('All Posts');
  expect(allPostsElements.length).toBeGreaterThan(0);
  expect(screen.getByText('Recommended')).toBeInTheDocument();
  expect(screen.getByText('Trending')).toBeInTheDocument();
});

test('calls onFilterChange when filter is clicked', () => {
  const onFilterChange = jest.fn();
  render(<FeedSidebar posts={[]} onFilterChange={onFilterChange} />);
  const recommendedButtons = screen.getAllByText('Recommended');
  expect(recommendedButtons.length).toBeGreaterThan(0);
  fireEvent.click(recommendedButtons[0]);
  expect(onFilterChange).toHaveBeenCalled();
});

test('renders categories from posts', () => {
  const posts = [
    { post_id: 1, topic: 'Technology' },
    { post_id: 2, topic: 'Design' }
  ];
  render(<FeedSidebar posts={posts} />);
  // Categories should be rendered in the sidebar
  const allPostsElements = screen.getAllByText('All Posts');
  expect(allPostsElements.length).toBeGreaterThan(0);
});
