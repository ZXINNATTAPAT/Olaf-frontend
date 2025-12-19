import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LuLayoutDashboard,
  LuFileText,
  LuUsers,
  LuMessageSquare,
  LuTrendingUp,
  LuSettings,
  LuLogOut,
  LuCommand,
  LuSearch
} from 'react-icons/lu';
import useLogout from '../../../shared/hooks/useLogout';
import useAuth from '../../../shared/hooks/useAuth';

export default function AdminSidebar() {
  // const location = useLocation();
  const logout = useLogout();
  const { user } = useAuth();

  // Standard Shadcn sidebar width is usually w-64 (256px)
  const sidebarWidth = "w-[260px]";

  const handleLogout = async () => {
    await logout();
  };

  const menuGroups = [
    {
      label: "Platform",
      items: [
        { path: '/admin', icon: LuLayoutDashboard, label: 'Dashboard' },
        { path: '/admin/posts', icon: LuFileText, label: 'Posts' },
        { path: '/admin/users', icon: LuUsers, label: 'Users' },
      ]
    },
    {
      label: "Community",
      items: [
        { path: '/admin/comments', icon: LuMessageSquare, label: 'Comments' },
        { path: '/admin/analytics', icon: LuTrendingUp, label: 'Analytics' },
      ]
    },
    {
      label: "Settings",
      items: [
        { path: '/admin/settings', icon: LuSettings, label: 'General' },
      ]
    }
  ];

  return (
    <div className={`${sidebarWidth} min-h-screen bg-bg-primary border-r border-border-color fixed left-0 top-0 flex flex-col z-30`}>
      {/* Header / Brand */}
      <div className="h-14 flex items-center px-4 border-b border-border-color">
        <div className="flex items-center gap-2 font-semibold text-text-primary">
          <div className="p-1 bg-black text-white rounded-md">
            <LuCommand className="text-lg" />
          </div>
          <span>Olaf Admin</span>
        </div>
      </div>

      {/* Search (Optional Decoration) */}
      <div className="px-4 py-3">
        <div className="relative">
          <LuSearch className="absolute left-2 top-2.5 h-4 w-4 text-text-muted" />
          <input
            placeholder="Search"
            className="w-full h-9 pl-8 pr-4 text-sm bg-bg-secondary border border-border-color rounded-md focus:outline-none focus:ring-1 focus:ring-black placeholder:text-text-muted"
            disabled
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h4 className="px-2 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider opacity-70">
              {group.label}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                // const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'} // Only exact match for root admin path
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium no-underline
                      ${isActive
                        ? 'bg-black text-white shadow-sm'
                        : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border-color">
        <div className="flex items-center justify-between p-2 rounded-lg bg-bg-secondary border border-border-color hover:bg-bg-tertiary transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-border-color">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="h-full w-full object-cover" />
              ) : (
                <LuUsers className="h-4 w-4 text-text-muted" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-primary leading-none">
                {user?.displayName || 'Admin User'}
              </span>
              <span className="text-xs text-text-muted mt-1 leading-none truncate max-w-[100px]">
                {user?.email || 'admin@example.com'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-text-muted hover:text-red-500 transition-colors p-1"
            title="Logout"
          >
            <LuLogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
