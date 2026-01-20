import React from 'react';
import { render, screen } from '@testing-library/react';
import Label from './Label';

test('renders Label with children', () => {
  render(<Label htmlFor="test">Test Label</Label>);
  expect(screen.getByText('Test Label')).toBeInTheDocument();
});

test('renders Label with htmlFor attribute', () => {
  const { container } = render(<Label htmlFor="test-input">Label</Label>);
  const label = container.querySelector('label');
  // React converts htmlFor to for attribute in DOM
  expect(label.getAttribute('for')).toBe('test-input');
});

test('renders Label with custom className', () => {
  const { container } = render(<Label htmlFor="test" className="custom-class">Label</Label>);
  expect(container.querySelector('label')).toHaveClass('custom-class');
});
