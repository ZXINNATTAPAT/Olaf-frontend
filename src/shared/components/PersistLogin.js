import React, { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import authService from "../services/AuthService";

export default function PersistLogin() {
  const { user, setUser, setAccessToken, setInitializing } = useAuth();
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

        // ตรวจสอบสถานะการล็อกอินจาก localStorage
        const isLoggedIn = localStorage.getItem("us");
        
        if (isLoggedIn === "true") {
          // มีการล็อกอิน ให้เรียก API เพื่อดึงข้อมูล user
          const response = await authService.getUserProfile();
          
          if (response) {
            setUser(response);
            // เก็บ accessToken ถ้ามี
            const storedToken = localStorage.getItem("accessToken");
            if (storedToken) {
              setAccessToken(storedToken);
            }
          }
        }
      } catch (error) {
        // ถ้า API เรียกไม่สำเร็จ (เช่น 401 Unauthorized)
        if (error?.response?.status === 401) {
          // ลบข้อมูลการล็อกอิน
          localStorage.removeItem("us");
          localStorage.removeItem("csrfToken");
          localStorage.removeItem("accessToken");
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
