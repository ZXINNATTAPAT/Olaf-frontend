# Olaf Frontend - Test Execution Guide

## 🚀 การรันทดสอบ

### 1. การติดตั้งและตั้งค่า
```bash
# ติดตั้ง dependencies
npm install

# ติดตั้ง Playwright browsers
npx playwright install

# เริ่มต้น React application
npm start
```

### 2. การรันทดสอบทั้งหมด
```bash
# รันทดสอบทั้งหมด
npm run test:e2e

# รันทดสอบพร้อมดู browser
npm run test:e2e:headed

# รันทดสอบพร้อม debug
npm run test:dev
```

### 3. การรันทดสอบตามหมวดหมู่

#### Functional Tests (20 เคส)
```bash
# รันทดสอบ Authentication
npx playwright test tests/functional/auth.spec.js

# รันทดสอบ Posts
npx playwright test tests/functional/posts.spec.js

# รันทดสอบ Comments
npx playwright test tests/functional/comments.spec.js

# รันทดสอบ Likes
npx playwright test tests/functional/likes.spec.js

# รันทดสอบ Functional ทั้งหมด
npm run test:functional
```

#### System Tests (5 เคส)
```bash
# รันทดสอบ Performance
npm run test:performance

# รันทดสอบ System ทั้งหมด
npm run test:system
```

#### End-to-End Tests (3 เคส)
```bash
# รันทดสอบ User Journey
npx playwright test tests/e2e/user-journey.spec.js

# รันทดสอบ Load Testing
npm run test:load
```

#### Smoke Tests (3 เคส)
```bash
# รันทดสอบ Smoke Tests
npm run test:smoke
```

### 4. การสร้างรายงาน
```bash
# สร้าง HTML Report
npm run test:report

# ดูรายงาน
npm run show-report

# ดู trace (สำหรับ debug)
npm run show-trace
```

---

## 📊 ผลลัพธ์การทดสอบ

### ไฟล์ผลลัพธ์
- **HTML Report**: `test-results/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit Report**: `test-results/results.xml`
- **Screenshots**: `screenshots/` (เมื่อทดสอบล้มเหลว)
- **Videos**: `test-results/` (เมื่อทดสอบล้มเหลว)

### การดูผลลัพธ์
```bash
# เปิด HTML report
npx playwright show-report

# ดู trace file
npx playwright show-trace test-results/trace.zip
```

---

## 🎯 Test Cases ที่รันได้

### ✅ Functional Tests (20 เคส)

#### Authentication (10 เคส)
1. **TC-AUTH-001**: User Registration - Valid Data
2. **TC-AUTH-002**: User Registration - Invalid Email
3. **TC-AUTH-003**: User Registration - Weak Password
4. **TC-AUTH-004**: User Registration - Duplicate Email
5. **TC-AUTH-005**: User Login - Valid Credentials
6. **TC-AUTH-006**: User Login - Invalid Credentials
7. **TC-AUTH-007**: User Login - Empty Fields
8. **TC-AUTH-008**: User Logout
9. **TC-AUTH-009**: Protected Route Access
10. **TC-AUTH-010**: Session Persistence

#### Posts (6 เคส)
11. **TC-POST-001**: Create Post - Valid Content
12. **TC-POST-002**: Create Post - Empty Content
13. **TC-POST-003**: Create Post - Long Content
14. **TC-POST-004**: Edit Post - Valid Changes
15. **TC-POST-005**: Delete Post
16. **TC-POST-006**: View Post Details

#### Comments (2 เคส)
17. **TC-COMMENT-001**: Add Comment - Valid Content
18. **TC-COMMENT-002**: Add Comment - Empty Content

#### Likes (2 เคส)
19. **TC-LIKE-001**: Like Post
20. **TC-LIKE-002**: Unlike Post

### ⚡ System Tests (5 เคส)

#### Performance (5 เคส)
21. **TC-PERF-001**: Page Load Time - Home Page (≤ 3s)
22. **TC-PERF-002**: Page Load Time - Feed Page (≤ 5s)
23. **TC-PERF-003**: API Response Time - Login (≤ 2s)
24. **TC-PERF-004**: Concurrent Users - Registration (10 users, ≤ 5s)
25. **TC-PERF-005**: Memory Usage - Long Session (≤ 100MB)

### 🔄 End-to-End Tests (3 เคส)
26. Complete User Journey - Registration to Post Creation
27. Error Handling Journey
28. Performance Under Load Journey

### 🔥 Smoke Tests (3 เคส)
29. User Login Flow
30. Post Creation Flow
31. Comment Addition Flow

---

## 🛠️ การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

#### 1. Tests ไม่พบ Element
```bash
# ตรวจสอบ selector ใน browser
npx playwright test --debug

# เพิ่ม timeout
await page.waitForSelector('selector', { timeout: 10000 });
```

#### 2. Tests Timeout
```bash
# เพิ่ม timeout สำหรับ test
test.setTimeout(60000);

# รอให้ page โหลดเสร็จ
await page.waitForLoadState('networkidle');
```

#### 3. Tests ล้มเหลวแบบไม่สม่ำเสมอ (Flaky)
```bash
# เพิ่ม retry
test.describe.configure({ retries: 3 });

# ใช้ selector ที่เฉพาะเจาะจงมากขึ้น
await page.click('button[data-testid="specific-button"]');
```

### การ Debug
```bash
# รันทดสอบแบบ debug
npx playwright test --debug

# รันทดสอบเฉพาะไฟล์
npx playwright test tests/functional/auth.spec.js --debug

# ดู trace
npx playwright show-trace test-results/trace.zip
```

---

## 📈 การวัดผล

### เป้าหมายการทดสอบ
- **Pass Rate**: ≥ 95%
- **Page Load Time**: ≤ 5 วินาที
- **API Response Time**: ≤ 2 วินาที
- **Memory Usage**: ≤ 100MB
- **Concurrent Users**: ≥ 10 users

### การติดตามผล
```bash
# ดูผลลัพธ์แบบละเอียด
npm run test:report

# ตรวจสอบ performance metrics
npm run test:performance

# ดู memory usage
npm run test:system
```

---

## 🔧 การปรับแต่ง

### การเปลี่ยน Test Data
แก้ไขไฟล์ `tests/functional/auth.spec.js`:
```javascript
const testData = {
  validUser: {
    email: 'your-test-email@example.com',
    password: 'YourTestPass123!',
    username: 'yourusername'
  }
};
```

### การเปลี่ยน Performance Thresholds
แก้ไขไฟล์ `tests/system/performance.spec.js`:
```javascript
// เปลี่ยน threshold
expect(loadTime).toBeLessThan(3000); // 3 วินาที
expect(responseTime).toBeLessThan(2000); // 2 วินาที
```

### การเพิ่ม Test Cases ใหม่
1. สร้างไฟล์ใหม่ใน `tests/functional/`
2. ใช้ TestUtils สำหรับ helper functions
3. เพิ่ม test case ใน `TEST_CASES.md`
4. รันทดสอบเพื่อตรวจสอบ

---

## 📞 การขอความช่วยเหลือ

### เอกสารอ้างอิง
- [Playwright Documentation](https://playwright.dev/)
- [Test Cases Documentation](./TEST_CASES.md)
- [Test Guide](./README.md)

### การรายงานปัญหา
1. ตรวจสอบ logs ใน `test-results/`
2. ดู screenshots และ videos
3. ใช้ debug mode เพื่อหาสาเหตุ
4. รายงานปัญหาพร้อมข้อมูลที่เกี่ยวข้อง
