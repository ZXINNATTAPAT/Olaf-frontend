// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Working Tests - No Backend Required', () => {
  
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
