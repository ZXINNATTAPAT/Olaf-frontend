import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../../shared/hooks/useAuth';
import authService from '../../../shared/services/AuthService';

export default function AdminMiddleware() {
  const { user, initializing } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        // Check if user is authenticated
        if (!user || Object.keys(user).length === 0) {
          setIsAdmin(false);
          setChecking(false);
          return;
        }

        // Check if user has admin role
        // TODO: Replace with actual admin role check from API
        // For now, check if user object has is_staff or is_admin property
        const userProfile = await authService.getUserProfile();
        const hasAdminRole = userProfile?.is_staff || userProfile?.is_admin || userProfile?.role === 'admin';
        
        setIsAdmin(hasAdminRole || false);
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    if (!initializing) {
      checkAdminRole();
    }
  }, [user, initializing]);

  // Show loading while checking authentication
  if (initializing || checking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to home if not admin
  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
