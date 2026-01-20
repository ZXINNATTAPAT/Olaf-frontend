import { renderHook } from '@testing-library/react';
import useRefreshToken from './useRefreshToken';

// Mock dependencies
const mockSetAccessToken = jest.fn();
const mockSetCSRFToken = jest.fn();

jest.mock('../services/httpClient', () => ({
  __esModule: true,
  default: {
    post: jest.fn()
  }
}));

const mockAxiosInstance = require('../services/httpClient').default;

jest.mock('./useAuth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    setAccessToken: mockSetAccessToken,
    setCSRFToken: mockSetCSRFToken
  }))
}));

test('returns refresh function', () => {
  const { result } = renderHook(() => useRefreshToken());
  expect(typeof result.current).toBe('function');
});

test('calls refresh endpoint and updates tokens', async () => {
  mockAxiosInstance.post.mockResolvedValue({
    data: { access: 'new-token' },
    headers: { 'x-csrftoken': 'csrf-token' }
  });
  
  const { result } = renderHook(() => useRefreshToken());
  await result.current();
  
  expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/refresh/', {}, { withCredentials: true });
  expect(mockSetAccessToken).toHaveBeenCalledWith('new-token');
  expect(mockSetCSRFToken).toHaveBeenCalledWith('csrf-token');
});
