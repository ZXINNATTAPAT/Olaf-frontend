// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Basic UI Tests - No Backend Required', () => {
  
  test('Check Login Page UI Elements', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Check if page loads correctly
    await expect(page).toHaveURL('/auth/login');
    
    // Check if main elements are visible
    await expect(page.locator('h1:has-text("OLAF")')).toBeVisible();
    await expect(page.locator('button[type="submit"]:has-text("Sign In")')).toBeVisible();
    
    // Check form elements
    const emailInput = page.locator('input[id="email"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Check if submit button is initially disabled
    await expect(submitButton).toBeDisabled();
    
    console.log('✅ Login page UI elements are working correctly');
  });

  test('Check Register Page UI Elements', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');
    
    // Check if page loads correctly
    await expect(page).toHaveURL('/auth/register');
    
    // Check if main elements are visible
    await expect(page.locator('h1:has-text("OLAF")')).toBeVisible();
    await expect(page.locator('text=Sign Up')).toBeVisible();
    
    // Check form elements
    const emailInput = page.locator('input[id="email"]');
    const passwordInput = page.locator('input[id="password"]');
    const usernameInput = page.locator('input[id="username"]');
    const firstNameInput = page.locator('input[id="firstName"]');
    const lastNameInput = page.locator('input[id="lastName"]');
    const phoneInput = page.locator('input[id="phone"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(usernameInput).toBeVisible();
    await expect(firstNameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();
    await expect(phoneInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Check if submit button is initially disabled
    await expect(submitButton).toBeDisabled();
    
    console.log('✅ Register page UI elements are working correctly');
  });

  test('Test Form Validation - Login', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[id="email"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Initially button should be disabled
    await expect(submitButton).toBeDisabled();
    
    // Fill email only - button should still be disabled
    await emailInput.fill('test@example.com');
    await expect(submitButton).toBeDisabled();
    
    // Fill password - button should be enabled
    await passwordInput.fill('password123');
    await expect(submitButton).toBeEnabled();
    
    console.log('✅ Login form validation is working correctly');
  });

  test('Test Form Validation - Register', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[id="email"]');
    const passwordInput = page.locator('input[id="password"]');
    const passwordConfirmationInput = page.locator('input[id="passwordConfirmation"]');
    const usernameInput = page.locator('input[id="username"]');
    const firstNameInput = page.locator('input[id="firstName"]');
    const lastNameInput = page.locator('input[id="lastName"]');
    const phoneInput = page.locator('input[id="phone"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Initially button should be disabled
    await expect(submitButton).toBeDisabled();
    
    // Fill email only - button should still be disabled
    await emailInput.fill('test@example.com');
    await expect(submitButton).toBeDisabled();
    
    // Fill password - button should still be disabled
    await passwordInput.fill('password123');
    await expect(submitButton).toBeDisabled();
    
    // Fill password confirmation - button should still be disabled
    await passwordConfirmationInput.fill('password123');
    await expect(submitButton).toBeDisabled();
    
    // Fill username - button should still be disabled
    await usernameInput.fill('testuser');
    await expect(submitButton).toBeDisabled();
    
    // Fill firstName - button should still be disabled
    await firstNameInput.fill('Test');
    await expect(submitButton).toBeDisabled();
    
    // Fill lastName - button should be enabled (all required fields filled)
    await lastNameInput.fill('User');
    await expect(submitButton).toBeEnabled();
    
    console.log('✅ Register form validation is working correctly');
  });

  test('Test Navigation', async ({ page }) => {
    test.setTimeout(60000);
    
    // Test home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1:has-text("OLAF")')).toBeVisible();
    
    // Navigate to login
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/auth/login');
    
    // Navigate to register
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/auth/register');
    
    console.log('✅ Navigation is working correctly');
  });

  test('Test Protected Route Access', async ({ page }) => {
    test.setTimeout(60000);
    
    // Clear any existing session
    await page.context().clearCookies();
    
    // Try to access protected route
    await page.goto('/feed');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to login page
    await expect(page).toHaveURL('/auth/login');
    
    console.log('✅ Protected route access is working correctly');
  });
});
