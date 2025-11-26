import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../../shared/services/AuthService";
import useAuth from "../../../shared/hooks/useAuth";
import useLoader from "../../../shared/hooks/useLoader";

export default function Loginauth() {
  const { setUser, setCSRFToken } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(value === "" || validateEmail(value));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Pre-fetch CSRF token when component mounts
  React.useEffect(() => {
    const initAuth = async () => {
      if (!authService.csrfToken) {
        await authService.getCSRFToken();
      }
    };
    initAuth();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    // Client-side validation
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    if (!validateEmail(email)) {
      setError("รูปแบบอีเมลไม่ถูกต้อง");
      setIsValidEmail(false);
      return;
    }

    showLoader("กำลังเข้าสู่ระบบ...");
    setError(null);

    try {
      const response = await authService.login(email, password);

      // HTTP-only cookies are set automatically by the server
      if (response.user) {
        setUser(response.user);
      }

      // Save CSRF token for form submissions
      if (authService.csrfToken) {
        setCSRFToken(authService.csrfToken);
      }

      setEmail("");
      setPassword("");
      hideLoader();

      // Navigate to intended destination or feed
      const from = location?.state?.from?.pathname || "/feed";
      navigate(from, { replace: true });
    } catch (error) {
      hideLoader();

      // Display user-friendly error messages
      const errorMessage = error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      
      if (errorMessage.includes('Network error') || errorMessage.includes('Failed to fetch')) {
        setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
      } else if (errorMessage.includes('Email or Password') || errorMessage.includes('incorrect')) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else if (errorMessage.includes('Invalid input') || errorMessage.includes('Validation')) {
        setError("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
      } else {
        setError(errorMessage);
      }
    }
  }

  return (
    <div className="min-vh-85 d-flex align-items-center justify-content-center">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card border-0">
              <div className="card-body p-5">
                {/* Logo */}
                <div className="text-center mb-4">
                  <h1 className="crimson-text-bold-italic  mb-2">OLAF</h1>
                  <p className="text-muted small">Share your ideas and stories</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-medium">
                      Email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className={`form-control form-control-lg ${!isValidEmail ? 'is-invalid' : ''}`}
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                      />
                    </div>
                    {!isValidEmail && (
                      <div className="invalid-feedback">
                        กรุณากรอกอีเมลที่ถูกต้อง
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-medium">
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={togglePasswordVisibility}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger alert-sm mb-3" role="alert">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-dark btn-lg w-100 mb-3"
                    disabled={!email || !password || !isValidEmail}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center my-4">
                  <hr className="my-3" />
                  <small className="text-muted bg-white px-3">or</small>
                </div>

                {/* Footer */}
                <div className="text-center">
                  <small className="text-muted">
                    Don't have an account?{" "}
                    <a href="/auth/register" className="text-decoration-none fw-medium">
                      Sign up
                    </a>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
