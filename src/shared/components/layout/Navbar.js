import React from "react";
import "../../../App.css";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { user, accessToken } = useAuth();
  

  return (
    <>
      <nav
        className="navbar border-bottom border-dark border-opacity-10"
        style={{ background: "none", fontWeight: "bold" }}
      >
        <div className="container-fluid">
          <span
            className="crimson-text-bold-italic"
            style={{ fontSize: "30px" }}
          >
            <NavLink className="nav-link" to="/">OLAF.</NavLink>
          </span>

          <div className="d-flex">
            {/* Signup Button */}
            {!accessToken && (
              <button
                className="btn btn-success m-1"
                style={{ fontSize: "16px" }}
              >
                <NavLink className="nav-link" to="/auth/register">
                  Sign up
                </NavLink>
              </button>
            )}

            {/* Signin Button */}
            {!accessToken && (
              <button
                className="btn btn-outline-dark m-1"
                style={{ fontSize: "16px" }}
              >
                <NavLink className="nav-link" to="/auth/login">
                  Sign in
                </NavLink>
              </button>
            )}

            {accessToken && (
              <button
                className="btn btn-outline-dark m-1"
                style={{ fontSize: "16px" }}
              >
                <NavLink className="nav-link" to="/addcontent">
                  write +
                </NavLink>
              </button>
            )}

            {/* User Profile Dropdown */}
            {accessToken && user.username && (
              <div className="btn-group">
                <button
                  className="btn btn-outline-white m-1"
                  type="button"
                  id="dropdownMenu2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ fontSize: "16px" }}
                >
                  <i className="bi bi-person-circle"></i> {user.username}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenu2"
                >
                  <li>
                    <NavLink className="dropdown-item" to="/profile">
                      Profile
                    </NavLink>
                  </li>
                  {/* <li>
                                    <NavLink className='dropdown-item' to='/settings'>
                                    Settings
                                    </NavLink>
                                </li> */}
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
      </nav>
    </>
  );
}
