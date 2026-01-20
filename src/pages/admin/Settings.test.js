import React from 'react';
import { render, screen } from '@testing-library/react';
import Settings from './Settings';

// Mock AdminLayout
jest.mock('../../shared/components/admin/AdminLayout', () => {
  return function MockAdminLayout({ children }) {
    return <div data-testid="admin-layout">{children}</div>;
  };
});

test('renders Settings page', () => {
  render(<Settings />);
  expect(screen.getByText('Settings')).toBeInTheDocument();
  expect(screen.getByText('Configure admin panel settings')).toBeInTheDocument();
});

test('renders Settings placeholder content', () => {
  render(<Settings />);
  expect(screen.getByText('Settings Panel')).toBeInTheDocument();
});
