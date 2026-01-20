import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LazyImage from './LazyImage';

// Mock dependencies
const mockRef = { current: null };
jest.mock('../hooks/useIntersectionObserver', () => {
  return {
    __esModule: true,
    useIntersectionObserver: jest.fn(() => [mockRef, true, true]),
    default: jest.fn(() => [mockRef, true, true])
  };
});

jest.mock('../services/CloudinaryService', () => ({
  getImageUrl: jest.fn((url) => url || 'default-image.jpg')
}));

test('renders LazyImage with src and alt', async () => {
  render(<LazyImage src="test.jpg" alt="Test image" />);
  await waitFor(() => {
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
  });
});

test('renders LazyImage with className', async () => {
  const { container } = render(<LazyImage src="test.jpg" alt="Test" className="custom-class" />);
  await waitFor(() => {
    const img = container.querySelector('img');
    expect(img).toHaveClass('custom-class');
  });
});

test('renders LazyImage component', () => {
  const { container } = render(<LazyImage src="test.jpg" alt="Test" />);
  expect(container.firstChild).toBeInTheDocument();
});

test('calls onClick when image is clicked', async () => {
  const handleClick = jest.fn();
  render(<LazyImage src="test.jpg" alt="Test" onClick={handleClick} />);
  await waitFor(() => {
    const img = screen.getByAltText('Test');
    img.click();
    expect(handleClick).toHaveBeenCalled();
  });
});
