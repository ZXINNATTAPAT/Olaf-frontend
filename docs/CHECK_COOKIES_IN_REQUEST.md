# วิธีตรวจสอบว่า Cookies ถูกส่งไปกับ Request

## จาก Screenshot
Cookies ถูก set ถูกต้องแล้ว:
- ✅ `access` cookie: Domain=`localhost`, HttpOnly=✓, SameSite=`None`
- ✅ `refresh` cookie: Domain=`localhost`, HttpOnly=✓, SameSite=`None`
- ✅ `csrftoken` cookie: Domain=`localhost`, SameSite=`Lax`

## ขั้นตอนตรวจสอบ

### 1. ตรวจสอบ Network Tab
1. เปิด DevTools → Network tab
2. ลองสร้างโพสต์ (หรือ request อื่นๆ)
3. ดู request ไปที่ `/api/posts/create-with-image/`
4. ดู Request Headers → Cookie header

**ควรเห็น:**
```
Cookie: access=eyJhbGciOiJIUzI1...; refresh=eyJhbGciOiJIUzI1...; csrftoken=AZR1rQMLJAQWh...
```

### 2. ถ้า Cookie header ไม่มี access และ refresh
**สาเหตุที่เป็นไปได้:**
1. **SameSite=None กับ Secure=False** - Chrome อาจ block cookies
2. **Domain mismatch** - Cookies ถูก set ที่ `localhost` แต่ request มาจาก origin อื่น
3. **Browser settings** - Browser อาจ block third-party cookies

### 3. วิธีแก้ไข
1. **ตรวจสอบ SameSite/Secure settings:**
   - SameSite=None ต้องใช้ Secure=True ใน production
   - แต่ Chrome อนุญาต Secure=False สำหรับ localhost

2. **ตรวจสอบว่า request มาจาก origin ไหน:**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`
   - Cookies ถูก set ที่ `localhost` ควรส่งได้

3. **ทดสอบด้วย curl:**
   ```bash
   curl -v -X POST http://localhost:8000/api/posts/create-with-image/ \
     -H "Content-Type: application/json" \
     -H "Cookie: access=YOUR_ACCESS_TOKEN; refresh=YOUR_REFRESH_TOKEN; csrftoken=YOUR_CSRF_TOKEN" \
     -d '{"header":"test","short":"test","post_text":"test"}'
   ```

## หมายเหตุ
- HttpOnly cookies (`access`, `refresh`) ไม่สามารถอ่านได้จาก JavaScript
- แต่ควรถูกส่งไปกับ request อัตโนมัติถ้า `withCredentials: true`
- ตรวจสอบ Network tab → Request Headers → Cookie เพื่อยืนยัน

