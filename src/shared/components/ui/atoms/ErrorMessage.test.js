import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

test('renders ErrorMessage when message is provided', () => {
  render(<ErrorMessage message="Test error" />);
  expect(screen.getByText('Test error')).toBeInTheDocument();
});

test('does not render ErrorMessage when message is empty', () => {
  const { container } = render(<ErrorMessage message="" />);
  expect(container.firstChild).toBeNull();
});

test('does not render ErrorMessage when message is null', () => {
  const { container } = render(<ErrorMessage message={null} />);
  expect(container.firstChild).toBeNull();
});

test('renders ErrorMessage with custom className', () => {
  const { container } = render(<ErrorMessage message="Test" className="custom-class" />);
  expect(container.firstChild).toHaveClass('custom-class');
});
