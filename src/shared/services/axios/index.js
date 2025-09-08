import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL || 'https://olaf-backend.onrender.com/api';

// สร้าง axios instance สำหรับ httpOnly cookies
const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // สำคัญสำหรับ httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - เพิ่ม CSRF token ถ้ามี
axiosInstance.interceptors.request.use(
  (config) => {
    // ดึง CSRF token จาก localStorage หรือ cookie
    const csrfToken = localStorage.getItem('csrfToken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
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
      localStorage.setItem('csrfToken', csrfToken);
    }
    return response;
  },
  async (error) => {
    // ใช้ HttpOnly cookies เป็นหลัก
    // ถ้า error เป็น 401 (Unauthorized) ให้ redirect ไป login
    if (error.response?.status === 401) {
      // ลบเฉพาะ localStorage flags
      localStorage.removeItem('us');
      localStorage.removeItem('csrfToken');
      // ไม่ลบ accessToken เพราะใช้ cookies เป็นหลัก
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
