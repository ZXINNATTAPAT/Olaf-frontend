class AuthService {
    constructor(baseURL = 'https://olaf-backend.onrender.com/api') {
        this.baseURL = baseURL;
        // this.csrfToken = localStorage.getItem('csrfToken') || null;
        
        // Cache mechanism
        this.cache = {
            userProfile: null,
            lastFetch: null,
            cacheTimeout: 5 * 60 * 1000, // 5 minutes
            isAuthenticated: null,
            lastAuthCheck: null
        };
    }

    // 1. Get CSRF Token
    async getCSRFToken() {
        try {
            const response = await fetch(`${this.baseURL}/auth/csrf/`, {
                method: 'GET',
                credentials: 'include'
            });
            
            this.csrfToken = response.headers.get('X-CSRFToken');
            if (this.csrfToken) {
                localStorage.setItem('csrfToken', this.csrfToken);
            }
            return this.csrfToken;
        } catch (error) {
            return null;
        }
    }

    // 2. Register
    async register(userData) {
        try {
            const response = await fetch(`${this.baseURL}/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            // Update CSRF token from response
            this.csrfToken = response.headers.get('X-CSRFToken');
            
            return data;
        } catch (error) {
            throw error;
        }
    }

    // 3. Login
    async login(email, password) {
        try {
            // Check if user is already authenticated and clear cookies if needed
            if (this.isAuthenticated()) {
                console.log('User already authenticated, clearing existing session...');
                await this.clearCookiesBeforeLogin();
            }
            
            // Get CSRF token first
            await this.getCSRFToken();
            
            const response = await fetch(`${this.baseURL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            // Update CSRF token from response
            this.csrfToken = response.headers.get('X-CSRFToken');
            if (this.csrfToken) {
                localStorage.setItem('csrfToken', this.csrfToken);
            }
            
            // Clear cache to ensure fresh data after login
            this.clearCache();
            
            return data;
        } catch (error) {
            throw error;
        }
    }

    // 4. Get User Profile
    async getUserProfile(forceRefresh = false) {
        try {
            // Check cache first
            if (!forceRefresh && this.cache.userProfile && this.isCacheValid()) {
                return this.cache.userProfile;
            }

            const response = await fetch(`${this.baseURL}/auth/user/`, {
                method: 'GET',
                headers: {
                    'X-CSRFToken': this.csrfToken
                },
                credentials: 'include' // HTTP Only cookies จะถูกส่งอัตโนมัติ
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Update cache
            this.cache.userProfile = data;
            this.cache.lastFetch = Date.now();
            
            return data;
        } catch (error) {
            // If error and we have cached data, return cached data
            if (this.cache.userProfile && this.isCacheValid()) {
                console.warn('API error, returning cached user profile:', error);
                return this.cache.userProfile;
            }
            throw error;
        }
    }

    // 5. Refresh Token
    async refreshToken() {
        try {
            const response = await fetch(`${this.baseURL}/auth/refresh-token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({})
            });
            
            this.csrfToken = response.headers.get('X-CSRFToken');
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    // 6. Logout
    async logout() {
        try {
            const response = await fetch(`${this.baseURL}/auth/logout/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.csrfToken,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({})
            });
            
            // Even if the API call fails, we should still clear local state
            if (!response.ok) {
                console.warn('Logout API call failed, but clearing local state:', response.status);
            }
            
            // Clear all local state and cache
            this.clearLocalState();
            
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            // Even if there's an error, clear local state
            this.clearLocalState();
            return true; // Return true because we've cleared local state
        }
    }

    // Helper method to clear all local state
    clearLocalState() {
        // Clear cache
        this.clearCache();
        
        // Clear CSRF token
        this.csrfToken = null;
        
        // Clear only CSRF token from localStorage
        localStorage.removeItem('csrfToken');
        
        // Note: HTTP-only cookies จะถูกจัดการโดย server
    }

    // Helper method to clear cookies before login
    async clearCookiesBeforeLogin() {
        try {
            // Call logout endpoint to clear server-side cookies
            await fetch(`${this.baseURL}/auth/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({})
            });
            
            console.log('Cleared existing cookies before login');
        } catch (error) {
            console.warn('Could not clear cookies before login:', error);
            // Continue with login even if clearing cookies fails
        }
        
        // Clear local state as well
        this.clearLocalState();
    }

    // Helper: Check if user is authenticated by calling API
    async isAuthenticated() {
        try {
            const response = await fetch(`${this.baseURL}/auth/user/`, {
                method: 'GET',
                credentials: 'include'
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // Cache management methods
    clearCache() {
        this.cache = {
            userProfile: null,
            lastFetch: null,
            cacheTimeout: 5 * 60 * 1000,
            isAuthenticated: null,
            lastAuthCheck: null
        };
    }

    invalidateUserProfile() {
        this.cache.userProfile = null;
        this.cache.lastFetch = null;
    }

    isCacheValid() {
        if (!this.cache.lastFetch) return false;
        return Date.now() - this.cache.lastFetch < this.cache.cacheTimeout;
    }

    setCacheTimeout(timeout) {
        this.cache.cacheTimeout = timeout;
    }

    // Force clear all authentication data (cookies and local state)
    async forceClearAuth() {
        console.log('Force clearing all authentication data...');
        await this.clearCookiesBeforeLogin();
    }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
