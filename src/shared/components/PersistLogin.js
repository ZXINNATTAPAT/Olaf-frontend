import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import authService from "../services/AuthService";

export default function PersistLogin() {
  const { user, setUser, setInitializing } = useAuth();
  const hasChecked = useRef(false);
  const isChecking = useRef(false);

  // Check if we have cached user - if yes, verify in background
  // If no cached user, verify immediately
  useEffect(() => {
    // Skip if already checked or currently checking
    if (hasChecked.current || isChecking.current) return;
    
    // If we have cached user, verify in background (non-blocking)
    // If no cached user, verify immediately
    const hasCachedUser = user && Object.keys(user).length > 0 && (user.username || user.email || user.id);
    
    async function verifyUser() {
      isChecking.current = true;
      hasChecked.current = true;

      try {
        // Verify with server to get latest user data
        const response = await authService.getUserProfile();
        
        if (response && (response.username || response.email || response.id)) {
          // Update user with latest data from server
          setUser(response);
        } else {
          // No valid user - clear cache only if we don't have cached user
          if (!hasCachedUser) {
          setUser({});
          localStorage.removeItem('user');
          }
        }
      } catch (error) {
        // Handle different error types
        const isUnauthorized = error.message?.includes('Unauthorized') || 
                              error.message?.includes('401') ||
                              (error.response?.status === 401);
        
        const isServerError = error.message?.includes('500') ||
                             error.message?.includes('Internal Server Error') ||
                             (error.response?.status >= 500);
        
        const isNetworkError = !error.response || error.message?.includes('Network error');
        
        // Only clear user data on 401 Unauthorized
        // For server errors (500) or network errors, keep cached user
        if (isUnauthorized) {
          // 401 - User is not authenticated, clear user data
          setUser({});
          localStorage.removeItem('user');
        } else if (isServerError || isNetworkError) {
          // Server error or network error - keep cached user
          // Don't clear user data, let them continue using cached data
          if (process.env.NODE_ENV === 'development') {
            console.warn('Server/Network error during auth check, keeping cached user:', error.message);
        }
          // Keep existing user data (already set from cache)
        } else {
          // Other errors - log but keep cached user if available
          if (process.env.NODE_ENV === 'development') {
            console.log('Authentication check failed:', error);
          }
          // Keep cached user if available
          if (!hasCachedUser) {
        setUser({});
        localStorage.removeItem('user');
          }
        }
      } finally {
        setInitializing(false);
        isChecking.current = false;
      }
    }

    // If we have cached user, verify in background (non-blocking)
    // This allows UI to render immediately with cached data
    if (hasCachedUser) {
      // Set initializing to false immediately so UI can render
      setInitializing(false);
      // Verify in background
      verifyUser();
    } else {
      // No cached user - verify immediately (blocking)
      verifyUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Show loading only if we don't have cached user and still checking
  const hasCachedUser = user && Object.keys(user).length > 0 && (user.username || user.email || user.id);
  if (!hasCachedUser && isChecking.current) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
