# Frontend Cookie Check

## ปัญหา
Cookies ไม่ถูกส่งไปกับ request จาก `localhost:3000` ไป `localhost:8000`

## การตรวจสอบ Frontend

### 1. ตรวจสอบ baseURL
```javascript
// AuthService.js และ httpClient.js
const baseURL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'https://web-production-ba20a.up.railway.app/api';
```

**ตรวจสอบว่า:**
- baseURL ใช้ `http://localhost:8000/api` (ไม่ใช่ `127.0.0.1`)
- ไม่มี trailing slash

### 2. ตรวจสอบ withCredentials
```javascript
// httpClient.js
axiosInstance.interceptors.request.use((config) => {
  config.withCredentials = true; // ต้องเป็น true
  return config;
});
```

### 3. ตรวจสอบ credentials ใน fetch
```javascript
// AuthService.js - refreshToken()
const response = await fetch(`${this.baseURL}/auth/refresh-token/`, {
  method: 'POST',
  credentials: 'include' // ต้องเป็น 'include'
});
```

### 4. ตรวจสอบ Console Logs
ดู console logs เพื่อตรวจสอบว่า:
- `withCredentials: true` ใน request interceptor
- `credentials: 'include'` ใน fetch request
- baseURL ถูกต้อง

### 5. ตรวจสอบ Network Tab
1. เปิด DevTools → Network tab
2. ดู request ไปที่ `/api/posts/create-with-image/` หรือ `/api/auth/refresh-token/`
3. ดู Request Headers → Cookie header
4. **ควรเห็น:** `Cookie: access=...; refresh=...; csrftoken=...`

## ถ้า Cookie header ไม่มี access และ refresh

### สาเหตุที่เป็นไปได้:
1. **Cookies ถูก set ที่ domain ผิด**
   - ตรวจสอบ Application tab → Cookies
   - Cookies ควรอยู่ที่ `http://localhost:8000` (ไม่ใช่ `http://localhost:3000`)

2. **Browser block cookies**
   - ตรวจสอบ browser settings
   - ลองใช้ Incognito mode

3. **SameSite=None กับ Secure=False**
   - Chrome อาจ block cookies ในบางกรณี
   - ลองใช้ Incognito mode

## วิธีแก้ไข

1. **ตรวจสอบ baseURL:**
   ```bash
   # ใน .env หรือ environment variables
   REACT_APP_API_URL=http://localhost:8000/api
   ```

2. **Clear cookies และ login ใหม่:**
   - DevTools → Application → Cookies
   - ลบ cookies ทั้งหมด
   - Login ใหม่

3. **ตรวจสอบ console logs:**
   - ดูว่า `withCredentials: true` และ `credentials: 'include'`
   - ดูว่า baseURL ถูกต้อง

4. **ทดสอบใน Incognito mode:**
   - เปิด Incognito window
   - Login ใหม่
   - ทดสอบสร้างโพสต์

