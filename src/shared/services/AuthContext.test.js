import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthContextProvider } from './AuthContext';
import useAuth from '../hooks/useAuth';

test('AuthContextProvider provides context values', () => {
  const TestComponent = () => {
    const { user } = useAuth();
    return <div>{user?.username || 'No user'}</div>;
  };
  
  render(
    <AuthContextProvider>
      <TestComponent />
    </AuthContextProvider>
  );
  
  expect(screen.getByText('No user')).toBeInTheDocument();
});

test('AuthContextProvider initializes with empty user', () => {
  const TestComponent = () => {
    const { user } = useAuth();
    return <div>{user && Object.keys(user).length === 0 ? 'Empty' : 'Has user'}</div>;
  };
  
  render(
    <AuthContextProvider>
      <TestComponent />
    </AuthContextProvider>
  );
  
  expect(screen.getByText('Empty')).toBeInTheDocument();
});
