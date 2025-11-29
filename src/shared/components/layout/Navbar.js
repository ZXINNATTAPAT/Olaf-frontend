import React from "react";
import "../../../App.css";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth(); // ใช้ user เป็นหลัก เพราะใช้ cookies
  
  // Debug: Log user state
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔵 Navbar - User state:', user);
    }
  }, [user]);

  return (
    <>
      <nav
        className="navbar fixed-top"
        style={{ 
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          zIndex: 1000,
          paddingTop: "1rem",
          paddingBottom: "1rem"
        }}
      >
        <style>{`
          [data-theme="dark"] nav.navbar {
            background: rgba(0, 0, 0, 0.8) !important;
            border-bottom-color: rgba(255, 255, 255, 0.1) !important;
          }
          nav.navbar .nav-link {
            color: rgba(0, 0, 0, 0.84) !important;
            text-decoration: none;
            font-weight: 400;
            transition: color 0.2s;
          }
          nav.navbar .nav-link:hover {
            color: rgba(0, 0, 0, 0.6) !important;
          }
          [data-theme="dark"] nav.navbar .nav-link {
            color: rgba(255, 255, 255, 0.84) !important;
          }
          [data-theme="dark"] nav.navbar .nav-link:hover {
            color: rgba(255, 255, 255, 0.6) !important;
          }
        `}</style>
        <div className="container-fluid d-flex justify-content-between align-items-center px-0">
          <div className="container mx-auto d-flex justify-content-between align-items-center w-100" style={{ maxWidth: "1192px", background: "transparent", paddingLeft: "1rem", paddingRight: "1rem" }}>
            <span
              className="crimson-text-bold-italic"
              style={{ fontSize: "30px", marginLeft: "0" }}
            >
              <NavLink className="nav-link" to="/">OLAF.</NavLink>
            </span>

            <div className="d-flex align-items-center gap-3">
            {/* Signup Button */}
            {(!user || Object.keys(user).length === 0) && (
              <NavLink 
                className="nav-link" 
                to="/auth/register"
                style={{ 
                  fontSize: "14px",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  backgroundColor: "rgba(0, 0, 0, 0.84)",
                  color: "white !important"
                }}
              >
                  Sign up
                </NavLink>
            )}

            {/* Signin Button */}
            {(!user || Object.keys(user).length === 0) && (
              <NavLink 
                className="nav-link" 
                to="/auth/login"
                style={{ 
                  fontSize: "14px",
                  padding: "0.5rem 1rem"
                }}
              >
                  Sign in
                </NavLink>
            )}

            {user && Object.keys(user).length > 0 && (
              <NavLink
                to="/addcontent"
                className="nav-link d-flex align-items-center gap-2"
                style={{ 
                  fontSize: "14px",
                  padding: "0.5rem 1rem"
                }}
              >
                <i className="bi bi-pencil-square" style={{ fontSize: "16px" }}></i>
                Write
                </NavLink>
            )}

            {/* User Profile Dropdown */}
            {user && user.username && (
              <div className="btn-group">
                <button
                  type="button"
                  id="dropdownMenu2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ 
                    fontSize: "32px",
                    padding: "0",
                    border: "none",
                    background: "transparent",
                    color: "rgba(0, 0, 0, 0.84)",
                    cursor: "pointer",
                    lineHeight: "1"
                  }}
                  aria-label={`${user.username} profile menu`}
                >
                  <i className="bi bi-person-circle"></i>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenu2"
                  style={{
                    background: "white",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    padding: "0.5rem 0",
                    minWidth: "200px"
                  }}
                >
                  <style>{`
                    [data-theme="dark"] .dropdown-menu {
                      background: rgba(0, 0, 0, 0.9) !important;
                      border-color: rgba(255, 255, 255, 0.1) !important;
                    }
                    .dropdown-item {
                      padding: 0.5rem 1rem;
                      font-size: 14px;
                      color: rgba(0, 0, 0, 0.84);
                      transition: background-color 0.2s;
                    }
                    .dropdown-item:hover {
                      background-color: rgba(0, 0, 0, 0.05);
                    }
                    [data-theme="dark"] .dropdown-item {
                      color: rgba(255, 255, 255, 0.84);
                    }
                    [data-theme="dark"] .dropdown-item:hover {
                      background-color: rgba(255, 255, 255, 0.1);
                    }
                  `}</style>
                  <li>
                    <NavLink className="dropdown-item" to="/profile">
                      Profile
                    </NavLink>
                  </li>
                  {/* Admin Link - Only show if user is admin */}
                  {(user?.is_staff || user?.is_admin || user?.role === 'admin') && (
                    <li>
                      <NavLink className="dropdown-item" to="/admin">
                        Admin Panel
                                    </NavLink>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" style={{ margin: "0.5rem 0", borderColor: "rgba(0, 0, 0, 0.08)" }} /></li>
                  <li>
                    <NavLink className="dropdown-item" to="/auth/user">
                      Logout
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
