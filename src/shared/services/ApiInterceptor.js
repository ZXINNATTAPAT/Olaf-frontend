// API Interceptor - Request/Response interceptors for axios
import axios from 'axios';
import ApiErrorHandler from './ApiErrorHandler';
import { API_CONFIG, REQUEST_CONFIG } from '../constants/apiConstants';

class ApiInterceptor {
  constructor() {
    this.interceptors = {
      request: null,
      response: null
    };
  }

  /**
   * Setup request interceptor
   */
  setupRequestInterceptor(axiosInstance) {
    this.interceptors.request = axiosInstance.interceptors.request.use(
      (config) => {
        // Add timestamp to prevent caching
        config.metadata = { startTime: new Date() };
        
        // Add default timeout if not set
        if (!config.timeout) {
          config.timeout = API_CONFIG.TIMEOUT;
        }

        // Add default headers
        config.headers = {
          ...REQUEST_CONFIG.DEFAULT.headers,
          ...config.headers
        };

        // ไม่ต้องเพิ่ม Authorization header เพราะใช้ HTTP-only cookies
        // Server จะตรวจสอบ authentication ผ่าน cookies อัตโนมัติ

        // Add CSRF token if available
        const csrfToken = this.getCSRFToken();
        if (csrfToken) {
          config.headers['X-CSRFToken'] = csrfToken;
        }

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
            headers: config.headers
          });
        }

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    return this.interceptors.request;
  }

  /**
   * Setup response interceptor
   */
  setupResponseInterceptor(axiosInstance) {
    this.interceptors.response = axiosInstance.interceptors.response.use(
      (response) => {
        // Calculate request duration
        const duration = new Date() - response.config.metadata?.startTime;
        
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ API Response:', {
            method: response.config.method?.toUpperCase(),
            url: response.config.url,
            status: response.status,
            duration: `${duration}ms`,
            data: response.data
          });
        }

        // Handle successful responses
        return this.handleSuccessResponse(response);
      },
      (error) => {
        // Calculate request duration for errors
        const duration = new Date() - error.config?.metadata?.startTime;
        
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ API Error Response:', {
            method: error.config?.method?.toUpperCase(),
            url: error.config?.url,
            status: error.response?.status,
            duration: `${duration}ms`,
            error: error.message,
            data: error.response?.data
          });
        }

        // Handle error responses
        return this.handleErrorResponse(error);
      }
    );

    return this.interceptors.response;
  }

  /**
   * Handle successful responses
   */
  handleSuccessResponse(response) {
    // Add any success response processing here
    // For example, update last activity timestamp
    this.updateLastActivity();
    
    return response;
  }

  /**
   * Handle error responses
   */
  handleErrorResponse(error) {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or refresh token
      this.handleUnauthorized();
    } else if (error.response?.status === 403) {
      // Forbidden - show access denied message
      this.handleForbidden();
    } else if (error.response?.status === 429) {
      // Rate limited - implement backoff
      this.handleRateLimit();
    }

    // Log error for debugging
    ApiErrorHandler.logError(error);

    // Transform error to consistent format
    const transformedError = ApiErrorHandler.handleError(error);
    
    return Promise.reject(transformedError);
  }

  /**
   * Handle unauthorized responses (401)
   */
  handleUnauthorized() {
    // Clear stored tokens
    this.clearAuthToken();
    this.clearCSRFToken();
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * Handle forbidden responses (403)
   */
  handleForbidden() {
    // Show access denied message
    console.warn('Access denied: You do not have permission to perform this action');
  }

  /**
   * Handle rate limit responses (429)
   */
  handleRateLimit() {
    // Implement exponential backoff
    console.warn('Rate limited: Too many requests. Please wait before trying again.');
  }

  /**
   * Get authentication token from storage
   * Note: เนื่องจากใช้ HTTP-only cookies จึงไม่สามารถอ่าน token ได้จาก client-side
   */
  getAuthToken() {
    // ไม่ต้องอ่าน token จาก localStorage เพราะใช้ HTTP-only cookies
    return null;
  }

  /**
   * Get CSRF token from storage
   */
  getCSRFToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('csrfToken') || sessionStorage.getItem('csrfToken');
    }
    return null;
  }

  /**
   * Clear authentication token
   * Note: เนื่องจากใช้ HTTP-only cookies จึงไม่ต้องลบจาก localStorage
   */
  clearAuthToken() {
    // ไม่ต้องลบ token จาก localStorage เพราะใช้ HTTP-only cookies
    // Server จะจัดการการลบ cookies เอง
  }

  /**
   * Clear CSRF token
   */
  clearCSRFToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('csrfToken');
      sessionStorage.removeItem('csrfToken');
    }
  }

  /**
   * Update last activity timestamp
   */
  updateLastActivity() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastActivity', new Date().toISOString());
    }
  }

  /**
   * Remove interceptors
   */
  removeInterceptors(axiosInstance) {
    if (this.interceptors.request !== null) {
      axiosInstance.interceptors.request.eject(this.interceptors.request);
      this.interceptors.request = null;
    }
    
    if (this.interceptors.response !== null) {
      axiosInstance.interceptors.response.eject(this.interceptors.response);
      this.interceptors.response = null;
    }
  }

  /**
   * Setup all interceptors
   */
  setupAllInterceptors(axiosInstance) {
    this.setupRequestInterceptor(axiosInstance);
    this.setupResponseInterceptor(axiosInstance);
  }

  /**
   * Create a new axios instance with interceptors
   */
  createAxiosInstance(config = {}) {
    const instance = axios.create({
      ...REQUEST_CONFIG.DEFAULT,
      ...config
    });

    this.setupAllInterceptors(instance);
    
    return instance;
  }
}

// Create singleton instance
const apiInterceptor = new ApiInterceptor();

export default apiInterceptor;
