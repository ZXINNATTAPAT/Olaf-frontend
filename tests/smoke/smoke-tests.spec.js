// @ts-check
const { test, expect } = require('@playwright/test');
const TestUtils = require('../utils/test-utils');

test.describe('Smoke Tests - Critical Path', () => {
  
  test('Smoke Test 1: User Login Flow', async ({ page }) => {
    await TestUtils.loginUser(page, 'testuser@example.com', 'TestPass123!');
    
    // Verify user is on feed page
    await expect(page.locator('text=Feed')).toBeVisible();
    
    // Verify user can see navigation
    await expect(page.locator('nav')).toBeVisible();
  });

  test('Smoke Test 2: Post Creation Flow', async ({ page }) => {
    await TestUtils.loginUser(page, 'testuser@example.com', 'TestPass123!');
    
    const testData = TestUtils.generateTestData();
    await TestUtils.createPost(page, testData.postContent);
    
    // Verify post appears in feed
    await expect(page.locator(`text=${testData.postContent}`)).toBeVisible();
  });

  test('Smoke Test 3: Comment Addition Flow', async ({ page }) => {
    await TestUtils.loginUser(page, 'testuser@example.com', 'TestPass123!');
    
    const testData = TestUtils.generateTestData();
    await TestUtils.createPost(page, testData.postContent);
    await TestUtils.addComment(page, testData.commentContent);
    
    // Verify comment appears
    await expect(page.locator(`text=${testData.commentContent}`)).toBeVisible();
  });
});
