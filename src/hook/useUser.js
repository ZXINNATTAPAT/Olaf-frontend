import useAuth from "../hook/useAuth"
import useAxiosPrivate from "../axios/index"

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