import { API_ENDPOINTS, ERROR_MESSAGES, HTTP_STATUS } from './apiConstants';

test('API_ENDPOINTS contains AUTH endpoints', () => {
  expect(API_ENDPOINTS.AUTH).toBeDefined();
  expect(API_ENDPOINTS.AUTH.LOGIN).toBe('/auth/login/');
  expect(API_ENDPOINTS.AUTH.REGISTER).toBe('/auth/register/');
});

test('API_ENDPOINTS contains POSTS endpoints', () => {
  expect(API_ENDPOINTS.POSTS).toBeDefined();
  expect(API_ENDPOINTS.POSTS.BASE).toBe('/posts');
  expect(API_ENDPOINTS.POSTS.FEED).toBe('/posts/feed/');
});

test('API_ENDPOINTS.POSTS.BY_ID returns correct path', () => {
  expect(API_ENDPOINTS.POSTS.BY_ID(123)).toBe('/posts/123');
});

test('API_ENDPOINTS contains COMMENTS endpoints', () => {
  expect(API_ENDPOINTS.COMMENTS).toBeDefined();
  expect(API_ENDPOINTS.COMMENTS.BASE).toBe('/comments');
});

test('API_ENDPOINTS.COMMENTS.BY_POST returns correct path', () => {
  expect(API_ENDPOINTS.COMMENTS.BY_POST(123)).toBe('/comments?post=123');
});

test('ERROR_MESSAGES contains expected messages', () => {
  expect(ERROR_MESSAGES.NETWORK_ERROR).toBeDefined();
  expect(ERROR_MESSAGES.UNAUTHORIZED).toBeDefined();
  expect(ERROR_MESSAGES.FORBIDDEN).toBeDefined();
  expect(ERROR_MESSAGES.NOT_FOUND).toBeDefined();
});

test('HTTP_STATUS contains expected status codes', () => {
  expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
  expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
  expect(HTTP_STATUS.FORBIDDEN).toBe(403);
  expect(HTTP_STATUS.NOT_FOUND).toBe(404);
  expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
});
