import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PullUsers from './Pullusers';

// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('renders loading state initially', () => {
  render(<PullUsers ids={1} />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('renders user name when user is found', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: 1, first_name: 'John', last_name: 'Doe' })
  });

  render(<PullUsers ids={1} />);
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

test('renders "User not found" when user is not found', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: 2, first_name: 'Jane', last_name: 'Doe' })
  });

  render(<PullUsers ids={1} />);
  
  await waitFor(() => {
    expect(screen.getByText('User not found')).toBeInTheDocument();
  });
});

test('handles fetch error', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'));

  render(<PullUsers ids={1} />);
  
  await waitFor(() => {
    expect(screen.getByText('User not found')).toBeInTheDocument();
  });
});
