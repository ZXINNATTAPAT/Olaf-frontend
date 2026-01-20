import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

test('renders Input with placeholder', () => {
  render(<Input placeholder="Enter text" />);
  expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
});

test('renders Input with value', () => {
  render(<Input value="test value" onChange={() => {}} />);
  expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
});

test('calls onChange when input changes', () => {
  const handleChange = jest.fn();
  render(<Input value="" onChange={handleChange} />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'test' } });
  expect(handleChange).toHaveBeenCalled();
});

test('renders Input with id', () => {
  const { container } = render(<Input id="test-input" />);
  expect(container.querySelector('#test-input')).toBeInTheDocument();
});

test('renders Input with required attribute', () => {
  const { container } = render(<Input required />);
  expect(container.querySelector('input')).toBeRequired();
});

test('renders Input with invalid state', () => {
  const { container } = render(<Input invalid />);
  expect(container.querySelector('input')).toHaveClass('border-red-500');
});

test('renders Input with custom className', () => {
  const { container } = render(<Input className="custom-class" />);
  expect(container.querySelector('input')).toHaveClass('custom-class');
});

test('renders Input with different types', () => {
  const { container: emailContainer } = render(<Input type="email" />);
  expect(emailContainer.querySelector('input')).toHaveAttribute('type', 'email');
  
  const { container: passwordContainer } = render(<Input type="password" />);
  expect(passwordContainer.querySelector('input')).toHaveAttribute('type', 'password');
});
