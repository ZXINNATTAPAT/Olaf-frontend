import React, { useState, createContext } from 'react'


export const AuthContext = createContext({
    user: {},
    setUser: () => { },
    accessToken: null,
    refreshToken: null,
    csrftoken: null,
    setAccessToken: () => { },
    setRefreshToken: () => { },
    setCSRFToken: () => { },
    initializing: true,
    setInitializing: () => { }
})

export function AuthContextProvider(props) {
    // Don't load user from localStorage on mount - let PersistLogin handle it
    // This prevents showing stale user data after logout
    const [user, setUser] = useState({})
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [csrftoken, setCSRFToken] = useState()
    const [initializing, setInitializing] = useState(true)

    // Save user to localStorage whenever it changes
    React.useEffect(() => {
        if (user && Object.keys(user).length > 0 && (user.username || user.email || user.id)) {
            // Sanitize: Only store safe fields (no password, tokens, or sensitive data)
            const safeUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_picture: user.profile_picture,
                bio: user.bio,
                is_staff: user.is_staff,
                is_active: user.is_active,
                date_joined: user.date_joined,
                last_login: user.last_login
            };
            try {
                localStorage.setItem('user', JSON.stringify(safeUser));
            } catch (error) {
                console.error('Error saving user to localStorage:', error);
                // If localStorage is full or unavailable, remove old data
                localStorage.removeItem('user');
            }
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return <AuthContext.Provider value={{
        user, setUser,
        accessToken, setAccessToken,
        refreshToken, setRefreshToken,
        csrftoken, setCSRFToken,
        initializing, setInitializing
    }}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext