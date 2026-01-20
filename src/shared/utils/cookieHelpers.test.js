import { checkCookies, logCookieStatus } from './cookieHelpers';

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: 'csrftoken=test-csrf-token; sessionid=test-session'
});

test('checkCookies returns cookie status', () => {
  const status = checkCookies();
  expect(status).toHaveProperty('allCookies');
  expect(status).toHaveProperty('hasCSRFToken');
  expect(status).toHaveProperty('cookieString');
});

test('checkCookies detects CSRF token', () => {
  const status = checkCookies();
  expect(status.hasCSRFToken).toBe(true);
});

test('logCookieStatus returns cookie status', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  const status = logCookieStatus();
  expect(status).toHaveProperty('allCookies');
  expect(consoleSpy).toHaveBeenCalled();
  consoleSpy.mockRestore();
});
