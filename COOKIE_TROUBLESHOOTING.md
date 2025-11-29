# 🔧 Cookie Troubleshooting Guide

## 🔴 ปัญหาที่พบ

แม้ว่า URL จะถูก normalize เป็น `localhost` แล้ว แต่ยังคงได้รับ 401 Unauthorized และ backend ตอบว่า "No valid refresh token found"

## 🔍 วิธีตรวจสอบปัญหา

### 1. ตรวจสอบ Cookies ใน Application Tab

1. เปิด DevTools → **Application** → **Cookies**
2. ตรวจสอบ cookies สำหรับ domain `http://localhost:3000`:
   - ✅ ต้องมี `access` (HttpOnly)
   - ✅ ต้องมี `refresh` (HttpOnly)
   - ✅ ต้องมี `csrftoken`
3. **ตรวจสอบว่า cookies ยังไม่หมดอายุ:**
   - ดูคอลัมน์ **Expires / Max-Age**
   - ถ้า cookies หมดอายุแล้ว → **Login ใหม่**
4. **ตรวจสอบ Domain:**
   - Cookies ต้องอยู่ที่ domain `localhost` (ไม่ใช่ `127.0.0.1`)
   - ถ้า cookies อยู่ที่ `127.0.0.1` → **ลบ cookies และ login ใหม่**

### 2. ตรวจสอบ Cookies ใน Network Tab (สำคัญที่สุด!)

1. เปิด DevTools → **Network**
2. สร้าง post อีกครั้ง (หรือเรียก API อื่น)
3. คลิกที่ request `/posts/create-with-image/`
4. ดู **Request Headers** → **Cookie**:
   - ✅ ต้องมี `Cookie: access=...; refresh=...; csrftoken=...`
   - ❌ ถ้าไม่มี `Cookie` header → **Cookies ไม่ถูกส่งไปกับ request**

### 3. ตรวจสอบ Response Headers หลัง Login

1. เปิด DevTools → **Network**
2. Login ใหม่
3. คลิกที่ request `/auth/login/`
4. ดู **Response Headers**:
   - ✅ ต้องมี `Set-Cookie: access=...; HttpOnly; Path=/`
   - ✅ ต้องมี `Set-Cookie: refresh=...; HttpOnly; Path=/`
   - ✅ ต้องมี `Access-Control-Allow-Credentials: true`
   - ✅ ต้องมี `Access-Control-Allow-Origin: http://localhost:3000` (ไม่ใช่ `*`)

## ✅ วิธีแก้ไข

### ขั้นตอนที่ 1: ลบ Cookies เก่าและ Login ใหม่

1. **ลบ Cookies เก่า:**
   - DevTools → Application → Cookies → `http://localhost:3000`
   - คลิกขวา → Delete All
   - หรือลบ cookies `access`, `refresh`, `csrftoken` ทีละตัว

2. **Login ใหม่:**
   - ไปที่หน้า Login
   - Login ด้วย email และ password
   - ตรวจสอบว่า cookies ถูก set ใหม่ใน Application tab

3. **ตรวจสอบ Network Tab:**
   - ดู Response Headers ของ `/auth/login/`
   - ตรวจสอบว่ามี `Set-Cookie` headers หรือไม่

### ขั้นตอนที่ 2: ตรวจสอบ Backend Configuration

ถ้ายังไม่ได้ผล ตรวจสอบ backend configuration (ดู `BACKEND_COOKIE_ISSUE.md`):

1. **CORS Configuration:**
   ```python
   CORS_ALLOW_CREDENTIALS = True
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
   ]
   ```

2. **Cookie Settings:**
   ```python
   response.set_cookie(
       'access',
       access_token,
       httponly=True,
       secure=False,  # False สำหรับ localhost HTTP
       samesite='Lax',
       max_age=3600,
       domain=None  # หรือ '.localhost' สำหรับ localhost
   )
   ```

### ขั้นตอนที่ 3: ตรวจสอบ Frontend Configuration

1. **Environment Variables:**
   - ตรวจสอบ `.env` file:
     ```
     REACT_APP_BASE_URL=http://localhost:8000/api
     ```
   - **ไม่ใช่** `http://127.0.0.1:8000/api`

2. **Axios Configuration:**
   - ตรวจสอบว่า `withCredentials: true` ถูกตั้งค่า (ดู `httpClient.js`)
   - ✅ ถูกตั้งค่าแล้ว

## 🐛 สาเหตุที่เป็นไปได้

1. **Cookies หมดอายุ** → Login ใหม่
2. **Cookies อยู่ที่ domain ผิด** (`127.0.0.1` แทน `localhost`) → ลบ cookies และ login ใหม่
3. **Backend ไม่ส่ง Set-Cookie headers** → ตรวจสอบ backend configuration
4. **CORS ไม่รองรับ credentials** → ตรวจสอบ backend CORS settings
5. **Cookies ไม่ถูกส่งไปกับ request** → ตรวจสอบ Network tab → Request Headers → Cookie

## 📝 Checklist

- [ ] Cookies ปรากฏใน Application tab → Cookies → `localhost`
- [ ] Cookies ยังไม่หมดอายุ
- [ ] Cookies ถูกส่งไปกับ request (ดู Network tab → Request Headers → Cookie)
- [ ] Backend ส่ง Set-Cookie headers หลัง login
- [ ] Backend ตั้งค่า CORS credentials ถูกต้อง
- [ ] Frontend ใช้ `localhost` (ไม่ใช่ `127.0.0.1`)

## 💡 Tips

- **HttpOnly cookies** ไม่สามารถอ่านได้จาก JavaScript (ปกติ)
- **Set-Cookie header** ไม่สามารถอ่านได้จาก JavaScript (forbidden header)
- ตรวจสอบ cookies ใน **Application tab** (ไม่ใช่ `document.cookie`)
- ตรวจสอบ cookies ที่ถูกส่งไปใน **Network tab** → Request Headers → Cookie

