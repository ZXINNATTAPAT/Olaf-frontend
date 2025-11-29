/**
 * Authentication Helper Functions
 * Utilities for checking and managing authentication state
 */

import authService from '../services/AuthService';

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export async function checkAuthentication() {
  try {
    const response = await fetch(`${authService.baseURL}/auth/check/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-CSRFToken': authService.csrfToken || ''
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.isAuthenticated === true;
    }
    return false;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUser() {
  try {
    const user = await authService.getUserProfile();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if user has valid session (cookies)
 * @returns {Promise<boolean>}
 */
export async function hasValidSession() {
  try {
    const isAuthenticated = await checkAuthentication();
    return isAuthenticated;
  } catch (error) {
    return false;
  }
}

/**
 * Verify CSRF token
 * @returns {Promise<boolean>}
 */
export async function verifyCSRFToken() {
  try {
    const token = await authService.getCSRFToken();
    return !!token;
  } catch (error) {
    console.error('Error verifying CSRF token:', error);
    return false;
  }
}

/**
 * Ensure authentication - check and refresh if needed
 * @returns {Promise<boolean>}
 */
export async function ensureAuthentication() {
  try {
    // First check if we have a valid session
    const isAuthenticated = await checkAuthentication();
    
    if (isAuthenticated) {
      return true;
    }
    
    // Try to refresh token
    const refreshed = await authService.refreshToken();
    
    if (refreshed) {
      // Verify again after refresh
      return await checkAuthentication();
    }
    
    return false;
  } catch (error) {
    console.error('Error ensuring authentication:', error);
    return false;
  }
}

/**
 * Get authentication headers for API requests
 * @param {Object} options - Additional options
 * @param {boolean} options.includeCSRF - Include CSRF token (default: true)
 * @param {boolean} options.includeAuth - Include Authorization header (default: false, using cookies)
 * @returns {Promise<Object>}
 */
export async function getAuthHeaders(options = {}) {
  const {
    includeCSRF = true,
    includeAuth = false
  } = options;
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Ensure CSRF token is available
  if (includeCSRF) {
    if (!authService.csrfToken) {
      await authService.getCSRFToken();
    }
    if (authService.csrfToken) {
      headers['X-CSRFToken'] = authService.csrfToken;
    }
  }
  
  // Include Authorization header if needed (usually not needed with HTTP-only cookies)
  if (includeAuth) {
    // Note: Access token is in HTTP-only cookie, but we can add header if needed
    // This is usually not necessary when using cookies
  }
  
  return headers;
}

/**
 * Set authentication state
 * @param {Object} userData - User data to set
 * @param {string} [csrfToken] - CSRF token
 */
export function setAuthState(userData, csrfToken = null) {
  // This is handled by AuthContext and AuthService
  // But we can provide a helper to ensure consistency
  if (csrfToken) {
    authService.csrfToken = csrfToken;
    // Don't store in localStorage - CSRF token is sent in response headers every time
  }
  
  // User data is managed by AuthContext
  // This function is mainly for documentation/consistency
}

/**
 * Clear authentication state
 */
export function clearAuthState() {
  authService.clearLocalState();
  // Additional cleanup if needed
  localStorage.removeItem('user');
  // Don't need to remove csrfToken - we don't store it in localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('us');
}

/**
 * Check if user is admin
 * @param {Object} user - User object
 * @returns {boolean}
 */
export function isAdmin(user) {
  if (!user) return false;
  return user.is_staff === true || user.is_superuser === true;
}

/**
 * Check if user owns resource
 * @param {Object} user - Current user
 * @param {number} resourceUserId - Resource owner user ID
 * @returns {boolean}
 */
export function isOwner(user, resourceUserId) {
  if (!user || !user.id) return false;
  return user.id === resourceUserId;
}

/**
 * Check if user can edit resource
 * @param {Object} user - Current user
 * @param {number} resourceUserId - Resource owner user ID
 * @returns {boolean}
 */
export function canEdit(user, resourceUserId) {
  return isAdmin(user) || isOwner(user, resourceUserId);
}

/**
 * Check if user can delete resource
 * @param {Object} user - Current user
 * @param {number} resourceUserId - Resource owner user ID
 * @returns {boolean}
 */
export function canDelete(user, resourceUserId) {
  return isAdmin(user) || isOwner(user, resourceUserId);
}

/**
 * Validate authentication before API call
 * This function only ensures CSRF token is available.
 * Actual authentication is handled by axios interceptors.
 * @returns {Promise<boolean>}
 */
export async function validateAuthBeforeRequest() {
  try {
    // Only ensure CSRF token is available
    // Don't call /auth/check/ as it's unnecessary and can cause issues
    // Axios interceptor will handle 401 errors and refresh tokens automatically
    if (!authService.csrfToken) {
      await authService.getCSRFToken();
    }
    
    // Return true if CSRF token is available
    // If authentication fails, axios interceptor will handle it
    return !!authService.csrfToken;
  } catch (error) {
    console.error('Error validating auth before request:', error);
    return false;
  }
}

