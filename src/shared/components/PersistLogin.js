import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useLoader from '../hooks/useLoader'
import axiosInstance from '../services/axios/index'

export default function PersistLogin() {
    const { user, setUser, setAccessToken } = useAuth()
    const { showLoader, hideLoader } = useLoader()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function verifyUser() {
            try {
                // ตรวจสอบสถานะการล็อกอินจาก localStorage
                const isLoggedIn = localStorage.getItem('us')
                
                if (isLoggedIn) {
                    showLoader('กำลังโหลดข้อมูลผู้ใช้...')
                    // ถ้ามีการล็อกอิน ให้ดึงข้อมูล user จาก server
                    const response = await axiosInstance.get('/auth/user/', {
                        withCredentials: true
                    })
                    
                    if (response.data && isMounted) {
                        setUser(response.data)
                        // เนื่องจาก /auth/user/ ไม่ return access_token
                        // ให้ใช้ localStorage หรือ sessionStorage เก็บ token
                        const storedToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
                        if (storedToken) {
                            setAccessToken(storedToken)
                        }
                    }
                }
            } catch (error) {
                console.log('User verification failed:', error?.response)
                // ถ้าไม่สามารถดึงข้อมูล user ได้ ให้ลบสถานะการล็อกอิน
                localStorage.removeItem('us')
                localStorage.removeItem('csrfToken')
                localStorage.removeItem('accessToken')
            } finally {
                if (isMounted) {
                    hideLoader()
                    setLoading(false)
                }
            }
        }

        // ถ้ายังไม่มีข้อมูล user และมี localStorage ให้ตรวจสอบ
        if ((!user || Object.keys(user).length === 0) && localStorage.getItem('us')) {
            verifyUser()
        } else {
            setLoading(false)
        }

        return () => {
            isMounted = false
        }
    }, [setUser, setAccessToken, showLoader, hideLoader, user])

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
