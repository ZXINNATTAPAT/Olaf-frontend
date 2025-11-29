# 🔍 Debug Guide: Cookie Issues

## ⚠️ ปัญหาที่พบ

จาก logs พบว่า:
- `hasAccessToken: false, hasRefreshToken: false` (จาก document.cookie - ซึ่งปกติสำหรับ HttpOnly cookies)
- `No valid refresh token found` - Backend ไม่พบ refresh token
- 401 Unauthorized เมื่อพยายามสร้าง post

## 🔍 วิธีตรวจสอบปัญหา

### 1. ตรวจสอบ Network Tab (สำคัญที่สุด!)

#### A. ตรวจสอบ Login Response:
1. เปิด DevTools → Network
2. Login แล้วดู request `/auth/login/`
3. คลิกที่ request → ดู **Response Headers**:
   - ✅ ต้องมี `Set-Cookie: access=...; HttpOnly; Path=/`
   - ✅ ต้องมี `Set-Cookie: refresh=...; HttpOnly; Path=/`
   - ✅ ต้องมี `Access-Control-Allow-Credentials: true`
   - ✅ ต้องมี `Access-Control-Allow-Origin: http://localhost:3000` (ไม่ใช่ `*`)

#### B. ตรวจสอบ Create Post Request:
1. ดู request `/posts/create-with-image/`
2. คลิกที่ request → ดู **Request Headers**:
   - ✅ ต้องมี `Cookie: access=...; refresh=...; csrftoken=...`
   - ✅ ต้องมี `X-CSRFToken: ...`
   - ✅ ต้องมี `withCredentials: true` (ใน axios config)

### 2. ตรวจสอบ Application Tab → Cookies

1. เปิด DevTools → Application → Cookies
2. ตรวจสอบ cookies สำหรับ domain `http://localhost:3000` หรือ `http://127.0.0.1:8000`:
   - ✅ ต้องมี `access` (HttpOnly)
   - ✅ ต้องมี `refresh` (HttpOnly)
   - ✅ ต้องมี `csrftoken`

### 3. ตรวจสอบ Console Logs

ดู debug logs:
- 🔵 Request logs - ตรวจสอบ `withCredentials: true`
- 🔴 Response Error logs - ดู error details
- 🍪 Cookie Status - หมายเหตุ: HttpOnly cookies จะไม่ปรากฏใน `document.cookie`

## 🐛 สาเหตุที่เป็นไปได้

### 1. Backend ไม่ส่ง Set-Cookie headers
**อาการ**: Response Headers ของ `/auth/login/` ไม่มี `Set-Cookie`
**วิธีแก้**: ดู `BACKEND_COOKIE_ISSUE.md`

### 2. CORS ไม่รองรับ credentials
**อาการ**: Response Headers ไม่มี `Access-Control-Allow-Credentials: true`
**วิธีแก้**: Backend ต้องตั้งค่า `CORS_ALLOW_CREDENTIALS = True`

### 3. Cookies ถูก block โดย browser
**อาการ**: Cookies ไม่ปรากฏใน Application tab
**วิธีแก้**: 
- ตรวจสอบ SameSite policy
- ตรวจสอบ Secure flag (ต้องเป็น False สำหรับ localhost HTTP)
- ตรวจสอบ Domain และ Path

### 4. Cookies ไม่ถูกส่งไปกับ request
**อาการ**: Request Headers ไม่มี `Cookie` header
**วิธีแก้**: 
- ตรวจสอบว่า `withCredentials: true` ถูกตั้งค่า
- ตรวจสอบว่า cookies อยู่ใน domain ที่ถูกต้อง

## ✅ Checklist

- [ ] Backend ส่ง `Set-Cookie` headers หลัง login
- [ ] Backend ตั้งค่า `Access-Control-Allow-Credentials: true`
- [ ] Backend ตั้งค่า `Access-Control-Allow-Origin: http://localhost:3000` (ไม่ใช่ `*`)
- [ ] Frontend ใช้ `withCredentials: true` ใน axios
- [ ] Frontend ใช้ `credentials: 'include'` ใน fetch
- [ ] Cookies ปรากฏใน Application tab → Cookies
- [ ] Request Headers มี `Cookie` header เมื่อเรียก API

## 📝 หมายเหตุ

- **HttpOnly cookies** ไม่สามารถอ่านได้จาก JavaScript (ปกติ)
- **Set-Cookie header** ไม่สามารถอ่านได้จาก JavaScript (forbidden header)
- ตรวจสอบ cookies ผ่าน **Application tab** หรือ **Network tab** เท่านั้น

