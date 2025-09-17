import axios from 'axios';
import authService from '../AuthService';

const baseURL = process.env.REACT_APP_BASE_URL || 'https://olaf-backend.onrender.com/api';

// สร้าง axios instance สำหรับ httpOnly cookies
const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // สำคัญสำหรับ httpOnly cookies
  timeout: 20000, // 20 seconds timeout - optimized for Render free tier
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - เพิ่ม CSRF token เท่านั้น
axiosInstance.interceptors.request.use(
  (config) => {
    // ดึง CSRF token จาก AuthService
    if (authService.csrfToken) {
      config.headers['X-CSRFToken'] = authService.csrfToken;
    }
    
    // ไม่ต้องเพิ่ม Authorization header เพราะใช้ HTTP-only cookies
    // Server จะตรวจสอบ authentication ผ่าน cookies อัตโนมัติ
    
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
      return Promise.reject(new Error('Network error: Backend server is not responding'));
    }
    
    // จัดการ token errors
    if (error.response?.status === 401) {
      // ลบเฉพาะ CSRF token
      localStorage.removeItem('csrfToken');
      authService.csrfToken = null;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
