# Backend Cookie & CORS Configuration Issue

## 🔴 ปัญหาที่พบ

จาก debug logs พบว่า:
- `Set-Cookie: null` - Backend ไม่ส่ง Set-Cookie headers
- `Access-Control-Allow-Credentials: null` - CORS ไม่รองรับ credentials
- `Access-Control-Allow-Origin: null` - CORS origin ไม่ถูกตั้งค่า
- Cookies ไม่ถูก set หลัง login (`hasAccessToken: false, hasRefreshToken: false`)

## ✅ วิธีแก้ไข (Backend)

### 1. ตั้งค่า CORS ใน Django

```python
# settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    ...
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]

# CORS Configuration
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # เพิ่ม production domain เมื่อ deploy
]

# ไม่ใช้ CORS_ALLOW_ALL_ORIGINS = True เพราะจะ conflict กับ credentials
```

### 2. ตั้งค่า Cookies หลัง Login

```python
# views.py หรือ serializers.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    # ... login logic ...
    
    if user is authenticated:
        # Generate tokens
        access_token = generate_access_token(user)
        refresh_token = generate_refresh_token(user)
        
        # Create response
        response = Response({
            'message': 'Login successful',
            'user': user_data
        })
        
        # Set cookies
        response.set_cookie(
            'access',
            access_token,
            httponly=True,
            secure=False,  # True ใน production (HTTPS)
            samesite='Lax',
            max_age=3600,  # 1 hour
            path='/'
        )
        
        response.set_cookie(
            'refresh',
            refresh_token,
            httponly=True,
            secure=False,  # True ใน production (HTTPS)
            samesite='Lax',
            max_age=604800,  # 7 days
            path='/'
        )
        
        # Set CSRF token in header
        response['X-CSRFToken'] = get_token(request)
        
        return response
```

### 3. ตรวจสอบ Response Headers

หลัง login สำเร็จ Response Headers ต้องมี:
```
Set-Cookie: access=<token>; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax
Set-Cookie: refresh=<token>; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax
X-CSRFToken: <csrf_token>
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: http://localhost:3000
```

### 4. ตรวจสอบ Request Headers

Frontend ส่ง Request Headers:
```
Content-Type: application/json
X-CSRFToken: <csrf_token>
Cookie: access=<token>; refresh=<token>; csrftoken=<csrf_token>
```

## 🧪 วิธีทดสอบ

### ⚠️ สิ่งสำคัญ:
- **Set-Cookie header ไม่สามารถอ่านได้จาก JavaScript** (forbidden header)
- **HttpOnly cookies ไม่สามารถอ่านได้จาก JavaScript** (จะไม่ปรากฏใน `document.cookie`)
- **Frontend ต้องใช้ `credentials: 'include'` ในทุก request** (axios ใช้ `withCredentials: true`)

### วิธีตรวจสอบ:

1. **ตรวจสอบ Network Tab:**
   - เปิด DevTools → Network
   - Login แล้วดู response headers ของ `/auth/login/`
   - ตรวจสอบว่ามี `Set-Cookie` headers หรือไม่ (ต้องดูใน Network tab เท่านั้น)
   - ตรวจสอบว่ามี `Access-Control-Allow-Credentials: true` หรือไม่
   - ตรวจสอบว่ามี `Access-Control-Allow-Origin: http://localhost:3000` หรือไม่

2. **ตรวจสอบ Cookies (วิธีที่ถูกต้อง):**
   - เปิด DevTools → Application → Cookies
   - ตรวจสอบว่ามี cookies `access`, `refresh`, `csrftoken` หรือไม่
   - **HttpOnly cookies จะปรากฏที่นี่เท่านั้น** (ไม่ปรากฏใน `document.cookie`)

3. **ตรวจสอบ Console:**
   - ดู debug logs ที่ขึ้นด้วย 🍪
   - ตรวจสอบว่า cookies ถูก set หรือไม่
   - **หมายเหตุ**: `document.cookie` จะไม่แสดง HttpOnly cookies

## 📝 หมายเหตุ

- **HttpOnly cookies** ไม่สามารถเข้าถึงจาก JavaScript ได้ (ป้องกัน XSS)
- **SameSite=Lax** อนุญาตให้ส่ง cookies กับ cross-site requests บางประเภท
- **Secure flag** ควรเป็น `True` ใน production (HTTPS only)
- **CORS credentials** ต้องตั้งค่า `Access-Control-Allow-Credentials: true` และ `Access-Control-Allow-Origin` ต้องเป็น specific domain (ไม่ใช่ `*`)

## 🔗 References

- [Django CORS Headers Documentation](https://github.com/adamchainz/django-cors-headers)
- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

