# Cross-Site Authentication Fix

## ปัญหาที่พบ

เมื่อ Frontend อยู่ที่ `http://localhost:3000` และ Backend อยู่ที่ `https://web-production-ba20a.up.railway.app`, เกิดปัญหา **401 Unauthorized** เพราะ:

1. **Third-Party Cookie Blocking**: Browser ถือว่า cookies จาก Railway เป็น third-party cookies และไม่ส่งไปกับ request
2. **Cross-Site Request**: localhost และ railway.app เป็นคนละ site (ไม่ใช่แค่ cross-origin)
3. **Authentication Token ไม่ถูกส่ง**: ทำให้ API endpoints ที่ต้องการ authentication ส่ง 401

## สถานะการแก้ไข

### ✅ Backend (แก้ไขเสร็จสมบูรณ์)

#### 1. **Login & Register Endpoints** (`authentication/views.py`)

- ✅ เพิ่ม `access` และ `refresh` tokens ใน response body
- ✅ ยังคง set HTTP-only cookies ไว้สำหรับ same-site requests
- ✅ รองรับทั้ง cookie-based และ token-based authentication

**Response Format:**

```json
{
  "message": "Login successful",
  "user": { ... },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### 2. **Token Refresh Endpoint** (`/api/auth/refresh-token/`)

- ✅ ส่ง tokens กลับมาใน response body
- ✅ รองรับทั้ง cookies และ Authorization header

#### 3. **Custom Authentication** (`authentication/authenticate.py`)

- ✅ ตรวจสอบ **Authorization header ก่อน** (สำหรับ cross-site)
- ✅ Fallback ไปใช้ cookies (สำหรับ same-site)

**Authentication Priority:**

1. `Authorization: Bearer <token>` header (cross-site)
2. `access` cookie (same-site)

### ✅ Frontend (แก้ไขเสร็จสมบูรณ์)

#### 1. **AuthService.js** - Token Management

- ✅ เก็บ `accessToken` และ `refreshToken` ใน localStorage (บรรทัด 205-210, 261-266)
- ✅ ใช้เป็น fallback เมื่อ cookies ถูก block
- ✅ Clear tokens เมื่อ logout (บรรทัด 509-510)

```javascript
// Login - เก็บ tokens ใน localStorage
if (data.access) {
  localStorage.setItem("accessToken", data.access);
}
if (data.refresh) {
  localStorage.setItem("refreshToken", data.refresh);
}
```

#### 2. **httpClient.js** - Authorization Header

- ✅ ส่ง `Authorization: Bearer <token>` header อัตโนมัติ (บรรทัด 120-123)
- ✅ ใช้ token จาก localStorage เมื่อ cookies ไม่พร้อมใช้งาน
- ✅ รักษา `withCredentials: true` ไว้สำหรับ cookie-based auth

```javascript
// Request interceptor - ส่ง Authorization header
const token = localStorage.getItem("accessToken");
if (token) {
  config.headers["Authorization"] = `Bearer ${token}`;
}
```

#### 3. **Token Refresh Logic**

- ✅ Auto-refresh เมื่อได้ 401 Unauthorized (บรรทัด 181-217)
- ✅ Retry failed requests หลัง refresh สำเร็จ
- ✅ Logout อัตโนมัติเมื่อ refresh ล้มเหลว

```javascript
// Response interceptor - Handle 401 และ refresh token
if (error.response?.status === 401 && !originalRequest._retry) {
  await authService.refreshToken();
  return axiosInstance(originalRequest);
}
```

## การทำงานของระบบ Authentication

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Login                                               │
│    POST /api/auth/login/                                    │
│    ↓                                                         │
│    Response: { access, refresh, user }                      │
│    ↓                                                         │
│    ✅ Save to localStorage (accessToken, refreshToken)      │
│    ✅ Set HTTP-only cookies (access, refresh) [if same-site]│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. Authenticated Request                                    │
│    POST /api/posts/create-with-image/                       │
│    ↓                                                         │
│    Request Interceptor:                                     │
│    ✅ Add Authorization: Bearer <accessToken>               │
│    ✅ Add X-CSRFToken header                                │
│    ✅ Set withCredentials: true (send cookies)              │
│    ↓                                                         │
│    Backend checks:                                          │
│    1️⃣ Authorization header (priority)                       │
│    2️⃣ access cookie (fallback)                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. Token Expired (401 Unauthorized)                         │
│    ↓                                                         │
│    Response Interceptor:                                    │
│    ✅ Detect 401 error                                      │
│    ✅ Call POST /api/auth/refresh-token/                    │
│    ✅ Update localStorage with new tokens                   │
│    ✅ Retry original request with new token                 │
│    ↓                                                         │
│    If refresh fails:                                        │
│    ❌ Clear localStorage                                    │
│    ❌ Redirect to /auth/login                               │
└─────────────────────────────────────────────────────────────┘
```

## Troubleshooting

### ปัญหา: ยังได้ 401 Unauthorized อยู่

#### ตรวจสอบ 1: Token ถูกเก็บใน localStorage หรือไม่?

```javascript
// เปิด Browser Console และรัน:
console.log({
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: localStorage.getItem("user"),
});
```

**Expected:** ควรเห็น tokens ทั้งหมด  
**If null:** ปัญหาอยู่ที่ Login/Register ไม่ได้เก็บ tokens

#### ตรวจสอบ 2: Authorization header ถูกส่งหรือไม่?

1. เปิด **DevTools → Network tab**
2. ทำ request ที่มีปัญหา (เช่น create post)
3. คลิกที่ request → **Headers tab**
4. ดูที่ **Request Headers**

