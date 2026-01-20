import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

test('renders SearchBar with default placeholder', () => {
  render(<SearchBar value="" onChange={() => {}} />);
  expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
});

test('renders SearchBar with custom placeholder', () => {
  render(<SearchBar value="" onChange={() => {}} placeholder="Custom search" />);
  expect(screen.getByPlaceholderText('Custom search')).toBeInTheDocument();
});

test('renders SearchBar with value', () => {
  render(<SearchBar value="test query" onChange={() => {}} />);
  expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
});

test('calls onChange when input changes', () => {
  const handleChange = jest.fn();
  render(<SearchBar value="" onChange={handleChange} />);
  const input = screen.getByPlaceholderText('Search...');
  fireEvent.change(input, { target: { value: 'test' } });
  expect(handleChange).toHaveBeenCalled();
});
