import React, {  useState } from 'react'
import { useNavigate } from "react-router-dom"
import useAuth from '../../../shared/hooks/useAuth'
// import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate"
import useLogout from "../../../shared/hooks/useLogout"

export default function User() {

    const { user } = useAuth()
    // const axiosPrivateInstance = useAxiosPrivate()
    const navigate = useNavigate()
    const logout = useLogout()
    const [loading, setLoading] = useState(false)

    async function onLogout(e) {
        e.preventDefault();
        setLoading(true)
        sessionStorage.clear('reloaded')

        // localStorage.clear('us');
        await logout()
        navigate('/')
    }

    // User data is already loaded by PersistLogin component
    // No need to fetch again here

    return (
        <div>
            <h3>{user?.id}</h3>
            <h3>{user?.username}</h3>
            <h4>{user?.email}</h4>
            <button disabled={loading} type='button' onClick={onLogout}>Logout</button>
        </div>
    )
}