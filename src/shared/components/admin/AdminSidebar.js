import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiLayout, 
  FiFileText, 
  FiUsers, 
  FiMessageSquare, 
  FiBarChart2,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import useLogout from '../../../shared/hooks/useLogout';

export default function AdminSidebar() {
  const location = useLocation();
  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { path: '/admin', icon: FiLayout, label: 'Dashboard' },
    { path: '/admin/posts', icon: FiFileText, label: 'Posts' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/comments', icon: FiMessageSquare, label: 'Comments' },
    { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div className="w-[260px] min-h-screen bg-bg-secondary border-r border-border-color fixed left-0 top-0 py-8 flex flex-col transition-all duration-300">
      {/* Logo */}
      <div className="px-6 mb-8">
        <h2 className="text-2xl font-bold text-text-primary m-0 tracking-tight">
          Admin Panel
        </h2>
        <p className="text-sm text-text-muted mt-1 mb-0">
          Blog Management
        </p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 mb-2 rounded-lg no-underline transition-all duration-200
                ${isActive 
                  ? 'text-text-primary bg-bg-tertiary font-medium' 
                  : 'text-text-muted font-normal hover:bg-bg-tertiary'
                }
              `}
            >
              <Icon className={`text-xl ${isActive ? 'text-text-primary' : 'text-text-muted'}`} />
              <span className="text-[0.9375rem]">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-4 border-t border-border-color pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-0 bg-transparent text-text-muted cursor-pointer text-[0.9375rem] transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary"
        >
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
