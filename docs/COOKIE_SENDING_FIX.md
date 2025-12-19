# แก้ไขปัญหา Cookies ไม่ถูกส่งไปกับ POST Request

## 🔴 ปัญหา
POST request ไม่มี cookies (`access`, `refresh`) แนบไปด้วย แม้ว่าจะใช้ `fetch()` กับ `credentials: 'include'` แล้ว

## 🔍 สาเหตุที่เป็นไปได้

### 1. Browser Block Cookies สำหรับ Cross-Origin Requests
- Browser อาจ block cookies สำหรับ POST requests ที่มี `SameSite=None` และ `Secure=False`
- โดยเฉพาะใน Chrome/Brave browser

### 2. Cookies ถูก Set ที่ Domain ผิด
- Cookies ถูก set ที่ domain `localhost:8000` แต่ browser ไม่ส่งไปกับ cross-origin request จาก `localhost:3000`

### 3. Browser Settings
- Browser settings อาจ block third-party cookies
- Incognito mode อาจ block cookies

## ✅ วิธีแก้ไข

### 1. ตรวจสอบ Application Tab → Cookies
1. เปิด DevTools → Application → Cookies
2. ตรวจสอบ cookies สำหรับ domain `http://localhost:8000`:
   - ควรมี `access`, `refresh`, `csrftoken`
   - Domain ควรเป็น `localhost:8000` (ไม่ใช่ `localhost`)

### 2. ตรวจสอบ Network Tab → Request Headers
1. ดู POST request ไปที่ `/api/posts/create-with-image/`
2. ดู Request Headers → Cookie header
3. ถ้าไม่มี Cookie header แสดงว่า browser ไม่ส่ง cookies

### 3. ตรวจสอบ Browser Settings
1. ไปที่ `chrome://settings/cookies` หรือ `brave://settings/cookies`
2. ตรวจสอบว่า "Block third-party cookies" ถูกปิด
3. ตรวจสอบว่า "Allow all cookies" ถูกเปิด

### 4. ลองใช้ Incognito Mode
1. เปิด Incognito window
2. Login ใหม่
3. ทดสอบสร้างโพสต์
4. ตรวจสอบว่า cookies ถูกส่งไปหรือไม่

### 5. Clear Cookies และ Login ใหม่
1. เปิด DevTools → Application → Cookies
2. ลบ cookies ทั้งหมด (ทั้ง `localhost` และ `localhost:8000`)
3. Login ใหม่
4. ตรวจสอบว่า cookies ถูก set ที่ domain `localhost:8000`
5. ทดสอบสร้างโพสต์

## 📝 Checklist

- [ ] Cookies ปรากฏใน Application tab → Cookies → `http://localhost:8000`
- [ ] Cookies มี domain `localhost:8000` (ไม่ใช่ `localhost`)
- [ ] Request Headers มี `Cookie` header เมื่อเรียก API
- [ ] Browser settings ไม่ block third-party cookies
- [ ] `credentials: 'include'` ถูกตั้งค่าใน fetch request

## 🧪 การทดสอบ

1. เปิด DevTools → Network tab
2. ทำ POST request
3. ดู Request Headers → Cookie
4. **ควรเห็น:** `Cookie: access=...; refresh=...; csrftoken=...`

## ⚠️ หมายเหตุ

- HttpOnly cookies (`access`, `refresh`) ไม่สามารถอ่านได้จาก JavaScript
- แต่ควรถูกส่งไปกับ request อัตโนมัติถ้า `credentials: 'include'`
- ตรวจสอบ Network tab → Request Headers → Cookie เพื่อยืนยัน

