import React from 'react';
import { render } from '@testing-library/react';
import ShareButtons from './ShareButtons';

test('renders ShareButtons component', () => {
  const { container } = render(<ShareButtons url="https://example.com" title="Test Title" />);
  expect(container.firstChild).toBeInTheDocument();
});

test('renders ShareButtons with url and title', () => {
  const { container } = render(<ShareButtons url="https://test.com" title="Test" />);
  expect(container.firstChild).toBeInTheDocument();
});
