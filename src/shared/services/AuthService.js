/**
 * Unified Authentication Service
 * Handles all authentication operations with HTTP-only cookies
 * Simple, secure, and easy to use
 */

// Normalize baseURL to use localhost instead of 127.0.0.1 for cookie compatibility
const getAPIBaseURL = () => {
  const url =
    process.env.REACT_APP_API_URL ||
    process.env.REACT_APP_BASE_URL ||
    "https://web-production-ba20a.up.railway.app/api";
  // Replace 127.0.0.1 with localhost for cookie compatibility
  return url.replace("127.0.0.1", "localhost");
};

const API_BASE_URL = getAPIBaseURL();

class AuthService {
  constructor() {
    this.baseURL = API_BASE_URL;
    // Don't load csrfToken from localStorage - get it fresh from server
    // CSRF token is sent in response headers every time, so no need to persist
    this.csrfToken = null;

    // Cache for user profile (30 seconds)
    this.cache = {
      userProfile: null,
      lastFetch: null,
      cacheTimeout: 30 * 1000,
    };

    // Request deduplication - prevent multiple concurrent requests
    this.pendingRequests = {
      getUserProfile: null,
      refreshToken: null,
    };

    // Load cached user from localStorage
    this.loadCachedUser();
  }

  /**
   * Sanitize user data before storing (remove sensitive fields)
   */
  sanitizeUserData(user) {
    if (!user) return null;

    // Only keep safe fields
    return {
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
      last_login: user.last_login,
    };
  }

