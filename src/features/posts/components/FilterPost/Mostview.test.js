import React from 'react';
import { render, screen } from '@testing-library/react';
import Mostview from './Mostview';

test('renders Mostview component', () => {
  render(<Mostview />);
  const authorElements = screen.getAllByText('Nattapat Phungphugdee');
  expect(authorElements.length).toBeGreaterThan(0);
});

test('renders Mostview with post title', () => {
  render(<Mostview />);
  const titleElements = screen.getAllByText('5 amazing new JavaScript features in ES15 (2024)');
  expect(titleElements.length).toBeGreaterThan(0);
});

test('renders Mostview with images', () => {
  const { container } = render(<Mostview />);
  const images = container.querySelectorAll('img');
  expect(images.length).toBeGreaterThan(0);
});
