import axios from 'axios';
import authService from './AuthService';

// Normalize baseURL to use localhost instead of 127.0.0.1 for cookie compatibility
const getBaseURL = () => {
  const url = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'https://web-production-ba20a.up.railway.app/api';
  // Replace 127.0.0.1 with localhost for cookie compatibility
  return url.replace('127.0.0.1', 'localhost');
};

// Check if current route is a public route
// const isPublicRoute = () => {
//   if (typeof window === 'undefined') return false;

//   const publicRoutes = [
//     '/',
//     '/auth/login',
//     '/auth/register',
//   ];

//   const currentPath = window.location.pathname;

//   // Check exact matches
//   if (publicRoutes.includes(currentPath)) {
//     return true;
//   }

//   // Check if it's a View post route (/vFeed/:id)
//   if (currentPath.startsWith('/vFeed/')) {
//     return true;
//   }

//   return false;
// };

// Check if API endpoint is public (doesn't require CSRF token)
const isPublicAPIEndpoint = (url) => {
  if (!url) return false;

  // Public API endpoints that don't require CSRF token
  const publicEndpoints = [
    '/posts/feed/',  // Public feed endpoint
    '/posts/feed',   // Without trailing slash
  ];

  // Check exact matches
  if (publicEndpoints.includes(url)) {
    return true;
  }

  // Check if URL starts with public endpoint pattern
  return publicEndpoints.some(endpoint => url.startsWith(endpoint));
};

const baseURL = getBaseURL();

// Create axios instance for HTTP-only cookies authentication
const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Essential for HTTP-only cookies
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add CSRF token
axiosInstance.interceptors.request.use(
  async (config) => {
    // CRITICAL: Ensure withCredentials is always true for cookie-based auth
    // This must be set BEFORE any other config modifications
    // Force withCredentials to be true even if it was set to false
    config.withCredentials = true;

    // Check if this is a public API endpoint that doesn't require CSRF token
    const isPublicEndpoint = isPublicAPIEndpoint(config.url);

    // Only add CSRF token for protected endpoints
    if (!isPublicEndpoint) {
      // Ensure we have CSRF token
      if (!authService.csrfToken) {
        await authService.getCSRFToken();
      }

      // Add CSRF token to headers
      if (authService.csrfToken) {
        config.headers['X-CSRFToken'] = authService.csrfToken;
      }
    }

    // Remove trailing slash from Bolt API endpoints (except DRF endpoints like /posts/feed/)
    // Bolt API doesn't use trailing slashes (except /clouddiary/)
    if (config.url === '/posts/') {
      config.url = '/posts';
    }

    // Debug: Log request details
    if (process.env.NODE_ENV === 'development') {
      // Note: Cookies are sent automatically with withCredentials: true
      // Check Network tab → Request Headers → Cookie to see if cookies are sent
      console.log('🔵 Request Interceptor:', {
        url: config.url,
        method: config.method,
        hasCSRFToken: !!config.headers['X-CSRFToken'],
        withCredentials: config.withCredentials,
        baseURL: config.baseURL,
        fullURL: config.url ? `${config.baseURL}${config.url}` : config.baseURL,
        headers: config.headers,
        cookies: document.cookie, // Note: HttpOnly cookies won't appear here
        note: 'Check Network tab → Request Headers → Cookie to verify cookies are sent'
      });
    }

    // No Authorization header needed - using HTTP-only cookies
    // Server authenticates via cookies automatically

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Update CSRF token from response headers
    const csrfToken = response.headers['x-csrftoken'] || response.headers['X-CSRFToken'];
    if (csrfToken) {
      authService.csrfToken = csrfToken;
      // Don't store in localStorage - CSRF token is sent in response headers every time
    }
    return response;
  },
  async (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error: Backend server is not responding'));
    }

    // Debug: Log error details
    if (process.env.NODE_ENV === 'development') {
      console.error('🔴 Response Error:', {
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
        hasCSRFToken: !!error.config?.headers?.['X-CSRFToken'],
        withCredentials: error.config?.withCredentials,
        errorDetail: error.response?.data?.detail || error.response?.data?.error || error.message,
        note: 'Check Network tab → Request Headers → Cookie to verify cookies were sent'
      });
    }

    // Handle 401 Unauthorized - try to refresh token once
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      // Only retry once to avoid infinite loops
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token silently
          const refreshed = await authService.refreshToken();

          if (refreshed) {
            // Retry original request with new CSRF token
            if (authService.csrfToken) {
              originalRequest.headers['X-CSRFToken'] = authService.csrfToken;
            }
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - silently fail, let AuthMiddleware handle redirect
          // Don't redirect here - let the route protection handle it
        }
      }

      // If refresh failed or already retried, just reject the error
      // AuthMiddleware will handle redirect if needed
      // Don't redirect here for public routes
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
