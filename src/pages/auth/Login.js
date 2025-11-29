import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import authService from "../../shared/services/AuthService";
import useAuth from "../../shared/hooks/useAuth";
import useLoader from "../../shared/hooks/useLoader";
import { AuthCard, FormField, PasswordField, Button, ErrorMessage } from "../../shared/components";
import { FiMail } from 'react-icons/fi';

export default function Login() {
  const { setUser, setCSRFToken } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(value === "" || validateEmail(value));
  };

  useEffect(() => {
    const initAuth = async () => {
      if (!authService.csrfToken) {
        await authService.getCSRFToken();
      }
    };
    initAuth();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

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
      // Clear any existing user data before login
      setUser({});
      localStorage.removeItem('user');
      
      const response = await authService.login(email, password);

      if (response.user) {
        // Set new user data
        setUser(response.user);
      }

      if (authService.csrfToken) {
        setCSRFToken(authService.csrfToken);
      }

      // Check if cookies were set after login
      setTimeout(() => {
        const cookies = document.cookie;
        const hasAuthCookies = cookies.includes('access') || cookies.includes('refresh');
        
        if (!hasAuthCookies && process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Warning: Authentication cookies were not set after login. This may cause authentication issues.');
          console.warn('Please check backend CORS and cookie settings.');
        }
      }, 200);

      setEmail("");
      setPassword("");
      hideLoader();

      const from = location?.state?.from?.pathname || "/feed";
      navigate(from, { replace: true });
    } catch (error) {
      hideLoader();
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

  const footer = (
    <div className="text-center">
      <p className="text-sm text-text-muted">
        Don't have an account?{" "}
        <Link to="/auth/register" className="text-text-primary font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );

  return (
    <AuthCard 
      title="OLAF" 
      subtitle="Share your ideas and stories"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          required
          invalid={!isValidEmail}
          errorMessage="กรุณากรอกอีเมลที่ถูกต้อง"
          icon={<FiMail />}
        />

        <PasswordField
          label="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <ErrorMessage message={error} className="mb-4" />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={!email || !password || !isValidEmail}
        >
          Sign In
        </Button>
      </form>
    </AuthCard>
  );
}

