import React, { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import authService from "../services/AuthService";

export default function PersistLogin() {
  const { user, setUser, setInitializing } = useAuth();
  const [loading, setLoading] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    // ป้องกันการเรียกซ้ำ
    if (hasChecked.current) return;
    hasChecked.current = true;

    async function checkUser() {
      try {
        // ตรวจสอบว่ามี user data อยู่แล้วหรือไม่
        if (user && Object.keys(user).length > 0) {
          // มี user data อยู่แล้ว ไม่ต้องเรียก API
          setLoading(false);
          setInitializing(false);
          return;
        }

        // ตรวจสอบ authentication ผ่าน API call เท่านั้น
        // ไม่ใช้ localStorage เป็น flag
        const response = await authService.getUserProfile();
        
        if (response) {
          setUser(response);
        }
      } catch (error) {
        // ถ้า API เรียกไม่สำเร็จ (เช่น 401 Unauthorized)
        if (error?.response?.status === 401) {
          // ลบเฉพาะ CSRF token (ถ้าจำเป็น)
          localStorage.removeItem("csrfToken");
        }
      } finally {
        // เสร็จแล้ว หยุด loading
        setLoading(false);
        setInitializing(false);
      }
    }

    checkUser();
  }, []); // เรียกเพียงครั้งเดียวเมื่อ component mount

  // แสดง loading spinner ถ้ายังโหลดอยู่
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // แสดง content เมื่อโหลดเสร็จ
  return <Outlet />;
}