**Expected:**

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
X-CSRFToken: abc123...
```

**If missing Authorization:** ปัญหาอยู่ที่ httpClient interceptor

#### ตรวจสอบ 3: Backend รับ token หรือไม่?

ดูที่ **Response** ของ request ที่ล้มเหลว:

```json
// ถ้า Backend ไม่เห็น token จะส่ง:
{
  "detail": "Authentication credentials were not provided."
}

// ถ้า token หมดอายุ:
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid"
}
```

#### ตรวจสอบ 4: CSRF Token

```javascript
// เปิด Browser Console และรัน:
console.log("CSRF Token:", authService.csrfToken);
```

**Expected:** ควรเห็น token string  
**If null:** รัน `await authService.getCSRFToken()`

### ปัญหา: Token Refresh ไม่ทำงาน

#### ตรวจสอบ 1: Refresh Token ยังใช้ได้หรือไม่?

```bash
# ทดสอบ refresh token ด้วย curl
curl -X POST https://web-production-ba20a.up.railway.app/api/auth/refresh-token/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN" \
  -d '{"refresh":"YOUR_REFRESH_TOKEN"}'
```

**Expected:** ได้ tokens ใหม่กลับมา  
**If error:** Refresh token หมดอายุ → ต้อง login ใหม่

#### ตรวจสอบ 2: Infinite Loop

ดูที่ **Console** มี error loop หรือไม่:

```
🔄 Refresh token request...
❌ Refresh token failed...
🔄 Refresh token request...
❌ Refresh token failed...
```

**Solution:** ตรวจสอบว่า `originalRequest._retry` ถูก set หรือไม่ (httpClient.js บรรทัด 200)

### ปัญหา: CORS Error

```
Access to XMLHttpRequest at 'https://...' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Solution:** ตรวจสอบ Backend CORS settings:

```python
# Backend settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True
```

### ปัญหา: Cookies ไม่ถูก Set

**ตรวจสอบ:**

1. เปิด **DevTools → Application tab → Cookies**
2. ดูที่ `https://web-production-ba20a.up.railway.app`

**Expected:** ควรเห็น `access` และ `refresh` cookies (HttpOnly)  
**If missing:** ปัญหาอยู่ที่ Backend ไม่ส่ง Set-Cookie headers

## Best Practices

### 1. ใช้ Environment Variables

```javascript
// .env
REACT_APP_API_URL=https://web-production-ba20a.up.railway.app/api

// httpClient.js
const baseURL = process.env.REACT_APP_API_URL;
```

### 2. Handle Token Expiration Gracefully

```javascript
// แสดง notification ก่อน redirect
if (refreshError) {
  toast.error("Session expired. Please login again.");
  setTimeout(() => {
    window.location.href = "/auth/login";
  }, 2000);
}
```

### 3. Secure Token Storage

```javascript
// ❌ อย่าเก็บ sensitive data ใน localStorage
localStorage.setItem("password", password); // NEVER!

// ✅ เก็บเฉพาะ tokens และ safe user data
localStorage.setItem("accessToken", token);
localStorage.setItem("user", JSON.stringify(sanitizedUser));
```

### 4. Clear Tokens on Logout

```javascript
// AuthService.js - clearLocalState()
clearLocalState() {
  this.clearCache();
  this.csrfToken = null;
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
```

## Testing Checklist

- [ ] Login สำเร็จและเก็บ tokens ใน localStorage
- [ ] Create post สำเร็จด้วย Authorization header
- [ ] Token refresh ทำงานเมื่อ access token หมดอายุ
- [ ] Logout ลบ tokens และ redirect ไป login
- [ ] 401 error redirect ไป login page
- [ ] CSRF token ถูกส่งในทุก protected request
- [ ] Cookies ถูก set สำหรับ same-site requests

## สรุป

### ✅ ระบบทำงานอย่างไร

1. **Login/Register** → Backend ส่ง tokens ใน response body
2. **Frontend** → เก็บ tokens ใน localStorage
3. **Every Request** → ส่ง `Authorization: Bearer <token>` header
4. **Backend** → ตรวจสอบ Authorization header ก่อน cookies
5. **Token Expired** → Auto-refresh และ retry request
6. **Refresh Failed** → Logout และ redirect ไป login

### 🔒 Security

- ✅ HTTP-only cookies สำหรับ same-site (ปลอดภัยที่สุด)
- ✅ localStorage + Authorization header สำหรับ cross-site (ทางเลือกเดียว)
- ✅ CSRF protection ด้วย X-CSRFToken header
- ✅ Token expiration (access: 1h, refresh: 7d)
- ✅ Auto-logout เมื่อ refresh ล้มเหลว

### 📝 Implementation Status

| Component                   | Status  | File                                  |
| --------------------------- | ------- | ------------------------------------- |
| Backend - Token in Response | ✅ Done | `authentication/views.py`             |
| Backend - Auth Priority     | ✅ Done | `authentication/authenticate.py`      |
| Frontend - Token Storage    | ✅ Done | `AuthService.js` (L205-210, L261-266) |
| Frontend - Auth Header      | ✅ Done | `httpClient.js` (L120-123)            |
| Frontend - Token Refresh    | ✅ Done | `httpClient.js` (L181-217)            |
| Frontend - Logout           | ✅ Done | `AuthService.js` (L504-511)           |

### 🚀 Deployment

```bash
# Frontend
npm run build
# Deploy to your hosting (Netlify, Vercel, etc.)

# Backend (Railway auto-deploys on push)
git add .
git commit -m "docs: Update authentication documentation"
git push origin main
```
