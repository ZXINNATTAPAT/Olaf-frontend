import React from 'react';
import { render } from '@testing-library/react';
import ProfileSkeleton from './ProfileSkeleton';

test('renders ProfileSkeleton with default count', () => {
  const { container } = render(<ProfileSkeleton />);
  expect(container.firstChild).toBeInTheDocument();
});

test('renders ProfileSkeleton with custom count', () => {
  const { container } = render(<ProfileSkeleton count={3} />);
  expect(container.firstChild).toBeInTheDocument();
});
