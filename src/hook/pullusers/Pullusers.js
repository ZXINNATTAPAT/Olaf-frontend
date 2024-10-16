import React, { useEffect, useState } from 'react';
const baseUrl = process.env.REACT_APP_BASE_URL;

export default function PullUsers( {ids} ) {
  const [user, setUser] = useState(null); // state สำหรับเก็บข้อมูลผู้ใช้
  const [loading, setLoading] = useState(true); // state สำหรับสถานะการโหลด
  const [error, setError] = useState(null); // state สำหรับจัดการข้อผิดพลาด

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${baseUrl}/users/${ids}`, {
          method: 'GET',
          credentials: 'include', // ใช้ credentials แทน withCredentials
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const userData = await response.json(); // รอให้ข้อมูลถูกแปลงเป็น JSON

        // ตรวจสอบว่ามีผู้ใช้ที่ตรงกับ id หรือไม่
        if (userData && userData.id === ids) {
          setUser(`${userData.first_name} ${userData.last_name}`); // เก็บชื่อผู้ใช้ใน state
        } else {
          setUser(null); // ถ้าไม่พบผู้ใช้ ให้ set เป็น null
        }
      } catch (error) {
        setError(error); // เก็บข้อผิดพลาดใน state
      } finally {
        setLoading(false); // เปลี่ยนสถานะการโหลดเป็น false
      }
    };

    fetchUser(); // เรียกใช้ฟังก์ชันดึงข้อมูล
  }, [ids]); // รัน effect เมื่อ id เปลี่ยนแปลง

  if (loading) {
    return <p>Loading...</p>; // แสดงข้อความระหว่างโหลด
  }

//   if (error) {
//     return <p>Error: {error.message}</p>; // แสดงข้อความข้อผิดพลาดถ้ามี
//   }

  return <>{user || 'User not found'}</>; // แสดงชื่อผู้ใช้หรือข้อความถ้าไม่พบ
}
