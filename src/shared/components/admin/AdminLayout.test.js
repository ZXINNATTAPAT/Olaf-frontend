import React from 'react';
import { render } from '@testing-library/react';
import AdminLayout from './AdminLayout';

// Mock AdminSidebar
jest.mock('./AdminSidebar', () => {
  return function MockAdminSidebar() {
    return <div data-testid="admin-sidebar">Admin Sidebar</div>;
  };
});

test('renders AdminLayout with children', () => {
  const { container, getByTestId } = render(
    <AdminLayout>
      <div>Test Content</div>
    </AdminLayout>
  );
  expect(getByTestId('admin-sidebar')).toBeInTheDocument();
  expect(container.textContent).toContain('Test Content');
});
