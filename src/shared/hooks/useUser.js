import useAuth from "./useAuth"
import useAxiosPrivate from "../services/axios/index"

export default function useUser() {

    const { setUser } = useAuth()
    const axiosPrivateInstance = useAxiosPrivate()

    async function getUser() {
        try {
            const { data } = await axiosPrivateInstance.get('auth/user')

            setUser(data)
        } catch (error) {
            console.log(error.response)
        }
    }

    return getUser
}