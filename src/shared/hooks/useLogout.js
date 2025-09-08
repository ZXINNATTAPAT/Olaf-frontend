import useAuth from "./useAuth"
import axiosInstance from "../services/axios/index"

export default function useLogout() {
    const { setUser, setAccessToken, setCSRFToken } = useAuth()

    const logout = async () => {
        try {
            const response = await axiosInstance.post("/auth/logout/")
            console.log(response);

            setAccessToken(null)
            setCSRFToken(null)
            setUser({})
            

        } catch (error) {
            console.log(error)
        }
    }

    return logout
}