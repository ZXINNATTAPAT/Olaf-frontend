# Olaf Frontend - Test Cases Documentation

## 📋 Test Cases Overview

ชุดทดสอบนี้ประกอบด้วย **25 Test Cases** แบ่งเป็น:
- **Functional Test Cases**: 20 เคส
- **System Test Cases**: 5 เคส

---

## 🔧 Functional Test Cases (20 เคส)

| Test Case ID | Test Case Name | Module | Priority | Test Type | Description | Expected Result |
|--------------|----------------|--------|----------|-----------|-------------|-----------------|
| **TC-AUTH-001** | User Registration - Valid Data | Authentication | High | Positive | ทดสอบการสมัครสมาชิกด้วยข้อมูลที่ถูกต้อง | ระบบสร้างบัญชีผู้ใช้สำเร็จและ redirect ไปหน้า login |
| **TC-AUTH-002** | User Registration - Invalid Email | Authentication | High | Negative | ทดสอบการสมัครสมาชิกด้วย email ที่ไม่ถูกต้อง | ระบบแสดง error message และไม่สร้างบัญชี |
| **TC-AUTH-003** | User Registration - Weak Password | Authentication | High | Negative | ทดสอบการสมัครสมาชิกด้วยรหัสผ่านที่อ่อนแอ | ระบบแสดง error message เกี่ยวกับความแข็งแกร่งของรหัสผ่าน |
| **TC-AUTH-004** | User Registration - Duplicate Email | Authentication | High | Negative | ทดสอบการสมัครสมาชิกด้วย email ที่มีอยู่แล้ว | ระบบแสดง error message ว่า email นี้มีอยู่แล้ว |
| **TC-AUTH-005** | User Login - Valid Credentials | Authentication | High | Positive | ทดสอบการเข้าสู่ระบบด้วยข้อมูลที่ถูกต้อง | ระบบเข้าสู่ระบบสำเร็จและ redirect ไปหน้า feed |
| **TC-AUTH-006** | User Login - Invalid Credentials | Authentication | High | Negative | ทดสอบการเข้าสู่ระบบด้วยข้อมูลที่ไม่ถูกต้อง | ระบบแสดง error message และไม่เข้าสู่ระบบ |
| **TC-AUTH-007** | User Login - Empty Fields | Authentication | Medium | Negative | ทดสอบการเข้าสู่ระบบโดยไม่กรอกข้อมูล | ระบบแสดง validation error |
| **TC-AUTH-008** | User Logout | Authentication | High | Positive | ทดสอบการออกจากระบบ | ระบบออกจากระบบสำเร็จและ redirect ไปหน้า home |
| **TC-AUTH-009** | Protected Route Access | Authentication | High | Security | ทดสอบการเข้าถึงหน้า protected โดยไม่ login | ระบบ redirect ไปหน้า login |
| **TC-AUTH-010** | Session Persistence | Authentication | Medium | Positive | ทดสอบการคงอยู่ของ session หลัง refresh | ระบบยังคงสถานะ login อยู่ |
| **TC-POST-001** | Create Post - Valid Content | Posts | High | Positive | ทดสอบการสร้างโพสต์ด้วยเนื้อหาที่ถูกต้อง | ระบบสร้างโพสต์สำเร็จและแสดงใน feed |
| **TC-POST-002** | Create Post - Empty Content | Posts | High | Negative | ทดสอบการสร้างโพสต์โดยไม่กรอกเนื้อหา | ระบบแสดง validation error |
| **TC-POST-003** | Create Post - Long Content | Posts | Medium | Boundary | ทดสอบการสร้างโพสต์ด้วยเนื้อหาที่ยาวมาก | ระบบจัดการเนื้อหาที่ยาวได้อย่างเหมาะสม |
| **TC-POST-004** | Edit Post - Valid Changes | Posts | High | Positive | ทดสอบการแก้ไขโพสต์ด้วยข้อมูลใหม่ | ระบบอัปเดตโพสต์สำเร็จ |
| **TC-POST-005** | Delete Post | Posts | High | Positive | ทดสอบการลบโพสต์ | ระบบลบโพสต์สำเร็จและไม่แสดงใน feed |
| **TC-POST-006** | View Post Details | Posts | Medium | Positive | ทดสอบการดูรายละเอียดโพสต์ | ระบบแสดงรายละเอียดโพสต์ครบถ้วน |
| **TC-COMMENT-001** | Add Comment - Valid Content | Comments | High | Positive | ทดสอบการเพิ่มคอมเมนต์ด้วยเนื้อหาที่ถูกต้อง | ระบบเพิ่มคอมเมนต์สำเร็จ |
| **TC-COMMENT-002** | Add Comment - Empty Content | Comments | High | Negative | ทดสอบการเพิ่มคอมเมนต์โดยไม่กรอกเนื้อหา | ระบบแสดง validation error |
| **TC-LIKE-001** | Like Post | Likes | Medium | Positive | ทดสอบการกดไลค์โพสต์ | ระบบเพิ่มจำนวนไลค์และเปลี่ยนสถานะปุ่ม |
| **TC-LIKE-002** | Unlike Post | Likes | Medium | Positive | ทดสอบการยกเลิกไลค์โพสต์ | ระบบลดจำนวนไลค์และเปลี่ยนสถานะปุ่ม |