  /**
   * Load cached user from localStorage
   */
  loadCachedUser() {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (
          parsedUser &&
          (parsedUser.username || parsedUser.email || parsedUser.id)
        ) {
          // Sanitize: Only keep safe fields (no password, tokens, or sensitive data)
          const safeUser = this.sanitizeUserData(parsedUser);
          this.cache.userProfile = safeUser;
          // Set lastFetch to current time to allow immediate use
          this.cache.lastFetch = Date.now();
        }
      }
    } catch (error) {
      console.error("Error loading cached user:", error);
      localStorage.removeItem("user");
    }
  }

  /**
   * Get CSRF token from server
   */
  async getCSRFToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/csrf/`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to get CSRF token");
      }

      const csrfToken = response.headers.get("X-CSRFToken");
      if (csrfToken) {
        this.csrfToken = csrfToken;
        // Don't store in localStorage - CSRF token is sent in response headers every time
      }

      return this.csrfToken;
    } catch (error) {
      console.error("CSRF token error:", error);
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Don't send X-CSRFToken for login - we might not have it yet/cookies are empty
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (process.env.NODE_ENV === "development") {
        console.log("🔵 Login Response Keys:", Object.keys(data));
        console.log("🔵 Login Response Data:", {
          hasAccess: !!data.access,
          hasRefresh: !!data.refresh,
          hasAccessToken: !!data.access_token,
          hasRefreshToken: !!data.refresh_token,
          allKeys: Object.keys(data),
        });
      }

      if (!response.ok) {
        // Extract error message
        const errorMessage = data.error || data.detail || "Login failed";
        throw new Error(errorMessage);
      }

      // Debug: Check response headers
      // Note: Set-Cookie is a forbidden header and cannot be read from JavaScript
      // Check cookies via document.cookie or Application tab instead
      if (process.env.NODE_ENV === "development") {
        console.log(
          "🍪 Login Response - Headers (Set-Cookie is forbidden, check Network tab):",
          {
            "X-CSRFToken": response.headers.get("X-CSRFToken"),
            "Access-Control-Allow-Credentials": response.headers.get(
              "Access-Control-Allow-Credentials"
            ),
            "Access-Control-Allow-Origin": response.headers.get(
              "Access-Control-Allow-Origin"
            ),
            Note: "Set-Cookie header cannot be read from JavaScript. Check Network tab or document.cookie",
          }
        );
      }

      // Update CSRF token from response
      const newCsrfToken = response.headers.get("X-CSRFToken");
      if (newCsrfToken) {
        this.csrfToken = newCsrfToken;
        // Don't store in localStorage - CSRF token is sent in response headers every time
      }

      // Wait a bit for cookies to be set, then check via document.cookie
      // Note: HttpOnly cookies won't appear in document.cookie, only in Application tab
      if (process.env.NODE_ENV === "development") {
        setTimeout(() => {
          const cookies = document.cookie;
          const hasAuthCookies =
            cookies.includes("access") || cookies.includes("refresh");
          console.log("🍪 Cookies after login (document.cookie):", cookies);
          console.log(
            "🍪 Has auth cookies (from document.cookie):",
            hasAuthCookies
          );
          if (!hasAuthCookies) {
            console.warn(
              "⚠️ HttpOnly cookies may not appear in document.cookie. Check Application tab → Cookies instead."
            );
            console.warn(
              "⚠️ If cookies are missing, check backend CORS and Set-Cookie configuration."
            );
          }
        }, 200);
      }

      // Update cache with user data
      if (data.user) {
        this.cache.userProfile = data.user;
        this.cache.lastFetch = Date.now();
      }

      // Fallback: Store tokens in localStorage in case cookies are blocked
      // Support both naming conventions: access/refresh and access_token/refresh_token
      const accessToken = data.access || data.access_token;
      const refreshToken = data.refresh || data.refresh_token;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        if (process.env.NODE_ENV === "development") {
          console.log("✅ Stored accessToken in localStorage");
        }
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
        if (process.env.NODE_ENV === "development") {
          console.log("✅ Stored refreshToken in localStorage");
        }
      }

      if (!accessToken && !refreshToken) {
        console.warn("⚠️ No tokens found in login response!");
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": this.csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.detail || "Registration failed";
        throw new Error(errorMessage);
      }

      // Update CSRF token
      const newCsrfToken = response.headers.get("X-CSRFToken");
      if (newCsrfToken) {
        this.csrfToken = newCsrfToken;
        // Don't store in localStorage - CSRF token is sent in response headers every time
      }

      // Update cache
      if (data.user) {
        this.cache.userProfile = data.user;
        this.cache.lastFetch = Date.now();
      }

      // Fallback: Store tokens in localStorage in case cookies are blocked
      // Support both naming conventions: access/refresh and access_token/refresh_token
      const accessToken = data.access || data.access_token;
      const refreshToken = data.refresh || data.refresh_token;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        if (process.env.NODE_ENV === "development") {
          console.log("✅ Stored accessToken in localStorage (Register)");
        }
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
        if (process.env.NODE_ENV === "development") {
          console.log("✅ Stored refreshToken in localStorage (Register)");
        }
      }

      if (!accessToken && !refreshToken) {
        console.warn("⚠️ No tokens found in register response!");
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
    // Request deduplication - if there's already a pending request, return it
    if (this.pendingRequests.getUserProfile && !forceRefresh) {
      return this.pendingRequests.getUserProfile;
    }

    // Check cache first
    if (!forceRefresh && this.cache.userProfile && this.isCacheValid()) {
      return this.cache.userProfile;
    }

    // Create the request promise
    const requestPromise = (async () => {
      try {
        const response = await fetch(`${this.baseURL}/auth/user/`, {
          method: "GET",
          headers: {
            "X-CSRFToken": this.csrfToken || "",
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Clear cache on 401
            this.cache.userProfile = null;
            this.cache.lastFetch = null;
            // Also clear localStorage for security
            localStorage.removeItem("user");

            // Don't retry if already force refresh (to prevent infinite loop)
            if (!forceRefresh) {
              // Try to refresh token only once
              const refreshed = await this.refreshToken();
              if (refreshed) {
                // Retry with new token (force refresh to prevent cache)
                return this.getUserProfile(true);
              }
            }

            // If refresh failed or already retried, throw error
            throw new Error("Unauthorized - Please login again");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Sanitize user data before storing
        const sanitizedData = this.sanitizeUserData(data);

        // Update cache
        this.cache.userProfile = sanitizedData;
        this.cache.lastFetch = Date.now();

        // Save to localStorage for persistence (only safe fields)
        try {
          localStorage.setItem("user", JSON.stringify(sanitizedData));
        } catch (error) {
          console.error("Error saving user to localStorage:", error);
          // If localStorage is full, remove old data
          localStorage.removeItem("user");
        }

        return data; // Return original data (not sanitized) for API compatibility
      } catch (error) {
        // Return cached data if available and not a 401 error
        const isUnauthorized =
          error.message?.includes("Unauthorized") ||
          error.message?.includes("401") ||
          error.response?.status === 401;

        if (this.cache.userProfile && this.isCacheValid() && !isUnauthorized) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              "API error, returning cached user profile:",
              error.message
            );
          }
          return this.cache.userProfile;
        }
        throw error;
      } finally {
        // Clear pending request
        this.pendingRequests.getUserProfile = null;
      }
    })();

    // Store pending request
    this.pendingRequests.getUserProfile = requestPromise;

    return requestPromise;
  }

  /**
   * Refresh Access Token
   */
  async refreshToken() {
    // Request deduplication - if there's already a pending refresh, return it
    if (this.pendingRequests.refreshToken) {
      return this.pendingRequests.refreshToken;
    }

    // Create the request promise
    const requestPromise = (async () => {
      try {
        if (process.env.NODE_ENV === "development") {
          console.log("🔄 Refresh token request:", {
            url: `${this.baseURL}/auth/refresh-token/`,
            hasCSRFToken: !!this.csrfToken,
            credentials: "include",
          });
        }

        // CRITICAL: Use credentials: 'include' to send cookies
        const response = await fetch(`${this.baseURL}/auth/refresh-token/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": this.csrfToken || "",
          },
          credentials: "include", // Essential for sending cookies
        });

        // Debug: Log request details
        if (process.env.NODE_ENV === "development") {
          console.log("🔄 Refresh token fetch request:", {
            url: `${this.baseURL}/auth/refresh-token/`,
            method: "POST",
            credentials: "include",
            hasCSRFToken: !!this.csrfToken,
            baseURL: this.baseURL,
            note: "Check Network tab → Request Headers → Cookie to verify cookies are sent",
          });
        }

        if (process.env.NODE_ENV === "development") {
          console.log("🔄 Refresh token response:", {
            status: response.status,
            statusText: response.statusText,
            hasCSRFToken: !!response.headers.get("X-CSRFToken"),
          });
        }

        if (!response.ok) {
          if (process.env.NODE_ENV === "development") {
            const errorText = await response.text();
            console.error("❌ Refresh token failed:", errorText);
          }
          throw new Error("Token refresh failed");
        }

        // Update CSRF token
        const csrfToken = response.headers.get("X-CSRFToken");
        if (csrfToken) {
          this.csrfToken = csrfToken;
          localStorage.setItem("csrfToken", csrfToken);
        }

        return true;
      } catch (error) {
        console.error("Token refresh error:", error);
        // Clear cache on refresh failure
        this.cache.userProfile = null;
        this.cache.lastFetch = null;
        return false;
      } finally {
        // Clear pending request
        this.pendingRequests.refreshToken = null;
      }
    })();

    // Store pending request
    this.pendingRequests.refreshToken = requestPromise;

    return requestPromise;
  }

  /**
   * User Logout
   */
  async logout() {
    try {
      // Clear local state FIRST before API call
      this.clearLocalState();

      // Then call logout API to clear cookies on server
      await fetch(`${this.baseURL}/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": this.csrfToken || "",
        },
        credentials: "include",
      });

      // Clear local state again to ensure everything is cleared
      this.clearLocalState();

      return true;
    } catch (error) {
      console.error("Logout error:", error);
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
        method: "GET",
        credentials: "include",
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
    // Don't need to remove csrfToken from localStorage - we don't store it there
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {
      userProfile: null,
      lastFetch: null,
      cacheTimeout: 30 * 1000,
    };
    localStorage.removeItem("user");
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
