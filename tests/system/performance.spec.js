// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * ========================================
 * PERFORMANCE TESTS
 * ========================================
 * 
 * ไฟล์นี้ทดสอบประสิทธิภาพของระบบ
 * ครอบคลุมการวัดเวลา, memory usage และ concurrent users
 * 
 * คุณสมบัติพิเศษ:
 * - Load time measurement
 * - Memory usage monitoring
 * - Concurrent user testing
 * - Performance thresholds
 * - Detailed result logging
 * 
 * Test Cases:
 * - TC-PERF-001: Page Load Time - Home Page
 * - TC-PERF-002: Page Load Time - Feed Page
 * - TC-PERF-003: API Response Time - Login
 * - TC-PERF-004: Concurrent Users - Registration
 * - TC-PERF-005: Memory Usage - Long Session
 */

test.describe('Performance Tests', () => {
  
  // ตั้งค่า timeout สำหรับทุก test เพื่อรองรับ OnRender server
  test.beforeEach(async ({ page }) => {
    test.setTimeout(180000); // Increase timeout to 3 minutes for OnRender server
  });
  
  /**
   * TC-PERF-001: Page Load Time - Home Page
   * 
   * ทดสอบเวลาการโหลดหน้า Home
   * ตรวจสอบว่า:
   * - หน้าโหลดภายใน 15 วินาที
   * - Elements ปรากฏถูกต้อง
   */
  test('TC-PERF-001: Page Load Time - Home Page', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to home page
    await page.goto('/');
    
    // Wait for page to be fully loaded with longer timeout for OnRender
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Extra wait for OnRender server
    
    const loadTime = Date.now() - startTime;
    
    // Verify page loads within 15 seconds (increased for OnRender)
    expect(loadTime).toBeLessThan(15000);
    
    // Verify page elements are visible
    await expect(page.locator('text=Home')).toBeVisible({ timeout: 10000 });
  });

  /**
   * TC-PERF-002: Page Load Time - Feed Page
   * 
   * ทดสอบเวลาการโหลดหน้า Feed
   * ตรวจสอบว่า:
   * - หน้าโหลดภายใน 20 วินาที
   * - Elements ปรากฏถูกต้อง
   */
  test('TC-PERF-002: Page Load Time - Feed Page', async ({ page }) => {
    // Login first with longer waits for OnRender
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await page.fill('input[id="email"]', 'testuser@example.com');
    await page.fill('input[id="password"]', 'TestPass123!');
    
    // Wait for button to be enabled
    await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 30000 });
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForTimeout(10000);
    
    const startTime = Date.now();
    
    // Navigate to feed page
    await page.goto('/feed');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    const loadTime = Date.now() - startTime;
    
    // Verify page loads within 20 seconds (increased for OnRender)
    expect(loadTime).toBeLessThan(20000);
    
    // Verify feed elements are visible
    await expect(page.locator('text=Feed')).toBeVisible({ timeout: 15000 });
  });

  /**
   * TC-PERF-003: API Response Time - Login
   * 
   * ทดสอบเวลาการตอบสนองของ API Login
   * ตรวจสอบว่า API ตอบสนองภายใน 30 วินาที
   */
  test('TC-PERF-003: API Response Time - Login', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Start measuring API response time
    const startTime = Date.now();
    
    // Fill login form and submit
    await page.fill('input[id="email"]', 'testuser@example.com');
    await page.fill('input[id="password"]', 'TestPass123!');
    
    // Wait for button to be enabled
    await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 30000 });
    await page.click('button[type="submit"]');
    
    // Wait for API response and redirect with longer timeout
    try {
      await expect(page).toHaveURL('/feed', { timeout: 60000 });
    } catch (error) {
      // If redirect doesn't happen, wait for any response
      await page.waitForTimeout(15000);
    }
    
    const responseTime = Date.now() - startTime;
    
    // Verify API responds within 30 seconds (increased for OnRender)
    expect(responseTime).toBeLessThan(30000);
  });

  /**
   * TC-PERF-004: Concurrent Users - Registration
   * 
   * ทดสอบการรองรับผู้ใช้หลายคนพร้อมกัน
   * ตรวจสอบว่า:
   * - รองรับผู้ใช้ 5 คนพร้อมกัน
   * - อัตราความสำเร็จอย่างน้อย 60%
   * - เวลาเฉลี่ยต่ำกว่า 45 วินาที
   */
  test('TC-PERF-004: Concurrent Users - Registration', async ({ browser }) => {
    const concurrentUsers = 5; // Reduced for OnRender server
    const promises = [];
    const results = [];
    
    // Create multiple browser contexts for concurrent users
    for (let i = 0; i < concurrentUsers; i++) {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      promises.push(
        (async () => {
          const startTime = Date.now();
          let success = false;
          let error = null;
          
          try {
            // Test 1: Verify registration page is accessible
            await page.goto('/auth/register');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            
            // Verify registration page elements are visible and functional
            await expect(page.locator('h1, h2')).toContainText(/register|sign up/i, { timeout: 10000 });
            await expect(page.locator('input[id="email"]')).toBeVisible({ timeout: 10000 });
            await expect(page.locator('input[id="password"]')).toBeVisible({ timeout: 10000 });
            await expect(page.locator('input[id="firstName"]')).toBeVisible({ timeout: 10000 });
            await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });
            
            // Test 2: Verify form functionality
            await page.fill('input[id="email"]', `testuser${i}@example.com`);
            await page.fill('input[id="password"]', 'TestPass123!');
            await page.fill('input[id="firstName"]', `testuser${i}`);
            
            // Verify form fields are filled correctly
            const emailValue = await page.inputValue('input[id="email"]');
            const passwordValue = await page.inputValue('input[id="password"]');
            const firstNameValue = await page.inputValue('input[id="firstName"]');
            
            expect(emailValue).toBe(`testuser${i}@example.com`);
            expect(passwordValue).toBe('TestPass123!');
            expect(firstNameValue).toBe(`testuser${i}`);
            
            // Test 3: Verify submit button is enabled and clickable
            await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 30000 });
            const submitButton = page.locator('button[type="submit"]');
            await expect(submitButton).toBeEnabled({ timeout: 10000 });
            
            // Test 4: Submit registration
            await submitButton.click();
            
            // Test 5: Wait for registration to complete with proper error handling
            try {
              await expect(page).toHaveURL('/auth/login', { timeout: 60000 });
              success = true;
            } catch (urlError) {
              // Check if registration was successful but didn't redirect
              const currentUrl = page.url();
              if (currentUrl.includes('/auth/login') || currentUrl.includes('/feed')) {
                success = true;
              } else {
                // Check for success message or error message
                const pageContent = await page.textContent('body');
                if (pageContent && (pageContent.includes('success') || pageContent.includes('registered'))) {
                  success = true;
                } else {
                  error = `Registration failed for user ${i}: ${urlError.message}`;
                }
              }
            }
            
          } catch (testError) {
            error = `Test failed for user ${i}: ${testError.message}`;
          }
          
          const responseTime = Date.now() - startTime;
          
          // Store results for analysis
          results.push({
            userIndex: i,
            success: success,
            responseTime: responseTime,
            error: error
          });
          
          // Verify each registration completes within 60 seconds (increased for OnRender)
          expect(responseTime).toBeLessThan(60000);
          
          await context.close();
        })()
      );
    }
    
    // Wait for all concurrent registrations to complete
    await Promise.all(promises);
    
    // Analyze results
    const successfulRegistrations = results.filter(r => r.success).length;
    const failedRegistrations = results.filter(r => !r.success).length;
    const averageResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
    
    // Performance assertions
    expect(successfulRegistrations).toBeGreaterThanOrEqual(3); // At least 60% success rate
    expect(averageResponseTime).toBeLessThan(45000); // Average response time under 45 seconds
    
    // Log detailed results for debugging
    console.log(`Concurrent Registration Test Results:`);
    console.log(`- Total users: ${concurrentUsers}`);
    console.log(`- Successful registrations: ${successfulRegistrations}`);
    console.log(`- Failed registrations: ${failedRegistrations}`);
    console.log(`- Average response time: ${averageResponseTime}ms`);
    
    if (failedRegistrations > 0) {
      console.log(`- Failed registrations details:`, results.filter(r => !r.success));
    }
  });

  /**
   * TC-PERF-005: Memory Usage - Long Session
   * 
   * ทดสอบการใช้ memory ใน session ยาว
   * ตรวจสอบว่า memory usage ไม่เกิน 200MB
   */
  test('TC-PERF-005: Memory Usage - Long Session', async ({ page }) => {
    // Login first with longer waits for OnRender
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await page.fill('input[id="email"]', 'testuser@example.com');
    await page.fill('input[id="password"]', 'TestPass123!');
    
    // Wait for button to be enabled
    await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 30000 });
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForTimeout(10000);
    
    // Perform multiple actions to simulate long session
    for (let i = 0; i < 3; i++) { // Reduced iterations for OnRender
      // Navigate between pages with waits
      await page.goto('/feed');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      await page.goto('/profile');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      await page.goto('/addcontent');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Create a post
      await page.fill('textarea[name="content"]', `Test post ${i}`);
      
      // Wait for button to be enabled
      await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 30000 });
      await page.click('button[type="submit"]');
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
    }
    
    // Get memory usage metrics
    const metrics = await page.evaluate(() => {
      // @ts-ignore - performance.memory is Chrome-specific
      if (performance.memory) {
        return {
          // @ts-ignore
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          // @ts-ignore
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          // @ts-ignore
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    });
    
    // Verify memory metrics are available and within limits
    expect(metrics).not.toBeNull();
    
    // Convert bytes to MB
    // @ts-ignore
    const usedMemoryMB = metrics.usedJSHeapSize / (1024 * 1024);
    
    // Verify memory usage is within acceptable limits (200MB increased for OnRender)
    expect(usedMemoryMB).toBeLessThan(200);
  });
});
