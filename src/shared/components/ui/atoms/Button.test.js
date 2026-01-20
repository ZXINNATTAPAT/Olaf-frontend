import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders Button with children', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('renders Button with primary variant by default', () => {
  const { container } = render(<Button>Test</Button>);
  expect(container.querySelector('button')).toHaveClass('bg-black');
});

test('renders Button with secondary variant', () => {
  const { container } = render(<Button variant="secondary">Test</Button>);
  expect(container.querySelector('button')).toHaveClass('bg-white');
});

test('renders Button with outline variant', () => {
  const { container } = render(<Button variant="outline">Test</Button>);
  expect(container.querySelector('button')).toHaveClass('border-2');
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  fireEvent.click(screen.getByText('Click'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('renders disabled Button', () => {
  const { container } = render(<Button disabled>Disabled</Button>);
  expect(container.querySelector('button')).toBeDisabled();
});

test('renders Button with custom className', () => {
  const { container } = render(<Button className="custom-class">Test</Button>);
  expect(container.querySelector('button')).toHaveClass('custom-class');
});

test('renders Button with custom type', () => {
  const { container } = render(<Button type="submit">Submit</Button>);
  expect(container.querySelector('button')).toHaveAttribute('type', 'submit');
});
