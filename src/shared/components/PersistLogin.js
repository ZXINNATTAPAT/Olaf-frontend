import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import axiosInstance from '../services/axios/index'

export default function PersistLogin() {
    const { user, setUser, setAccessToken } = useAuth()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function verifyUser() {
            try {
                // ตรวจสอบสถานะการล็อกอินจาก localStorage (ใช้เป็น flag เท่านั้น)
                const isLoggedIn = localStorage.getItem('us')
                console.log('PersistLogin: isLoggedIn =', isLoggedIn)
                
                if (isLoggedIn) {
                    console.log('PersistLogin: Calling /auth/user/ API')
                    // ใช้ HttpOnly cookies เป็นหลัก - ไม่ต้องส่ง Authorization header
                    const response = await axiosInstance.get('/auth/user/', {
                        withCredentials: true // ส่ง HttpOnly cookies อัตโนมัติ
                    })
                    
                    console.log('PersistLogin: API response =', response.data)
                    if (response.data && isMounted) {
                        setUser(response.data)
                        // เก็บ accessToken ใน context เฉพาะกรณีที่จำเป็น
                        // (สำหรับ API calls ที่ต้องใช้ Authorization header)
                        const storedToken = localStorage.getItem('accessToken')
                        if (storedToken) {
                            setAccessToken(storedToken)
                        }
                    }
                } else {
                    console.log('PersistLogin: No localStorage flag, skipping API call')
                }
            } catch (error) {
                console.log('User verification failed:', error?.response)
                // ถ้าไม่สามารถดึงข้อมูล user ได้ ให้ลบสถานะการล็อกอิน
                // แต่ให้ AuthMiddleware จัดการ redirect
                if (error?.response?.status === 401) {
                    // เฉพาะ 401 error เท่านั้นที่ลบ localStorage
                    localStorage.removeItem('us')
                    localStorage.removeItem('csrfToken')
                }
                // ไม่ลบ accessToken เพราะใช้ cookies เป็นหลัก
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        // ตรวจสอบเฉพาะครั้งแรกเท่านั้น
        if (loading) {
            // ถ้ายังไม่มีข้อมูล user และมี localStorage ให้ตรวจสอบ
            if ((!user || Object.keys(user).length === 0) && localStorage.getItem('us')) {
                console.log('PersistLogin: Starting verification')
                verifyUser()
            } else {
                console.log('PersistLogin: Skipping verification, user exists or no localStorage')
                setLoading(false)
            }
        }

        return () => {
            isMounted = false
        }
    }, [loading, setAccessToken, setUser, user]) // เพิ่ม dependencies กลับมา

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
