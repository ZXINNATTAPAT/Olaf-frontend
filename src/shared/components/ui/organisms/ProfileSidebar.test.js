import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileSidebar from './ProfileSidebar';

// Mock dependencies
jest.mock('../../LazyImage', () => {
  return function MockLazyImage({ alt }) {
    return <img alt={alt} />;
  };
});

jest.mock('../../../services/CloudinaryService', () => ({
  getImageUrl: jest.fn((url) => url)
}));

test('renders ProfileSidebar with profile data', () => {
  const profileData = {
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    bio: 'Test bio'
  };
  
  render(<ProfileSidebar profileData={profileData} postsCount={5} />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('@johndoe')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument();
  expect(screen.getByText('Test bio')).toBeInTheDocument();
});

test('renders ProfileSidebar without bio', () => {
  const profileData = {
    username: 'testuser'
  };
  
  render(<ProfileSidebar profileData={profileData} postsCount={0} />);
  expect(screen.getByText('0')).toBeInTheDocument();
});
