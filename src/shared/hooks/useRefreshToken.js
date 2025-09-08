import axiosInstance from "../services/axios/index";
import useAuth from "./useAuth";

export default function useRefreshToken() {
    const { setAccessToken, setCSRFToken } = useAuth()

    const refresh = async () => {
        try {
            const response = await axiosInstance.post('/auth/refresh/', {}, { withCredentials: true })
            setAccessToken(response.data.access)
            setCSRFToken(response.headers["x-csrftoken"])
            return { accessToken: response.data.access, csrfToken: response.headers["x-csrftoken"] }
        } catch (error) {
            console.error("Failed to refresh token:", error.response?.data || error.message)
            throw error
        }
    }
    

    return refresh
}