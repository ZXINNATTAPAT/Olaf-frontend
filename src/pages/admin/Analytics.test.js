import React from 'react';
import { render, screen } from '@testing-library/react';
import Analytics from './Analytics';

// Mock AdminLayout
jest.mock('../../shared/components/admin/AdminLayout', () => {
  return function MockAdminLayout({ children }) {
    return <div data-testid="admin-layout">{children}</div>;
  };
});

test('renders Analytics page', () => {
  render(<Analytics />);
  expect(screen.getByText('Analytics')).toBeInTheDocument();
  expect(screen.getByText('Blog performance and statistics')).toBeInTheDocument();
});

test('renders Analytics placeholder content', () => {
  render(<Analytics />);
  expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
});
