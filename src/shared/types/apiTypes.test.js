import { ApiResponse, ApiError, LoginCredentials } from './apiTypes';

test('ApiResponse structure is defined', () => {
  expect(ApiResponse).toBeDefined();
  expect(typeof ApiResponse).toBe('object');
});

test('ApiError structure is defined', () => {
  expect(ApiError).toBeDefined();
  expect(typeof ApiError).toBe('object');
});

test('LoginCredentials structure is defined', () => {
  expect(LoginCredentials).toBeDefined();
  expect(typeof LoginCredentials).toBe('object');
});
