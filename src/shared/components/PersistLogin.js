import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import authService from '../services/AuthService'

export default function PersistLogin() {
    const { user, setUser, setAccessToken, setInitializing } = useAuth()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function verifyUser() {
            try {
                // ตรวจสอบสถานะการล็อกอินจาก localStorage (ใช้เป็น flag เท่านั้น)
                const isLoggedIn = localStorage.getItem('us')
                
                if (isLoggedIn) {
                    // ใช้ AuthService เพื่อเรียก getUserProfile
                    const response = await authService.getUserProfile()
                    
                    if (response && isMounted) {
                        setUser(response)
                        // เก็บ accessToken ใน context เฉพาะกรณีที่จำเป็น
                        // (สำหรับ API calls ที่ต้องใช้ Authorization header)
                        const storedToken = localStorage.getItem('accessToken')
                        if (storedToken) {
                            setAccessToken(storedToken)
                        }
                    }
                }
                
                // ถ้า backend ไม่ส่ง cookies และมี user data อยู่แล้ว ให้ข้าม API call
                if (isMounted && user && Object.keys(user).length > 0) {
                    setLoading(false)
                    setInitializing(false)
                }
            } catch (error) {
                // ถ้าไม่สามารถดึงข้อมูล user ได้ ให้ลบสถานะการล็อกอิน
                // แต่ให้ AuthMiddleware จัดการ redirect
                if (error?.response?.status === 401) {
                    // เฉพาะ 401 error เท่านั้นที่ลบ localStorage
                    localStorage.removeItem('us')
                    localStorage.removeItem('csrfToken')
                    localStorage.removeItem('accessToken')
                }
                // ไม่ลบ accessToken เพราะใช้ cookies เป็นหลัก
            } finally {
                if (isMounted) {
                    setLoading(false)
                    setInitializing(false) // ตั้งค่า initializing เป็น false หลังจากเสร็จสิ้น
                }
            }
        }

        // ตรวจสอบเฉพาะครั้งแรกเท่านั้น
        if (loading) {
            const isLoggedIn = localStorage.getItem('us')
            const hasUser = user && Object.keys(user).length > 0 && (user.username || user.email || user.id)
            
            // ถ้ามี user data อยู่แล้ว ให้ข้าม verification
            if (hasUser) {
                setLoading(false)
                setInitializing(false)
            }
            // ถ้ายังไม่มีข้อมูล user และมี localStorage ให้ตรวจสอบ
            else if (isLoggedIn === 'true') {
                verifyUser()
            } else {
                setLoading(false)
                setInitializing(false)
            }
        }

        return () => {
            isMounted = false
        }
     }, [loading, setAccessToken, setUser, setInitializing, user]) // เพิ่ม setInitializing ใน dependencies

    return (
        loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        ) : <Outlet />
    )
}
