import axios from 'axios';
import authService from '../AuthService';

const baseURL = process.env.REACT_APP_BASE_URL || 'https://olaf-backend.onrender.com/api';

// Log API configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:');
  console.log('Base URL:', baseURL);
  console.log('Environment:', process.env.NODE_ENV);
}

// สร้าง axios instance สำหรับ httpOnly cookies
const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // สำคัญสำหรับ httpOnly cookies
  timeout: 30000, // 30 seconds timeout - เหมาะสำหรับ Render.com
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - เพิ่ม CSRF token และ Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // ดึง CSRF token จาก AuthService
    if (authService.csrfToken) {
      config.headers['X-CSRFToken'] = authService.csrfToken;
    }
    
    // ดึง access token จาก cookie และเพิ่ม Authorization header
    const accessToken = authService.getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - จัดการ response และ error
axiosInstance.interceptors.response.use(
  (response) => {
    // บันทึก CSRF token ถ้ามีใน response headers
    const csrfToken = response.headers['x-csrftoken'];
    if (csrfToken) {
      authService.csrfToken = csrfToken;
      localStorage.setItem('csrfToken', csrfToken);
    }
    return response;
  },
  async (error) => {
    // จัดการ network errors
    if (!error.response) {
      // Check if it's a timeout error
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Request timeout: The server took too long to respond'));
      }
      // Check if it's a network connectivity issue
      if (error.message === 'Network Error') {
        return Promise.reject(new Error('Network error: Please check your internet connection'));
      }
      // Generic network error
      return Promise.reject(new Error(`Network error: ${error.message || 'Unable to connect to server'}`));
    }
    
    // จัดการ token errors
    if (error.response?.status === 401) {
      // ตรวจสอบว่าเป็น token error หรือไม่
      if (error.response?.data?.code === 'token_not_valid') {
        localStorage.removeItem('us');
        localStorage.removeItem('csrfToken');
        localStorage.removeItem('accessToken');
      } else {
        localStorage.removeItem('us');
        localStorage.removeItem('csrfToken');
        localStorage.removeItem('accessToken');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
