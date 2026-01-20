import React from 'react';
import { render } from '@testing-library/react';
import ArticleSkeleton from './ArticleSkeleton';

test('renders ArticleSkeleton component', () => {
  const { container } = render(<ArticleSkeleton />);
  expect(container.firstChild).toBeInTheDocument();
});
