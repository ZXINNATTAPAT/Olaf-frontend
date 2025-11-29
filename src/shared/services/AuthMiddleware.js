import useAuth from "../hooks/useAuth"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function AuthMiddleware() {
    const { user, initializing } = useAuth()
    const location = useLocation()

    // รอให้ PersistLogin ทำงานเสร็จก่อน (initializing = false)
    if (initializing) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }

    // ตรวจสอบ user data หลังจากที่ PersistLogin ทำงานเสร็จแล้ว
    const hasUser = user && Object.keys(user).length > 0 && (user.username || user.email || user.id)

    // ตรวจสอบว่ามี user data หรือไม่
    if (hasUser) {
        return <Outlet />
    } else {
        // ลบ localStorage flags เมื่อ redirect
        localStorage.removeItem('us')
        // Don't need to remove csrfToken - we don't store it in localStorage
        localStorage.removeItem('accessToken')
        return <Navigate to="/auth/login" state={{ from: location }} replace />
    }
}