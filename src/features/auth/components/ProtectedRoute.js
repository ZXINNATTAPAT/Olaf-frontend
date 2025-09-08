import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../../shared/hooks/useAuth';
import axiosInstance from '../../../shared/services/axios/index';

export default function ProtectedRoute({ children }) {
  const { accessToken } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axiosInstance.get('/auth/check/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // ส่ง token ใน header
          },
          withCredentials: true, // ส่ง cookies ที่มี HttpOnly ไปด้วย
        });

        if (response.status === 200) {
          console.log('User is authenticated:', response.data);
          setIsAuthenticated(response.data.authenticated);
          console.log(response.data.authenticated)
        } else {
          console.log('User is not authenticated');
          setIsAuthenticated(false); // กรณีไม่สำเร็จตั้งค่าให้เป็น false
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false); // ถ้ามีข้อผิดพลาดในการตรวจสอบก็ให้ตั้งเป็น false
      }
    };

    if (accessToken) {
      checkAuthentication();
    } else {
      setIsAuthenticated(false);
    }
  }, [accessToken]); // useEffect จะเรียกใช้ทุกครั้งที่ accessToken เปลี่ยนแปลง

  // แสดง loading หรือค่าของการพิสูจน์ตัวตน
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // หรือแสดง loading spinner
  }

  // ถ้าไม่ authenticated ให้เปลี่ยนเส้นทางไปที่หน้า Login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // ถ้าผ่านการพิสูจน์ตัวตนแล้ว ให้แสดง children
  return children;
}

