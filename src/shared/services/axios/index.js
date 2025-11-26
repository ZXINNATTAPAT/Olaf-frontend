import axios from 'axios';
import authService from '../AuthService';

const baseURL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'https://web-production-ba20a.up.railway.app/api';

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
    // Ensure we have CSRF token
    if (!authService.csrfToken) {
      await authService.getCSRFToken();
    }

    // Add CSRF token to headers
    if (authService.csrfToken) {
      config.headers['X-CSRFToken'] = authService.csrfToken;
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
      localStorage.setItem('csrfToken', csrfToken);
    }
    return response;
  },
  async (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error: Backend server is not responding'));
    }

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      // Avoid infinite loop
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token
          const refreshed = await authService.refreshToken();
          
          if (refreshed) {
            // Retry original request with new CSRF token
            if (authService.csrfToken) {
              originalRequest.headers['X-CSRFToken'] = authService.csrfToken;
            }
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - clear auth state
          authService.clearLocalState();
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
