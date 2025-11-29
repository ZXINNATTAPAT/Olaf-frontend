import React, { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import authService from "../services/AuthService";

export default function PersistLogin() {
  const { setUser, setInitializing } = useAuth();
  const [loading, setLoading] = useState(true);
  const hasChecked = useRef(false);
  const isChecking = useRef(false);

  useEffect(() => {
    // ป้องกันการเรียกซ้ำ
    if (hasChecked.current || isChecking.current) return;
    
    async function checkUser() {
      // Mark as checking to prevent concurrent calls
      isChecking.current = true;
      hasChecked.current = true;

      try {
        // Always verify with server first to get latest user data
        // Don't rely on cached user data to avoid showing wrong user
        const response = await authService.getUserProfile();
        
        if (response && (response.username || response.email || response.id)) {
          // Update user with latest data from server
          setUser(response);
          // User จะถูกบันทึกใน localStorage อัตโนมัติผ่าน useEffect ใน AuthContext
        } else {
          // ถ้าไม่มี user data ที่ถูกต้อง ให้ลบข้อมูลเก่า
          setUser({});
          localStorage.removeItem('user');
          // User จะถูกลบจาก localStorage อัตโนมัติผ่าน useEffect ใน AuthContext
        }
      } catch (error) {
        // ถ้า API เรียกไม่สำเร็จ (เช่น 401 Unauthorized)
        // ไม่ต้อง log error ถ้าเป็น 401 เพราะเป็นเรื่องปกติเมื่อไม่ได้ login
        if (!error.message?.includes('Unauthorized')) {
          console.log('Authentication check failed:', error);
        }
        
        // ลบ user data เมื่อ authentication ล้มเหลว
        setUser({});
        localStorage.removeItem('user');
      } finally {
        // เสร็จแล้ว หยุด loading
        setLoading(false);
        setInitializing(false);
        isChecking.current = false;
      }
    }

    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setInitializing, setUser]); // user ไม่ต้องอยู่ใน dependency เพื่อป้องกัน infinite loop

  // แสดง loading spinner ถ้ายังโหลดอยู่
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
