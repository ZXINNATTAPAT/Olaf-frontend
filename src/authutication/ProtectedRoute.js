import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
// import { jwtDecode } from "jwt-decode";
import axios from 'axios';
const baseUrl = process.env.REACT_APP_BASE_URL;


export default function ProtectedRoute( children ) {

  const [isAuthenticated, setIsAuthenticated] = useState(null);
   // เริ่มต้นเป็น null เพื่อแสดงว่าเรายังไม่รู้สถานะการพิสูจน์ตัวตน

  // const TKs = localStorage.getItem('accessToken');

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(`${baseUrl}/auth/check/`, {
          headers: {
            'Authorization': `Bearer ${TKs}`, // ส่ง token ใน header
          },
          withCredentials: true, // ส่ง cookies ที่มี HttpOnly ไปด้วย
        });

        if (response.status === 200) {
          console.log('User is authenticated:', response.data);
          setIsAuthenticated(response.data.authenticated);
          console.log(response.data.authenticated)
          // console.log(document.cookie);
        } else {
          console.log('User is not authenticated');
          setIsAuthenticated(false); // กรณีไม่สำเร็จตั้งค่าให้เป็น false
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false); // ถ้ามีข้อผิดพลาดในการตรวจสอบก็ให้ตั้งเป็น false
      }
    };

    checkAuthentication();
  }, [TKs]); // useEffect จะเรียกใช้ทุกครั้งที่ TKs เปลี่ยนแปลง

  // แสดง loading หรือค่าของการพิสูจน์ตัวตน
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // หรือแสดง loading spinner
  }

  // ถ้าไม่ authenticated ให้เปลี่ยนเส้นทางไปที่หน้า Login
  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  // ถ้าผ่านการพิสูจน์ตัวตนแล้ว ให้แสดง children
  return children;
}

// function isTokenExpired(token) {
//     try {
//       const decoded = jwtDecode(token);
//       const currentTime = Date.now() / 1000;
//       console.log(decoded.exp < currentTime);

//       if(decoded.exp < currentTime){
//         localStorage.removeItem('token');
//       }
      
//       return decoded.exp < currentTime;
//     } catch (error) {
//       return true; // If there is an error decoding, treat the token as expired
//     }
//   }

