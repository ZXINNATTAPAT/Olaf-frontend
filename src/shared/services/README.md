# Authentication & HTTP Only Cookies Setup

## 🔐 การตั้งค่า Authentication Provider

### 1. AuthContext Provider
```javascript
// index.js
import { AuthContextProvider } from './shared/services/AuthContext';

<AuthContextProvider>
  <App />
</AuthContextProvider>
```

### 2. useAuth Hook
```javascript
import useAuth from './shared/hooks/useAuth';

const { user, setUser, accessToken, setAccessToken } = useAuth();
```

## 🍪 HTTP Only Cookies Configuration

### 1. Axios Configuration
```javascript
// shared/services/axios/index.js
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true, // สำคัญสำหรับ httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. Login Request
```javascript
const response = await axiosInstance.post('/auth/login', {
  email,
  password
}, {
  withCredentials: true, // ส่ง cookies อัตโนมัติ
  headers: {
    'Content-Type': 'application/json',
  }
});
```

### 3. CSRF Token Handling
```javascript
// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// Response interceptor
axiosInstance.interceptors.response.use((response) => {
  const csrfToken = response.headers['x-csrftoken'];
  if (csrfToken) {
    localStorage.setItem('csrfToken', csrfToken);
  }
  return response;
});
```

## 🔄 PersistLogin Component

### การทำงาน
1. ตรวจสอบสถานะการล็อกอินจาก localStorage
2. ถ้ามีการล็อกอิน ให้ดึงข้อมูล user จาก server
3. ใช้ `withCredentials: true` เพื่อส่ง httpOnly cookies
4. จัดการ error และ cleanup localStorage

### การใช้งาน
```javascript
// App.js
<Route path='/' element={<PersistLogin />}>
  {/* routes */}
</Route>
```

## 🛡️ Security Features

### 1. HTTP Only Cookies
- Token ถูกเก็บใน httpOnly cookies (ไม่สามารถเข้าถึงจาก JavaScript)
- ป้องกัน XSS attacks
- ส่งอัตโนมัติกับทุก request

### 2. CSRF Protection
- ใช้ CSRF token ใน headers
- เก็บ CSRF token ใน localStorage
- ส่ง CSRF token กับทุก request

### 3. Auto Refresh Token
- ตรวจสอบ 401 errors
- ลอง refresh token อัตโนมัติ
- Redirect ไป login ถ้า refresh ไม่สำเร็จ

## 📝 Environment Variables

สร้างไฟล์ `.env` ใน root directory:
```
REACT_APP_BASE_URL=http://localhost:8000
```

## 🧪 Testing

### 1. ตรวจสอบ Network Tab
- ดูว่า cookies ถูกส่งกับ request หรือไม่
- ตรวจสอบ CSRF token ใน headers

### 2. ตรวจสอบ Application Tab
- ดู httpOnly cookies ใน Storage
- ตรวจสอบ localStorage items

### 3. ตรวจสอบ Console
- ดู error messages
- ตรวจสอบ response data

## ⚠️ ข้อควรระวัง

1. **CORS Configuration**: ต้องตั้งค่า CORS ใน backend ให้รองรับ credentials
2. **SameSite Policy**: ตรวจสอบ SameSite policy ของ cookies
3. **Secure Flag**: ใช้ Secure flag ใน production
4. **Domain Configuration**: ตั้งค่า domain และ path ของ cookies ให้ถูกต้อง

## 🔧 Troubleshooting

### ปัญหาที่พบบ่อย
1. **Cookies ไม่ถูกส่ง**: ตรวจสอบ `withCredentials: true`
2. **CORS Error**: ตรวจสอบ CORS configuration ใน backend
3. **CSRF Error**: ตรวจสอบ CSRF token ใน headers
4. **401 Unauthorized**: ตรวจสอบ token expiration และ refresh logic
