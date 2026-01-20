import ApiController from './ApiController';

// Mock AuthService
jest.mock('./AuthService', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getUserProfile: jest.fn()
  }
}));

import authService from './AuthService';

test('login delegates to AuthService', async () => {
  authService.login.mockResolvedValue({ id: 1, username: 'testuser' });
  const result = await ApiController.login({ email: 'test@test.com', password: 'password' });
  expect(result.success).toBe(true);
  expect(authService.login).toHaveBeenCalledWith('test@test.com', 'password');
});

test('register delegates to AuthService', async () => {
  authService.register.mockResolvedValue({ id: 1, username: 'testuser' });
  const userData = { email: 'test@test.com', password: 'password', username: 'testuser' };
  const result = await ApiController.register(userData);
  expect(result.success).toBe(true);
  expect(authService.register).toHaveBeenCalledWith(userData);
});

test('logout delegates to AuthService', async () => {
  authService.logout.mockResolvedValue();
  const result = await ApiController.logout();
  expect(result.success).toBe(true);
  expect(authService.logout).toHaveBeenCalled();
});

test('getUserProfile delegates to AuthService', async () => {
  authService.getUserProfile.mockResolvedValue({ id: 1, username: 'testuser' });
  const result = await ApiController.getUserProfile();
  expect(result.success).toBe(true);
  expect(authService.getUserProfile).toHaveBeenCalled();
});

test('handles login errors', async () => {
  authService.login.mockRejectedValue(new Error('Login failed'));
  const result = await ApiController.login({ email: 'test@test.com', password: 'wrong' });
  expect(result.success).toBe(false);
  expect(result.error).toBe('Login failed');
});
