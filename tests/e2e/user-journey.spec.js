// @ts-check
const { test, expect } = require('@playwright/test');

// Test data
const testData = {
  validUser: {
    email: 'testuser@example.com',
    password: 'TestPass123!',
    username: 'testuser'
  }
};

test.describe('End-to-End User Journey Tests', () => {
  
  test('Complete User Journey - Registration to Post Creation', async ({ page }) => {
    // Step 1: Registration
    await page.goto('/auth/register');
    await page.fill('input[id="email"]', testData.validUser.email);
    await page.fill('input[id="password"]', testData.validUser.password);
    await page.fill('input[id="firstName"]', testData.validUser.username);
    await page.click('button[type="submit"]');
    
    // Verify redirect to login
    await expect(page).toHaveURL('/auth/login');
    
    // Step 2: Login
    await page.fill('input[id="email"]', testData.validUser.email);
    await page.fill('input[id="password"]', testData.validUser.password);
    await page.click('button[type="submit"]');
    
    // Verify redirect to feed
    await expect(page).toHaveURL('/feed');
    
    // Step 3: Create Post
    await page.goto('/addcontent');
    await page.fill('input[name="header"]', 'My First Post');
    await page.fill('input[name="short"]', 'Short Description');
    await page.fill('textarea[name="post_text"]', 'This is my first post!');
    await page.click('button[type="submit"]');
    
    // Verify redirect to feed and post appears
    await expect(page).toHaveURL('/feed');
    await expect(page.locator('text=This is my first post!')).toBeVisible();
    
    // Step 4: Add Comment
    await page.click('div[data-testid="post-item"]');
    await page.fill('textarea[name="comment"]', 'Great post!');
    await page.click('button[data-testid="submit-comment"]');
    
    // Verify comment appears
    await expect(page.locator('text=Great post!')).toBeVisible();
    
    // Step 5: Like Post
    await page.click('button[data-testid="like-button"]');
    await page.waitForTimeout(1000);
    
    // Verify like is registered
    const likeButton = page.locator('button[data-testid="like-button"]');
    await expect(likeButton).toHaveClass(/liked/);
    
    // Step 6: Logout
    await page.click('button[data-testid="logout-button"]');
    await expect(page).toHaveURL('/');
  });

  test('Error Handling Journey', async ({ page }) => {
    // Step 1: Try invalid login
    await page.goto('/auth/login');
    await page.fill('input[id="email"]', 'invalid@test.com');
    await page.fill('input[id="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Verify error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    
    // Step 2: Try registration with duplicate email
    await page.goto('/auth/register');
    await page.fill('input[id="email"]', 'existing@test.com');
    await page.fill('input[id="password"]', 'TestPass123!');
    await page.fill('input[id="firstName"]', 'existinguser');
    await page.click('button[type="submit"]');
    
    // Verify duplicate email error
    await expect(page.locator('text=Email already exists')).toBeVisible();
    
    // Step 3: Try to access protected route
    await page.goto('/feed');
    await expect(page).toHaveURL('/auth/login');
  });

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
