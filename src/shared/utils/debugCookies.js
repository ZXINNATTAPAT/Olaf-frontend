/**
 * Cookie Debugging Utilities
 * ใช้สำหรับตรวจสอบและ debug ปัญหา cookies
 */

/**
 * ตรวจสอบ cookies ทั้งหมดใน browser
 */
export function checkAllCookies() {
  console.log('='.repeat(50));
  console.log('🍪 Cookie Debug Information');
  console.log('='.repeat(50));
  
  // Check document.cookie (non-HttpOnly cookies only)
  const documentCookies = document.cookie;
  console.log('📋 document.cookie:', documentCookies || '(empty)');
  
  // Parse cookies
  const cookies = {};
  if (documentCookies) {
    documentCookies.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
    });
  }
  
  console.log('📋 Parsed cookies:', cookies);
  console.log('📋 Has csrftoken:', !!cookies.csrftoken);
  
  // Note about HttpOnly cookies
  console.log('');
  console.log('⚠️  Note: HttpOnly cookies (access, refresh) are not accessible via JavaScript');
  console.log('⚠️  Check DevTools → Application → Cookies to see all cookies');
  console.log('');
  
  // Instructions
  console.log('📝 Instructions:');
  console.log('1. Open DevTools → Application → Cookies');
  console.log('2. Check if these cookies exist:');
  console.log('   - access (access token)');
  console.log('   - refresh (refresh token)');
  console.log('   - csrftoken (CSRF token)');
  console.log('3. Check Network tab → Request Headers → Cookie');
  console.log('4. If cookies are missing, try logging in again');
  console.log('='.repeat(50));
  
  return {
    documentCookies,
    parsedCookies: cookies,
    hasCSRFToken: !!cookies.csrftoken,
    note: 'HttpOnly cookies are not accessible via JavaScript'
  };
}

/**
 * ตรวจสอบ cookies ใน Application tab
 */
export function checkApplicationTabCookies() {
  console.log('='.repeat(50));
  console.log('🍪 Application Tab Cookie Check');
  console.log('='.repeat(50));
  console.log('');
  console.log('📝 Manual Check Required:');
  console.log('1. Open DevTools (F12)');
  console.log('2. Go to Application tab');
  console.log('3. Click on Cookies in the left sidebar');
  console.log('4. Select your domain (localhost:3000 or localhost:8000)');
  console.log('5. Check for these cookies:');
  console.log('   ✅ access - Access token (HttpOnly)');
  console.log('   ✅ refresh - Refresh token (HttpOnly)');
  console.log('   ✅ csrftoken - CSRF token');
  console.log('');
  console.log('If cookies are missing:');
  console.log('  → Try logging in again');
  console.log('  → Check backend logs for cookie setting');
  console.log('  → Check Network tab → Login response → Set-Cookie headers');
  console.log('='.repeat(50));
}

/**
 * ตรวจสอบ Network request cookies
 */
export function checkNetworkRequestCookies() {
  console.log('='.repeat(50));
  console.log('🍪 Network Request Cookie Check');
  console.log('='.repeat(50));
  console.log('');
  console.log('📝 Manual Check Required:');
  console.log('1. Open DevTools (F12)');
  console.log('2. Go to Network tab');
  console.log('3. Make a request (e.g., create post)');
  console.log('4. Click on the request');
  console.log('5. Check Request Headers → Cookie:');
  console.log('   Should contain: access=..., refresh=..., csrftoken=...');
  console.log('');
  console.log('If Cookie header is missing or empty:');
  console.log('  → Cookies are not being sent');
  console.log('  → Check Application tab → Cookies to see if cookies exist');
  console.log('  → Try logging in again');
  console.log('='.repeat(50));
}

/**
 * ตรวจสอบ CORS และ cookie settings
 */
export function checkCORSSettings() {
  console.log('='.repeat(50));
  console.log('🌐 CORS & Cookie Settings Check');
  console.log('='.repeat(50));
  
  const apiURL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000/api';
  const frontendURL = window.location.origin;
  
  console.log('Frontend URL:', frontendURL);
  console.log('Backend API URL:', apiURL);
  console.log('');
  console.log('Expected CORS settings:');
  console.log('  - CORS_ALLOWED_ORIGINS should include:', frontendURL);
  console.log('  - CORS_ALLOW_CREDENTIALS should be: true');
  console.log('  - Cookie SameSite should be: None (for cross-origin)');
  console.log('  - Cookie Secure should be: false (for localhost)');
  console.log('');
  console.log('To verify:');
  console.log('  1. Check Network tab → Response Headers');
  console.log('  2. Look for: Access-Control-Allow-Origin, Access-Control-Allow-Credentials');
  console.log('  3. Check Set-Cookie headers in login response');
  console.log('='.repeat(50));
  
  return {
    frontendURL,
    apiURL,
    isCrossOrigin: new URL(apiURL).origin !== frontendURL
  };
}

/**
 * รันการตรวจสอบทั้งหมด
 */
export function runFullCookieDiagnostic() {
  console.log('\n');
  console.log('🔍 Starting Full Cookie Diagnostic...\n');
  
  checkAllCookies();
  console.log('\n');
  checkApplicationTabCookies();
  console.log('\n');
  checkNetworkRequestCookies();
  console.log('\n');
  checkCORSSettings();
  console.log('\n');
  
  console.log('✅ Diagnostic complete!');
  console.log('📝 If cookies are missing, try:');
  console.log('   1. Logout and login again');
  console.log('   2. Clear browser cookies and login again');
  console.log('   3. Check backend logs for cookie setting errors');
  console.log('\n');
}

