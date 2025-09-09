import useAuth from "../hooks/useAuth"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function AuthMiddleware() {
    const { user, initializing } = useAuth()
    const location = useLocation()

    // รอให้ PersistLogin ทำงานเสร็จก่อน (initializing = false)
    if (initializing) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
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
        localStorage.removeItem('csrfToken')
        localStorage.removeItem('accessToken')
        return <Navigate to="/auth/login" state={{ from: location }} replace />
    }
}