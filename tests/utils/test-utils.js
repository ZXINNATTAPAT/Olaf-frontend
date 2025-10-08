// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Utility functions for test automation
 */
class TestUtils {
  
  /**
   * Login user with provided credentials
   * @param {import('@playwright/test').Page} page 
   * @param {string} email 
   * @param {string} password 
   */
  static async loginUser(page, email, password) {
    await page.goto('/auth/login');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/feed');
  }

  /**
   * Register new user
   * @param {import('@playwright/test').Page} page 
   * @param {string} email 
   * @param {string} password 
   * @param {string} username 
   */
  static async registerUser(page, email, password, username) {
    await page.goto('/auth/register');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.fill('input[id="firstName"]', username);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/auth/login');
  }

  /**
   * Create a post
   * @param {import('@playwright/test').Page} page 
   * @param {string} content 
   */
  static async createPost(page, content) {
    await page.goto('/addcontent');
    await page.fill('input[name="header"]', 'Test Post Header');
    await page.fill('input[name="short"]', 'Test Post Short Description');
    await page.fill('textarea[name="post_text"]', content);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/feed');
  }

  /**
   * Add comment to a post
   * @param {import('@playwright/test').Page} page 
   * @param {string} comment 
   */
  static async addComment(page, comment) {
    await page.click('div[data-testid="post-item"]');
    await page.fill('textarea[name="comment"]', comment);
    await page.click('button[data-testid="submit-comment"]');
  }

  /**
   * Like a post
   * @param {import('@playwright/test').Page} page 
   */
  static async likePost(page) {
    await page.click('button[data-testid="like-button"]');
    await page.waitForTimeout(1000);
  }

  /**
   * Logout user
   * @param {import('@playwright/test').Page} page 
   */
  static async logoutUser(page) {
    await page.click('button[data-testid="logout-button"]');
    await expect(page).toHaveURL('/');
  }

  /**
   * Wait for element to be visible with timeout
   * @param {import('@playwright/test').Page} page 
   * @param {string} selector 
   * @param {number} timeout 
   */
  static async waitForElement(page, selector, timeout = 5000) {
    await page.waitForSelector(selector, { timeout });
  }

  /**
   * Take screenshot with timestamp
   * @param {import('@playwright/test').Page} page 
   * @param {string} name 
   */
  static async takeScreenshot(page, name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ path: `screenshots/${name}-${timestamp}.png` });
  }

  /**
   * Generate random test data
   */
  static generateTestData() {
    const timestamp = Date.now();
    return {
      email: `testuser${timestamp}@example.com`,
      password: 'TestPass123!',
      username: `testuser${timestamp}`,
      postContent: `Test post ${timestamp}`,
      commentContent: `Test comment ${timestamp}`
    };
  }

  /**
   * Measure page load time
   * @param {import('@playwright/test').Page} page 
   * @param {string} url 
   */
  static async measurePageLoadTime(page, url) {
    const startTime = Date.now();
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    return loadTime;
  }

  /**
   * Check if element exists without throwing error
   * @param {import('@playwright/test').Page} page 
   * @param {string} selector 
   */
  static async elementExists(page, selector) {
    try {
      await page.waitForSelector(selector, { timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = TestUtils;
