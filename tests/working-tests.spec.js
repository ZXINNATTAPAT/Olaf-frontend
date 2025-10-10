// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * ========================================
 * WORKING TESTS - NO BACKEND REQUIRED
 * ========================================
 * 
 * ไฟล์นี้ทดสอบพื้นฐานที่ทำงานได้เสมอ
 * ไม่ต้องใช้ Backend สามารถรันได้ในทุกสถานการณ์
 * 
 * คุณสมบัติพิเศษ:
 * - ไม่ต้องใช้ Backend
 * - Basic functionality testing
 * - Form element verification
 * - Navigation testing
 * 
 * Test Cases:
 * - Test 1: Page Navigation Works
 * - Test 2: Form Elements Exist
 * - Test 3: Form Validation Works
 * - Test 4: Protected Route Redirect
 * - Test 5: Form Submission Without Backend
 */

test.describe('Working Tests - No Backend Required', () => {
  
test.describe('Working Tests - No Backend Required', () => {
  
  /**
   * Test 1: Page Navigation Works
   * 
   * ทดสอบการนำทางระหว่างหน้า
   * ตรวจสอบว่า:
   * - หน้า Home โหลดได้
   * - หน้า Login โหลดได้
   * - หน้า Register โหลดได้
   */
  test('Test 1: Page Navigation Works', async ({ page }) => {
    test.setTimeout(60000);
    
    // Test home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
    console.log('✅ Home page loads correctly');
    
    // Test login page
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/auth/login');
    console.log('✅ Login page loads correctly');
    
    // Test register page
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/auth/register');
    console.log('✅ Register page loads correctly');
  });

  /**
   * Test 2: Form Elements Exist
   * 
   * ทดสอบว่า Form Elements มีอยู่
   * ตรวจสอบว่า:
   * - Login form elements ครบถ้วน
   * - Register form elements ครบถ้วน
   */
  test('Test 2: Form Elements Exist', async ({ page }) => {
    test.setTimeout(60000);
    
    // Test login form elements
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    console.log('✅ Login form elements exist');
    
    // Test register form elements
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
    await expect(page.locator('input[id="username"]')).toBeVisible();
    await expect(page.locator('input[id="firstName"]')).toBeVisible();
    await expect(page.locator('input[id="lastName"]')).toBeVisible();
    await expect(page.locator('input[id="phone"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    console.log('✅ Register form elements exist');
  });

  /**
   * Test 3: Form Validation Works
   * 
   * ทดสอบ Form Validation
   * ตรวจสอบว่า:
   * - ปุ่ม disabled เมื่อฟิลด์ว่าง
   * - ปุ่ม enabled เมื่อกรอกข้อมูลครบ
   */
  test('Test 3: Form Validation Works', async ({ page }) => {
    test.setTimeout(60000);
    
    // Test login form validation
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
    
    await page.fill('input[id="email"]', 'test@example.com');
    await expect(submitButton).toBeDisabled();
    
    await page.fill('input[id="password"]', 'password123');
    await expect(submitButton).toBeEnabled();
    console.log('✅ Login form validation works');
  });

  /**
   * Test 4: Protected Route Redirect
   * 
   * ทดสอบการ redirect ของ Protected Route
   * ตรวจสอบว่า:
   * - ถูก redirect ไปหน้า login เมื่อเข้าถึง /feed
   * - ไม่สามารถเข้าถึงได้โดยไม่ login
   */
  test('Test 4: Protected Route Redirect', async ({ page }) => {
    test.setTimeout(60000);
    
    // Clear any existing session
    await page.context().clearCookies();
    
    // Try to access protected route
    await page.goto('/feed');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to login page
    await expect(page).toHaveURL('/auth/login');
    console.log('✅ Protected route redirect works');
  });

  /**
   * Test 5: Form Submission Without Backend
   * 
   * ทดสอบการ submit form โดยไม่ใช้ Backend
   * ตรวจสอบว่า:
   * - Form ทำงานได้ (จะ fail แต่ไม่ error)
   * - Validation ทำงาน
   */
  test('Test 5: Form Submission Without Backend', async ({ page }) => {
    test.setTimeout(60000);
    
    // Test register form submission (will fail but should show form works)
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');
    
    // Fill all required fields
    await page.fill('input[id="email"]', 'test@example.com');
    await page.fill('input[id="password"]', 'password123');
    await page.fill('input[id="passwordConfirmation"]', 'password123');
    await page.fill('input[id="username"]', 'testuser');
    await page.fill('input[id="firstName"]', 'Test');
    await page.fill('input[id="lastName"]', 'User');
    await page.fill('input[id="phone"]', '0123456789');
    
    // Check if button is enabled
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
    
    // Try to submit (will fail due to no backend, but form should work)
    await submitButton.click();
    
    // Wait a bit to see what happens
    await page.waitForTimeout(2000);
    
    console.log('✅ Form submission attempt completed');
  });
});
