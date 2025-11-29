/**
 * Cookie Helper Functions
 * Utilities for checking and debugging cookies
 * 
 * IMPORTANT NOTES:
 * - HttpOnly cookies (access, refresh) cannot be read from JavaScript
 * - They will NOT appear in document.cookie
 * - Check them via DevTools → Application → Cookies instead
 * - Set-Cookie header is a forbidden header and cannot be read from JavaScript
 */

/**
 * Check if cookies are available
 * Note: HttpOnly cookies won't appear in document.cookie
 * Check Application tab → Cookies for HttpOnly cookies
 * @returns {Object} Cookie status
 */
export function checkCookies() {
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key) acc[key] = value;
    return acc;
  }, {});

  // Note: HttpOnly cookies (access, refresh) won't appear in document.cookie
  // They can only be checked via DevTools → Application → Cookies
  return {
    allCookies: cookies,
    hasAccessToken: !!cookies.access, // Will be false for HttpOnly cookies
    hasRefreshToken: !!cookies.refresh, // Will be false for HttpOnly cookies
    hasCSRFToken: !!cookies.csrftoken,
    cookieString: document.cookie,
    note: 'HttpOnly cookies (access, refresh) are not accessible via JavaScript. Check Application tab → Cookies instead.'
  };
}

/**
 * Log cookie status to console
 * Note: HttpOnly cookies won't appear here. Check Application tab → Cookies instead.
 */
export function logCookieStatus() {
  const status = checkCookies();
  console.log('🍪 Cookie Status (document.cookie):', status);
  console.log('💡 Tip: HttpOnly cookies (access, refresh) are not accessible via JavaScript.');
  console.log('💡 Check DevTools → Application → Cookies to see all cookies including HttpOnly ones.');
  return status;
}

/**
 * Check if cookies will be sent with requests
 * @returns {boolean}
 */
export function willCookiesBeSent() {
  // Check if we're on the same domain or if CORS is configured
  const currentDomain = window.location.hostname;
  const apiDomain = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || '';
  
  // For localhost, cookies should work if backend is on same origin or CORS is configured
  if (currentDomain === 'localhost' || currentDomain === '127.0.0.1') {
    return true; // Assume CORS is configured for localhost
  }
  
  // For production, check if domains match
  try {
    const apiUrl = new URL(apiDomain);
    return apiUrl.hostname === currentDomain || apiUrl.hostname.endsWith(currentDomain);
  } catch (e) {
    return false;
  }
}

/**
 * Check if cookies exist in Application tab (requires manual check)
 * This function provides instructions for manual verification
 * @returns {Object} Instructions and status
 */
export function checkCookiesInApplicationTab() {
  const instructions = {
    steps: [
      '1. เปิด DevTools → Application → Cookies',
      '2. ตรวจสอบ cookies สำหรับ domain `localhost`',
      '3. ดูว่ามี cookies `access`, `refresh`, `csrftoken` หรือไม่',
      '4. ตรวจสอบว่า cookies ยังไม่หมดอายุ (ดู Expires / Max-Age)',
      '5. ตรวจสอบว่า cookies อยู่ที่ domain `localhost` (ไม่ใช่ `127.0.0.1`)'
    ],
    note: 'HttpOnly cookies จะไม่ปรากฏใน document.cookie แต่จะปรากฏใน Application tab'
  };
  
  console.log('📋 วิธีตรวจสอบ Cookies ใน Application Tab:');
  instructions.steps.forEach(step => console.log(step));
  console.log('💡', instructions.note);
  
  return instructions;
}

/**
 * Verify cookies are being sent with requests
 * This function provides instructions for Network tab verification
 * @returns {Object} Instructions
 */
export function verifyCookiesInNetworkTab() {
  const instructions = {
    steps: [
      '1. เปิด DevTools → Network',
      '2. สร้าง post อีกครั้ง (หรือเรียก API อื่น)',
      '3. คลิกที่ request `/posts/create-with-image/`',
      '4. ดู Request Headers → Cookie',
      '5. ตรวจสอบว่ามี `access=...`, `refresh=...`, `csrftoken=...` หรือไม่',
      '6. ถ้าไม่มี Cookie header แสดงว่า cookies ไม่ถูกส่งไป'
    ],
    troubleshooting: [
      'ถ้าไม่มี Cookie header:',
      '  - Cookies อาจหมดอายุ → Login ใหม่',
      '  - Domain ไม่ตรงกัน → ตรวจสอบว่าใช้ localhost ทั้งหมด',
      '  - Backend CORS ไม่ถูกต้อง → ดู BACKEND_COOKIE_ISSUE.md'
    ]
  };
  
  console.log('🔍 วิธีตรวจสอบ Cookies ใน Network Tab:');
  instructions.steps.forEach(step => console.log(step));
  console.log('🔧 Troubleshooting:');
  instructions.troubleshooting.forEach(step => console.log(step));
  
  return instructions;
}

