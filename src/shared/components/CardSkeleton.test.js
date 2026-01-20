import React from 'react';
import { render } from '@testing-library/react';
import CardSkeleton from './CardSkeleton';

test('renders CardSkeleton with default type', () => {
  const { container } = render(<CardSkeleton />);
  expect(container.firstChild).toBeInTheDocument();
});

test('renders CardSkeleton with large type', () => {
  const { container } = render(<CardSkeleton type="large" />);
  expect(container.firstChild).toBeInTheDocument();
});

test('renders CardSkeleton with small type', () => {
  const { container } = render(<CardSkeleton type="small" />);
  expect(container.firstChild).toBeInTheDocument();
});
