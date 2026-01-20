import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FeedHeader from './FeedHeader';

// Mock SearchBar
jest.mock('../molecules/SearchBar', () => {
  const React = require('react');
  return React.forwardRef(({ value, onChange, placeholder }, ref) => (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid="search-input"
    />
  ));
});

test('renders FeedHeader with default title', () => {
  render(<FeedHeader />);
  expect(screen.getByText('FEED')).toBeInTheDocument();
});

test('renders FeedHeader with custom title', () => {
  render(<FeedHeader title="Custom Title" />);
  expect(screen.getByText('Custom Title')).toBeInTheDocument();
});

test('renders FeedHeader with search bar when onSearchChange is provided', () => {
  render(<FeedHeader onSearchChange={() => {}} />);
  expect(screen.getByTestId('search-input')).toBeInTheDocument();
});

test('does not render search bar when onSearchChange is not provided', () => {
  render(<FeedHeader />);
  expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();
});

test('calls onSearchChange when search input changes', () => {
  const handleSearchChange = jest.fn();
  render(<FeedHeader onSearchChange={handleSearchChange} />);
  const input = screen.getByTestId('search-input');
  fireEvent.change(input, { target: { value: 'test' } });
  expect(handleSearchChange).toHaveBeenCalledWith('test');
});
