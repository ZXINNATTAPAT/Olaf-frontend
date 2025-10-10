// @ts-check
const { test, expect } = require('@playwright/test');
const TestUtils = require('../utils/test-utils');

/**
 * ========================================
 * SMOKE TESTS - CRITICAL PATH
 * ========================================
 * 
 * ไฟล์นี้ทดสอบ Critical Path ของระบบ
 * ทดสอบฟังก์ชันหลักที่สำคัญที่สุด
 * 
 * คุณสมบัติพิเศษ:
 * - ใช้ TestUtils helper
 * - Critical path testing
 * - Quick validation
 * 
 * Test Cases:
 * - Smoke Test 1: User Login Flow
 * - Smoke Test 2: Post Creation Flow
 * - Smoke Test 3: Comment Addition Flow
 */

test.describe('Smoke Tests - Critical Path', () => {
  
test.describe('Smoke Tests - Critical Path', () => {
  
  /**
   * Smoke Test 1: User Login Flow
   * 
   * ทดสอบ Critical Path การ Login
   * ตรวจสอบว่า:
   * - สามารถ login ได้
   * - ไปหน้า feed ได้
   * - Navigation ทำงาน
   */
  test('Smoke Test 1: User Login Flow', async ({ page }) => {
    await TestUtils.loginUser(page, 'testuser@example.com', 'TestPass123!');
    
    // Verify user is on feed page
    await expect(page.locator('text=Feed')).toBeVisible();
    
    // Verify user can see navigation
    await expect(page.locator('nav')).toBeVisible();
  });

  /**
   * Smoke Test 2: Post Creation Flow
   * 
   * ทดสอบ Critical Path การสร้าง Post
   * ตรวจสอบว่า:
   * - สามารถสร้าง Post ได้
   * - Post ปรากฏใน Feed
   */
  test('Smoke Test 2: Post Creation Flow', async ({ page }) => {
    await TestUtils.loginUser(page, 'testuser@example.com', 'TestPass123!');
    
    const testData = TestUtils.generateTestData();
    await TestUtils.createPost(page, testData.postContent);
    
    // Verify post appears in feed
    await expect(page.locator(`text=${testData.postContent}`)).toBeVisible();
  });

  /**
   * Smoke Test 3: Comment Addition Flow
   * 
   * ทดสอบ Critical Path การเพิ่ม Comment
   * ตรวจสอบว่า:
   * - สามารถเพิ่ม Comment ได้
   * - Comment ปรากฏใน Post
   */
  test('Smoke Test 3: Comment Addition Flow', async ({ page }) => {
    await TestUtils.loginUser(page, 'testuser@example.com', 'TestPass123!');
    
    const testData = TestUtils.generateTestData();
    await TestUtils.createPost(page, testData.postContent);
    await TestUtils.addComment(page, testData.commentContent);
    
    // Verify comment appears
    await expect(page.locator(`text=${testData.commentContent}`)).toBeVisible();
  });
});
