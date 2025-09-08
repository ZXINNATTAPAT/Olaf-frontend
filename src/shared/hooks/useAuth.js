import { useContext, useDebugValue } from "react";
import { AuthContext } from "../services/AuthContext"

export default function useAuth() {
    const context = useContext(AuthContext)

    useDebugValue(context, context => context?.user ? "Logged In" : "Logged Out")

    return context
}