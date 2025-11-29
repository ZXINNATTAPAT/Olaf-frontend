import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useAuth from '../../shared/hooks/useAuth';
import useLogout from "../../shared/hooks/useLogout";
import { AuthCard, Button } from "../../shared/components";

export default function User() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();
  const [loading, setLoading] = useState(false);

  async function handleLogout(e) {
    e.preventDefault();
    setLoading(true);
    sessionStorage.clear('reloaded');
    await logout();
    navigate('/');
  }

  return (
    <AuthCard title="User Profile" subtitle="Your account information">
      <div className="space-y-4">
        <div className="p-4 bg-bg-tertiary rounded-lg">
          <p className="text-sm text-text-muted mb-1">ID</p>
          <p className="text-text-primary font-medium">{user?.id || 'N/A'}</p>
        </div>
        <div className="p-4 bg-bg-tertiary rounded-lg">
          <p className="text-sm text-text-muted mb-1">Username</p>
          <p className="text-text-primary font-medium">{user?.username || 'N/A'}</p>
        </div>
        <div className="p-4 bg-bg-tertiary rounded-lg">
          <p className="text-sm text-text-muted mb-1">Email</p>
          <p className="text-text-primary font-medium">{user?.email || 'N/A'}</p>
        </div>
        <Button
          type="button"
          variant="primary"
          className="w-full"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </AuthCard>
  );
}

