import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

test('renders ProfileHeader with profile data', () => {
  const profileData = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe'
  };
  
  renderWithRouter(<ProfileHeader profileData={profileData} currentUserId={2} />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('@johndoe')).toBeInTheDocument();
});

test('renders edit button when user is owner', () => {
  const profileData = {
    id: 1,
    username: 'testuser'
  };
  
  renderWithRouter(<ProfileHeader profileData={profileData} currentUserId={1} />);
  expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  expect(screen.getByText('Write Post')).toBeInTheDocument();
});

test('does not render edit button when user is not owner', () => {
  const profileData = {
    id: 1,
    username: 'testuser'
  };
  
  renderWithRouter(<ProfileHeader profileData={profileData} currentUserId={2} />);
  expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument();
});
