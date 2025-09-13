// API Error Handler - Centralized error handling for the entire project
import React from 'react';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/apiConstants';

class ApiErrorHandler {
  /**
   * Handle API errors and return user-friendly messages
   */
  static handleError(error) {
    console.error('API Error:', error);

    // Network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return {
          message: ERROR_MESSAGES.TIMEOUT_ERROR,
          code: 'TIMEOUT',
          status: 408,
          originalError: error
        };
      }
      return {
        message: ERROR_MESSAGES.NETWORK_ERROR,
        code: 'NETWORK_ERROR',
        status: 0,
        originalError: error
      };
    }

    const { status, data } = error.response;
    let message = ERROR_MESSAGES.UNKNOWN_ERROR;
    let code = 'UNKNOWN_ERROR';

    // Handle different HTTP status codes
    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        message = this.handleValidationError(data) || ERROR_MESSAGES.VALIDATION_ERROR;
        code = 'VALIDATION_ERROR';
        break;
      case HTTP_STATUS.UNAUTHORIZED:
        message = ERROR_MESSAGES.UNAUTHORIZED;
        code = 'UNAUTHORIZED';
        break;
      case HTTP_STATUS.FORBIDDEN:
        message = ERROR_MESSAGES.FORBIDDEN;
        code = 'FORBIDDEN';
        break;
      case HTTP_STATUS.NOT_FOUND:
        message = ERROR_MESSAGES.NOT_FOUND;
        code = 'NOT_FOUND';
        break;
      case HTTP_STATUS.CONFLICT:
        message = this.handleConflictError(data) || 'Resource already exists';
        code = 'CONFLICT';
        break;
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        message = this.handleValidationError(data) || ERROR_MESSAGES.VALIDATION_ERROR;
        code = 'VALIDATION_ERROR';
        break;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        message = ERROR_MESSAGES.SERVER_ERROR;
        code = 'SERVER_ERROR';
        break;
      default:
        message = data?.message || data?.detail || ERROR_MESSAGES.UNKNOWN_ERROR;
        code = 'HTTP_ERROR';
    }

    return {
      message,
      code,
      status,
      data,
      originalError: error
    };
  }

  /**
   * Handle validation errors from the API
   */
  static handleValidationError(data) {
    if (!data) return null;

    // Handle Django REST framework validation errors
    if (data.non_field_errors) {
      return data.non_field_errors[0];
    }

    // Handle field-specific errors
    const fieldErrors = Object.keys(data).filter(key => Array.isArray(data[key]));
    if (fieldErrors.length > 0) {
      const firstField = fieldErrors[0];
      const firstError = data[firstField][0];
      return `${firstField}: ${firstError}`;
    }

    // Handle simple error messages
    if (typeof data === 'string') {
      return data;
    }

    if (data.message) {
      return data.message;
    }

    if (data.detail) {
      return data.detail;
    }

    return null;
  }

  /**
   * Handle conflict errors (409)
   */
  static handleConflictError(data) {
    if (!data) return null;

    if (typeof data === 'string') {
      return data;
    }

    if (data.message) {
      return data.message;
    }

    if (data.detail) {
      return data.detail;
    }

    return 'Resource already exists';
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error) {
    if (!error.response) {
      // Network errors are retryable
      return true;
    }

    const status = error.response.status;
    
    // Retry on these status codes
    const retryableStatuses = [
      HTTP_STATUS.INTERNAL_SERVER_ERROR, // 500
      502, // Bad Gateway
      503, // Service Unavailable
      504, // Gateway Timeout
    ];

    return retryableStatuses.includes(status);
  }

  /**
   * Get retry delay based on error type
   */
  static getRetryDelay(error, attempt) {
    const baseDelay = 1000; // 1 second
    const maxDelay = 10000; // 10 seconds
    
    // Exponential backoff with jitter
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
    const jitter = Math.random() * 1000; // Add up to 1 second of jitter
    
    return delay + jitter;
  }

  /**
   * Log error for debugging
   */
  static logError(error, context = {}) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      ...(error.response && {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      }),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 API Error');
      console.error('Error Details:', errorInfo);
      console.groupEnd();
    }

    // Here you could also send to error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  /**
   * Show user-friendly error notification
   */
  static showErrorNotification(error, options = {}) {
    const {
      showToast = true
    } = options;

    const errorInfo = this.handleError(error);
    
    if (showToast) {
      // You can integrate with your toast notification system here
      // Example: toast.error(errorInfo.message, { duration: toastDuration });
      console.error('Error Notification:', errorInfo.message);
    }

    return errorInfo;
  }

  /**
   * Handle specific API endpoint errors
   */
  static handleEndpointError(endpoint, error) {
    const baseError = this.handleError(error);
    
    // Add endpoint-specific error handling
    switch (endpoint) {
      case '/auth/login/':
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          return {
            ...baseError,
            message: 'Invalid username or password',
            code: 'INVALID_CREDENTIALS'
          };
        }
        break;
        
      case '/auth/register/':
        if (error.response?.status === HTTP_STATUS.BAD_REQUEST) {
          return {
            ...baseError,
            message: 'Registration failed. Please check your information.',
            code: 'REGISTRATION_FAILED'
          };
        }
        break;
        
      case '/posts/':
        if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
          return {
            ...baseError,
            message: 'You do not have permission to access this post.',
            code: 'POST_ACCESS_DENIED'
          };
        }
        break;
        
      default:
        break;
    }
    
    return baseError;
  }

  /**
   * Create error boundary for React components
   */
  static createErrorBoundary() {
    return class ApiErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        ApiErrorHandler.logError(error, { errorInfo });
      }

      render() {
        if (this.state.hasError) {
          return (
            <div className="error-boundary">
              <h2>Something went wrong</h2>
              <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
              <button onClick={() => this.setState({ hasError: false, error: null })}>
                Try again
              </button>
            </div>
          );
        }

        return this.props.children;
      }
    };
  }
}

export default ApiErrorHandler;
