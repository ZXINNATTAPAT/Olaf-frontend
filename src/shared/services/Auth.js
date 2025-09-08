import useAuth from "../hooks/useAuth"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function AuthMiddleware() {
    const { user } = useAuth() // ใช้ user แทน accessToken เพราะใช้ cookies เป็นหลัก
    const location = useLocation()

    // ตรวจสอบ localStorage flag และ user data
    const isLoggedIn = localStorage.getItem('us')
    const hasUser = user && Object.keys(user).length > 0

    console.log('AuthMiddleware check:', { isLoggedIn, hasUser, user })

    // ถ้ามี localStorage flag หรือ user data ให้อนุญาตเข้าถึง
    // ถ้าไม่มีทั้งคู่ ให้ redirect ไป login
    if (isLoggedIn || hasUser) {
        return <Outlet />
    } else {
        return <Navigate to="/auth/login" state={{ from: location }} replace />
    }

}