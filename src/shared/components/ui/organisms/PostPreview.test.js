import React from 'react';
import { render, screen } from '@testing-library/react';
import PostPreview from './PostPreview';

// Mock dependencies
jest.mock('../../LazyImage', () => {
  return function MockLazyImage({ alt }) {
    return <img alt={alt} />;
  };
});

jest.mock('../../../services/CloudinaryService', () => ({
  getImageUrl: jest.fn((url) => url)
}));

test('renders PostPreview with formData', () => {
  const formData = {
    header: 'Test Header',
    short: 'Test Short',
    post_text: '<p>Test content</p>'
  };
  const user = { username: 'testuser' };
  
  render(<PostPreview formData={formData} user={user} />);
  expect(screen.getByText('Test Header')).toBeInTheDocument();
  expect(screen.getByText('Test Short')).toBeInTheDocument();
});

test('renders PostPreview with default values', () => {
  render(<PostPreview formData={{}} user={{}} />);
  expect(screen.getByText('Post Header')).toBeInTheDocument();
});
