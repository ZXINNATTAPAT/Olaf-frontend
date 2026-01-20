import ApiErrorHandler from './ApiErrorHandler';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/apiConstants';

// Mock console.error
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

test('handleError returns network error when no response', () => {
  const error = { code: 'ECONNABORTED' };
  const result = ApiErrorHandler.handleError(error);
  expect(result.code).toBe('TIMEOUT');
  expect(result.message).toBe(ERROR_MESSAGES.TIMEOUT_ERROR);
});

test('handleError returns network error for network failures', () => {
  const error = {};
  const result = ApiErrorHandler.handleError(error);
  expect(result.code).toBe('NETWORK_ERROR');
  expect(result.message).toBe(ERROR_MESSAGES.NETWORK_ERROR);
});

test('handleError returns unauthorized error for 401', () => {
  const error = {
    response: {
      status: HTTP_STATUS.UNAUTHORIZED,
      data: {}
    }
  };
  const result = ApiErrorHandler.handleError(error);
  expect(result.code).toBe('UNAUTHORIZED');
  expect(result.message).toBe(ERROR_MESSAGES.UNAUTHORIZED);
});

test('handleError returns forbidden error for 403', () => {
  const error = {
    response: {
      status: HTTP_STATUS.FORBIDDEN,
      data: {}
    }
  };
  const result = ApiErrorHandler.handleError(error);
  expect(result.code).toBe('FORBIDDEN');
  expect(result.message).toBe(ERROR_MESSAGES.FORBIDDEN);
});

test('handleError returns not found error for 404', () => {
  const error = {
    response: {
      status: HTTP_STATUS.NOT_FOUND,
      data: {}
    }
  };
  const result = ApiErrorHandler.handleError(error);
  expect(result.code).toBe('NOT_FOUND');
  expect(result.message).toBe(ERROR_MESSAGES.NOT_FOUND);
});

test('handleError returns validation error for 400', () => {
  const error = {
    response: {
      status: HTTP_STATUS.BAD_REQUEST,
      data: { detail: 'Validation error' }
    }
  };
  const result = ApiErrorHandler.handleError(error);
  expect(result.code).toBe('VALIDATION_ERROR');
});

consoleErrorSpy.mockRestore();
