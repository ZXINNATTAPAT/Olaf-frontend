// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * ========================================
 * END-TO-END USER JOURNEY TESTS
 * ========================================
 * 
 * ไฟล์นี้ทดสอบ User Journey แบบครบวงจร
 * ครอบคลุมการใช้งานจริงของผู้ใช้ตั้งแต่ต้นจนจบ
 * 
 * คุณสมบัติพิเศษ:
 * - End-to-end workflow testing
 * - Concurrent user testing
 * - Performance measurement
 * - Error scenario testing
 * 
 * Test Scenarios:
 * - Complete User Journey (Registration → Login → Post Creation → Comment → Like → Logout)
 * - Error Handling Journey
 * - Performance Under Load Journey
 */

// Test data สำหรับการทดสอบ
const testData = {
  validUser: {
    email: 'testuser@example.com',
    password: 'TestPass123!',
    username: 'testuser'
  }
};

test.describe('End-to-End User Journey Tests', () => {
  
test.describe('End-to-End User Journey Tests', () => {
  
  /**
   * Complete User Journey - Registration to Post Creation
   * 
   * ทดสอบ User Journey แบบครบวงจร:
   * 1. Registration (สมัครสมาชิก)
   * 2. Login (เข้าสู่ระบบ)
   * 3. Create Post (สร้าง Post)
   * 4. Add Comment (เพิ่ม Comment)
   * 5. Like Post (Like Post)
   * 6. Logout (ออกจากระบบ)
   * 
   * ตรวจสอบว่าทุกขั้นตอนทำงานได้ถูกต้อง
   */
  test('Complete User Journey - Registration to Post Creation', async ({ page }) => {
    // Step 1: Registration - สมัครสมาชิก
    await page.goto('/auth/register');
    await page.fill('input[id="email"]', testData.validUser.email);
    await page.fill('input[id="password"]', testData.validUser.password);
    await page.fill('input[id="firstName"]', testData.validUser.username);
    await page.click('button[type="submit"]');
    
    // ตรวจสอบการ redirect ไปหน้า login
    await expect(page).toHaveURL('/auth/login');
    
    // Step 2: Login - เข้าสู่ระบบ
    await page.fill('input[id="email"]', testData.validUser.email);
    await page.fill('input[id="password"]', testData.validUser.password);
    await page.click('button[type="submit"]');
    
    // ตรวจสอบการ redirect ไปหน้า feed
    await expect(page).toHaveURL('/feed');
    
    // Step 3: Create Post - สร้าง Post
    await page.goto('/addcontent');
    await page.fill('input[name="header"]', 'My First Post');
    await page.fill('input[name="short"]', 'Short Description');
    await page.fill('textarea[name="post_text"]', 'This is my first post!');
    await page.click('button[type="submit"]');
    
    // ตรวจสอบการ redirect ไปหน้า feed และ Post ปรากฏ
    await expect(page).toHaveURL('/feed');
    await expect(page.locator('text=This is my first post!')).toBeVisible();
    
    // Step 4: Add Comment - เพิ่ม Comment
    await page.click('div[data-testid="post-item"]');
    await page.fill('textarea[name="comment"]', 'Great post!');
    await page.click('button[data-testid="submit-comment"]');
    
    // ตรวจสอบว่า Comment ปรากฏ
    await expect(page.locator('text=Great post!')).toBeVisible();
    
    // Step 5: Like Post - Like Post
    await page.click('button[data-testid="like-button"]');
    await page.waitForTimeout(1000);
    
    // ตรวจสอบว่า Like ถูกบันทึก
    const likeButton = page.locator('button[data-testid="like-button"]');
    await expect(likeButton).toHaveClass(/liked/);
    
    // Step 6: Logout - ออกจากระบบ
    await page.click('button[data-testid="logout-button"]');
    await expect(page).toHaveURL('/');
  });

  /**
   * Error Handling Journey
   * 
   * ทดสอบการจัดการ Error ใน User Journey:
   * 1. Invalid login (login ไม่สำเร็จ)
   * 2. Duplicate email registration (email ซ้ำ)
   * 3. Protected route access (เข้าถึง route ที่ต้อง login)
   * 
   * ตรวจสอบว่าระบบจัดการ error ได้ถูกต้อง
   */
  test('Error Handling Journey', async ({ page }) => {
    // Step 1: Try invalid login - ลอง login ด้วยข้อมูลผิด
    await page.goto('/auth/login');
    await page.fill('input[id="email"]', 'invalid@test.com');
    await page.fill('input[id="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // ตรวจสอบข้อความ error
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    
    // Step 2: Try registration with duplicate email - ลองสมัครด้วย email ที่มีอยู่แล้ว
    await page.goto('/auth/register');
    await page.fill('input[id="email"]', 'existing@test.com');
    await page.fill('input[id="password"]', 'TestPass123!');
    await page.fill('input[id="firstName"]', 'existinguser');
    await page.click('button[type="submit"]');
    
    // ตรวจสอบข้อความ error สำหรับ email ซ้ำ
    await expect(page.locator('text=Email already exists')).toBeVisible();
    
    // Step 3: Try to access protected route - ลองเข้าถึง route ที่ต้อง login
    await page.goto('/feed');
    await expect(page).toHaveURL('/auth/login');
  });

  /**
   * Performance Under Load Journey
   * 
   * ทดสอบประสิทธิภาพภายใต้ภาระงาน:
   * - สร้างผู้ใช้หลายคนพร้อมกัน (5 users)
   * - ทดสอบการ login, สร้าง post, เพิ่ม comment, like
   * - วัดเวลาการทำงานทั้งหมด
   * 
   * ตรวจสอบว่าระบบสามารถรองรับผู้ใช้หลายคนได้
   */
  test('Performance Under Load Journey', async ({ browser }) => {
    const concurrentUsers = 5;
    const promises = [];
    
    for (let i = 0; i < concurrentUsers; i++) {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      promises.push(
        (async () => {
          const startTime = Date.now();
          
          // Login
          await page.goto('/auth/login');
          await page.fill('input[id="email"]', `testuser${i}@example.com`);
          await page.fill('input[id="password"]', 'TestPass123!');
          await page.click('button[type="submit"]');
          
          // Create post
          await page.goto('/addcontent');
          await page.fill('input[name="header"]', `Concurrent Post ${i}`);
          await page.fill('input[name="short"]', `Short Description ${i}`);
          await page.fill('textarea[name="post_text"]', `Concurrent post ${i}`);
          await page.click('button[type="submit"]');
          
          // Add comment
          await page.click('div[data-testid="post-item"]');
          await page.fill('textarea[name="comment"]', `Comment ${i}`);
          await page.click('button[data-testid="submit-comment"]');
          
          // Like post
          await page.click('button[data-testid="like-button"]');
          
          const totalTime = Date.now() - startTime;
          
          // Verify all operations complete within reasonable time
          expect(totalTime).toBeLessThan(10000);
          
          await context.close();
        })()
      );
    }
    
    await Promise.all(promises);
  });
});
