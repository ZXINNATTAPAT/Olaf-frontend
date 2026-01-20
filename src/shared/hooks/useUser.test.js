import { renderHook } from '@testing-library/react';
import useUser from './useUser';

// Mock dependencies
const mockSetUser = jest.fn();
const mockAxiosInstance = { get: jest.fn() };

jest.mock('./useAuth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    setUser: mockSetUser
  }))
}));

jest.mock('../services/httpClient', () => {
  return jest.fn(() => mockAxiosInstance);
});

test('returns getUser function', () => {
  const { result } = renderHook(() => useUser());
  expect(typeof result.current).toBe('function');
});

test('getUser calls API and updates user', async () => {
  mockAxiosInstance.get.mockResolvedValue({
    data: { id: 1, username: 'testuser' }
  });
  
  const { result } = renderHook(() => useUser());
  await result.current();
  
  expect(mockAxiosInstance.get).toHaveBeenCalledWith('auth/user');
  expect(mockSetUser).toHaveBeenCalledWith({ id: 1, username: 'testuser' });
});
