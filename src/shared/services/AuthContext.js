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
    // Load user from localStorage immediately for better UX
    // PersistLogin will verify and update if needed
    const loadInitialUser = () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && (parsedUser.username || parsedUser.email || parsedUser.id)) {
                    return parsedUser;
                }
            }
        } catch (error) {
            console.error('Error loading user from localStorage:', error);
            localStorage.removeItem('user');
        }
        return {};
    };

    const [user, setUser] = useState(loadInitialUser)
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [csrftoken, setCSRFToken] = useState()
    const [initializing, setInitializing] = useState(false) // Start as false since we have cached user

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