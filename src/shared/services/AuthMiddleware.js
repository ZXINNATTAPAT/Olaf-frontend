import useAuth from "../hooks/useAuth"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function AuthMiddleware() {
    const { user, initializing } = useAuth()
    const location = useLocation()

    // Show loading only if we're still initializing and have no cached user
    const hasUser = user && Object.keys(user).length > 0 && (user.username || user.email || user.id)
    
    if (initializing && !hasUser) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }

    // Check if user is authenticated
    if (hasUser) {
        return <Outlet />
    } else {
        // Clean up localStorage
        localStorage.removeItem('us')
        localStorage.removeItem('accessToken')
        // Redirect to login with return path
        return <Navigate to="/auth/login" state={{ from: location }} replace />
    }
}