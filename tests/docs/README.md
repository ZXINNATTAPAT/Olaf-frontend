# Olaf Frontend - Test Automation Guide

## 📋 Overview

ชุดทดสอบอัตโนมัติสำหรับโปรเจกต์ Olaf Frontend ที่ใช้ Playwright เป็นเครื่องมือหลัก ประกอบด้วย **25 Test Cases** แบ่งเป็น:

- **Functional Tests**: 20 เคส
- **System Tests**: 5 เคส
- **End-to-End Tests**: 3 เคส
- **Smoke Tests**: 3 เคส

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- React application running on http://localhost:3000

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests
```bash
# Run all tests
npm run test:e2e

# Run specific test suites
npm run test:functional
npm run test:system
npm run test:smoke

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with report
npm run test:report
```

---

## 📁 Test Structure

```
tests/
├── functional/           # Functional test cases
│   ├── auth.spec.js      # Authentication tests (10 cases)
│   ├── posts.spec.js     # Posts management tests (6 cases)
│   ├── comments.spec.js   # Comments tests (2 cases)
│   └── likes.spec.js     # Likes tests (2 cases)
├── system/               # System test cases
│   └── performance.spec.js # Performance tests (5 cases)
├── e2e/                  # End-to-end tests
│   └── user-journey.spec.js # Complete user journeys (3 cases)
├── smoke/                # Smoke tests
│   └── smoke-tests.spec.js # Critical path tests (3 cases)
├── utils/                 # Test utilities
│   └── test-utils.js     # Helper functions
└── TEST_CASES.md         # Detailed test cases documentation
```

---

## 🎯 Test Categories

### 1. Functional Tests (20 Cases)

#### Authentication Module (10 cases)
- **TC-AUTH-001**: User Registration - Valid Data
- **TC-AUTH-002**: User Registration - Invalid Email
- **TC-AUTH-003**: User Registration - Weak Password
- **TC-AUTH-004**: User Registration - Duplicate Email
- **TC-AUTH-005**: User Login - Valid Credentials
- **TC-AUTH-006**: User Login - Invalid Credentials
- **TC-AUTH-007**: User Login - Empty Fields
- **TC-AUTH-008**: User Logout
- **TC-AUTH-009**: Protected Route Access
- **TC-AUTH-010**: Session Persistence

#### Posts Module (6 cases)
- **TC-POST-001**: Create Post - Valid Content
- **TC-POST-002**: Create Post - Empty Content
- **TC-POST-003**: Create Post - Long Content
- **TC-POST-004**: Edit Post - Valid Changes
- **TC-POST-005**: Delete Post
- **TC-POST-006**: View Post Details

#### Comments Module (2 cases)
- **TC-COMMENT-001**: Add Comment - Valid Content
- **TC-COMMENT-002**: Add Comment - Empty Content

#### Likes Module (2 cases)
- **TC-LIKE-001**: Like Post
- **TC-LIKE-002**: Unlike Post

### 2. System Tests (5 Cases)

#### Performance Tests (5 cases)
- **TC-PERF-001**: Page Load Time - Home Page (≤ 3s)
- **TC-PERF-002**: Page Load Time - Feed Page (≤ 5s)
- **TC-PERF-003**: API Response Time - Login (≤ 2s)
- **TC-PERF-004**: Concurrent Users - Registration (10 users, ≤ 5s)
- **TC-PERF-005**: Memory Usage - Long Session (≤ 100MB)

### 3. End-to-End Tests (3 Cases)
- Complete User Journey - Registration to Post Creation
- Error Handling Journey
- Performance Under Load Journey

### 4. Smoke Tests (3 Cases)
- User Login Flow
- Post Creation Flow
- Comment Addition Flow

---

## 🔧 Configuration