---

## ⚡ System Test Cases (5 เคส)

| Test Case ID | Test Case Name | Module | Priority | Test Type | Description | Expected Result |
|--------------|----------------|--------|----------|-----------|-------------|-----------------|
| **TC-PERF-001** | Page Load Time - Home Page | Performance | High | Load Time | ทดสอบเวลาการโหลดหน้า Home | หน้าโหลดเสร็จภายใน 3 วินาที |
| **TC-PERF-002** | Page Load Time - Feed Page | Performance | High | Load Time | ทดสอบเวลาการโหลดหน้า Feed | หน้าโหลดเสร็จภายใน 5 วินาที |
| **TC-PERF-003** | API Response Time - Login | Performance | High | Response Time | ทดสอบเวลาตอบสนองของ API Login | API ตอบสนองภายใน 2 วินาที |
| **TC-PERF-004** | Concurrent Users - Registration | Performance | Medium | Load Testing | ทดสอบการสมัครสมาชิกพร้อมกัน 10 คน | ระบบรองรับได้และตอบสนองภายใน 5 วินาที |
| **TC-PERF-005** | Memory Usage - Long Session | Performance | Medium | Memory | ทดสอบการใช้หน่วยความจำใน session ยาว | หน่วยความจำไม่เกิน 100MB |

---

## 🎯 Test Scenarios

### Scenario 1: Complete User Journey
1. User Registration → Login → Create Post → Add Comment → Like Post → Logout

### Scenario 2: Error Handling Journey
1. Invalid Login → Registration with Duplicate Email → Create Empty Post → Add Empty Comment

### Scenario 3: Performance Under Load
1. Multiple Users Login Simultaneously → Create Posts → Add Comments → Like Posts

---

## 📊 Test Coverage Areas

### ✅ Functional Coverage
- **Authentication Module**: 10 test cases
- **Posts Module**: 6 test cases  
- **Comments Module**: 2 test cases
- **Likes Module**: 2 test cases

### ✅ System Coverage
- **Performance Testing**: 5 test cases
- **Load Testing**: 1 test case
- **Memory Testing**: 1 test case

---

## 🔍 Test Data Requirements

### Test Users
- **Valid User**: testuser@example.com / TestPass123!
- **Invalid User**: invalid@test.com / WrongPass
- **Duplicate User**: existing@test.com / TestPass123!

### Test Content
- **Valid Post**: "This is a test post for automation testing"
- **Long Post**: 1000+ characters
- **Valid Comment**: "This is a test comment"
- **Empty Content**: ""

---

## 📈 Success Criteria

### Functional Tests
- **Pass Rate**: ≥ 95%
- **Critical Path Coverage**: 100%
- **Error Handling Coverage**: 100%

### System Tests
- **Page Load Time**: ≤ 5 seconds
- **API Response Time**: ≤ 2 seconds
- **Concurrent Users**: ≥ 10 users
- **Memory Usage**: ≤ 100MB

---

## 🚀 Execution Strategy

1. **Smoke Tests**: TC-AUTH-005, TC-POST-001, TC-COMMENT-001
2. **Regression Tests**: All Functional Test Cases
3. **Performance Tests**: All System Test Cases
4. **End-to-End Tests**: Complete User Journey Scenarios
