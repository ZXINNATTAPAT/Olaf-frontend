/**
 * Unified Authentication Service
 * Handles all authentication operations with HTTP-only cookies
 * Simple, secure, and easy to use
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'https://web-production-ba20a.up.railway.app/api';

class AuthService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.csrfToken = localStorage.getItem('csrfToken') || null;
        
        // Cache for user profile (5 minutes)
        this.cache = {
            userProfile: null,
            lastFetch: null,
            cacheTimeout: 5 * 60 * 1000
        };
    }

    /**
     * Get CSRF token from server
     */
    async getCSRFToken() {
        try {
            const response = await fetch(`${this.baseURL}/auth/csrf/`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to get CSRF token');
            }

            const csrfToken = response.headers.get('X-CSRFToken');
            if (csrfToken) {
                this.csrfToken = csrfToken;
                localStorage.setItem('csrfToken', csrfToken);
            }
            
            return this.csrfToken;
        } catch (error) {
            console.error('CSRF token error:', error);
            return null;
        }
    }

    /**
     * User Login
     */
    async login(email, password) {
        try {
            // Ensure we have CSRF token
            if (!this.csrfToken) {
                await this.getCSRFToken();
            }

            const response = await fetch(`${this.baseURL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.csrfToken || ''
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                // Extract error message
                const errorMessage = data.error || data.detail || 'Login failed';
                throw new Error(errorMessage);
            }

            // Update CSRF token from response
            const newCsrfToken = response.headers.get('X-CSRFToken');
            if (newCsrfToken) {
                this.csrfToken = newCsrfToken;
                localStorage.setItem('csrfToken', newCsrfToken);
            }

            // Update cache with user data
            if (data.user) {
                this.cache.userProfile = data.user;
                this.cache.lastFetch = Date.now();
            }

            return data;
        } catch (error) {
            // Clear cache on error
            this.clearCache();
            throw error;
        }
    }

    /**
     * User Registration
     */
    async register(userData) {
        try {
            // Ensure we have CSRF token
            if (!this.csrfToken) {
                await this.getCSRFToken();
            }

            const response = await fetch(`${this.baseURL}/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.csrfToken || ''
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.error || data.detail || 'Registration failed';
                throw new Error(errorMessage);
            }

            // Update CSRF token
            const newCsrfToken = response.headers.get('X-CSRFToken');
            if (newCsrfToken) {
                this.csrfToken = newCsrfToken;
                localStorage.setItem('csrfToken', newCsrfToken);
            }

            // Update cache
            if (data.user) {
                this.cache.userProfile = data.user;
                this.cache.lastFetch = Date.now();
            }

            return data;
        } catch (error) {
            this.clearCache();
            throw error;
        }
    }

    /**
     * Get User Profile
     */
    async getUserProfile(forceRefresh = false) {
        try {
            // Check cache first
            if (!forceRefresh && this.cache.userProfile && this.isCacheValid()) {
                return this.cache.userProfile;
            }

            const response = await fetch(`${this.baseURL}/auth/user/`, {
                method: 'GET',
                headers: {
                    'X-CSRFToken': this.csrfToken || ''
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Try to refresh token
                    const refreshed = await this.refreshToken();
                    if (refreshed) {
                        // Retry with new token
                        return this.getUserProfile(true);
                    }
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Update cache
            this.cache.userProfile = data;
            this.cache.lastFetch = Date.now();

            return data;
        } catch (error) {
            // Return cached data if available
            if (this.cache.userProfile && this.isCacheValid()) {
                console.warn('API error, returning cached user profile:', error);
                return this.cache.userProfile;
            }
            throw error;
        }
    }

    /**
     * Refresh Access Token
     */
    async refreshToken() {
        try {
            const response = await fetch(`${this.baseURL}/auth/refresh-token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            // Update CSRF token
            const csrfToken = response.headers.get('X-CSRFToken');
            if (csrfToken) {
                this.csrfToken = csrfToken;
                localStorage.setItem('csrfToken', csrfToken);
            }

            return true;
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    }

    /**
     * User Logout
     */
    async logout() {
        try {
            const response = await fetch(`${this.baseURL}/auth/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.csrfToken || ''
                },
                credentials: 'include'
            });

            // Clear local state regardless of response
            this.clearLocalState();

            return true;
        } catch (error) {
            console.error('Logout error:', error);
            // Clear local state even on error
            this.clearLocalState();
            return true;
        }
    }

    /**
     * Check if user is authenticated
     */
    async isAuthenticated() {
        try {
            const response = await fetch(`${this.baseURL}/auth/check/`, {
                method: 'GET',
                credentials: 'include'
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Clear all local state and cache
     */
    clearLocalState() {
        this.clearCache();
        this.csrfToken = null;
        localStorage.removeItem('csrfToken');
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache = {
            userProfile: null,
            lastFetch: null,
            cacheTimeout: 5 * 60 * 1000
        };
    }

    /**
     * Check if cache is valid
     */
    isCacheValid() {
        if (!this.cache.lastFetch) return false;
        return Date.now() - this.cache.lastFetch < this.cache.cacheTimeout;
    }

    /**
     * Invalidate user profile cache
     */
    invalidateUserProfile() {
        this.cache.userProfile = null;
        this.cache.lastFetch = null;
    }
}

// Create and export singleton instance
const authService = new AuthService();

export default authService;