### Playwright Configuration (`playwright.config.js`)
```javascript
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

---

## 📊 Test Data

### Test Users
```javascript
const testData = {
  validUser: {
    email: 'testuser@example.com',
    password: 'TestPass123!',
    username: 'testuser'
  },
  invalidUser: {
    email: 'invalid@test.com',
    password: 'WrongPass'
  },
  duplicateUser: {
    email: 'existing@test.com',
    password: 'TestPass123!',
    username: 'existinguser'
  }
};
```

### Test Content
```javascript
const testContent = {
  validPost: 'This is a test post for automation testing',
  longPost: 'A'.repeat(1000) + ' - Long content test',
  validComment: 'This is a test comment',
  emptyContent: ''
};
```

---

## 🛠️ Utility Functions

### TestUtils Class
```javascript
// Login user
await TestUtils.loginUser(page, email, password);

// Register user
await TestUtils.registerUser(page, email, password, username);

// Create post
await TestUtils.createPost(page, content);

// Add comment
await TestUtils.addComment(page, comment);

// Like post
await TestUtils.likePost(page);

// Logout user
await TestUtils.logoutUser(page);

// Generate test data
const data = TestUtils.generateTestData();

// Measure page load time
const loadTime = await TestUtils.measurePageLoadTime(page, url);
```

---

## 📈 Test Execution Strategies

### 1. Development Testing
```bash
# Run tests during development
npm run test:dev

# Run specific test file
npx playwright test tests/functional/auth.spec.js

# Run tests in debug mode
npx playwright test --debug
```

### 2. CI/CD Pipeline
```bash
# Run tests in CI environment
npm run test:ci

# Generate coverage report
npm run test:coverage
```

### 3. Performance Testing
```bash
# Run performance tests only
npm run test:performance

# Run load tests
npm run test:load
```

---

## 📋 Test Reports

### HTML Report
```bash
npx playwright show-report
```

### JSON Report
```bash
# Results saved to test-results/results.json
```

### JUnit Report
```bash
# Results saved to test-results/results.xml
```

---

## 🐛 Debugging

### Debug Mode
```bash
npx playwright test --debug
```

### Screenshots
- Screenshots are automatically captured on test failures
- Saved to `screenshots/` directory
- Include timestamp for easy identification

### Videos
- Videos are recorded for failed tests
- Saved to `test-results/` directory

### Traces
- Traces are captured on first retry
- Can be viewed with `npx playwright show-trace trace.zip`

---

## 🔍 Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Data Management
- Use TestUtils for common operations
- Generate unique test data for each test
- Clean up test data after tests

### 3. Assertions
- Use specific assertions
- Wait for elements before asserting
- Include meaningful error messages

### 4. Performance Testing
- Set realistic performance thresholds
- Test under various network conditions
- Monitor memory usage

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Tests Timing Out
```javascript
// Increase timeout
test.setTimeout(60000);

// Wait for specific conditions
await page.waitForLoadState('networkidle');
```

#### 2. Element Not Found
```javascript
// Wait for element to be visible
await page.waitForSelector('selector');

// Use TestUtils.elementExists for conditional checks
const exists = await TestUtils.elementExists(page, 'selector');
```

#### 3. Flaky Tests
```javascript
// Add retries
test.describe.configure({ retries: 3 });

// Use more specific selectors
await page.click('button[data-testid="specific-button"]');
```

---

## 📞 Support

### Documentation
- [Playwright Documentation](https://playwright.dev/)
- [Test Cases Documentation](./TEST_CASES.md)

### Issues
- Check test logs in `test-results/` directory
- Review screenshots and videos for failed tests
- Use debug mode for step-by-step execution

---

## 🎯 Success Metrics

### Functional Tests
- **Pass Rate**: ≥ 95%
- **Critical Path Coverage**: 100%
- **Error Handling Coverage**: 100%

### System Tests
- **Page Load Time**: ≤ 5 seconds
- **API Response Time**: ≤ 2 seconds
- **Concurrent Users**: ≥ 10 users
- **Memory Usage**: ≤ 100MB

### Overall
- **Test Execution Time**: ≤ 30 minutes
- **Test Stability**: ≥ 95% pass rate
- **Coverage**: All critical user journeys
