import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ApiController from "../../shared/services/ApiController";
import useAuth from "../../shared/hooks/useAuth";
import { AuthCard, FormField, PasswordField, Button, ErrorMessage } from "../../shared/components";
import { FiMail, FiUser, FiPhone } from 'react-icons/fi';

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(value === "" || validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!username || !email || !password || !passwordConfirmation || !firstName || !lastName) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("รูปแบบอีเมลไม่ถูกต้อง");
      setIsValidEmail(false);
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMessage("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      setLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage("รหัสผ่านไม่ตรงกัน");
      setLoading(false);
      return;
    }

    try {
      const result = await ApiController.register({
        username,
        email,
        password,
        password2: passwordConfirmation,
        first_name: firstName,
        last_name: lastName,
        phone,
      });

      if (!result.success) {
        throw new Error(result.error || "Registration failed");
      }

      setEmail("");
      setPassword("");
      setUsername("");
      setPasswordConfirmation("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setLoading(false);

      if (result.data && result.data.user) {
        setUser(result.data.user);
        navigate("/feed");
      } else {
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setLoading(false);

      if (error.message?.includes('username')) {
        setErrorMessage("ชื่อผู้ใช้นี้มีอยู่แล้ว");
      } else if (error.message?.includes('email')) {
        setErrorMessage("อีเมลนี้มีอยู่แล้ว");
      } else if (error.message?.includes('password')) {
        setErrorMessage("รหัสผ่านไม่ถูกต้อง");
      } else if (error.message?.includes('Network')) {
        setErrorMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
      }
    }
  }

  const passwordMatch = password && passwordConfirmation && password === passwordConfirmation;
  const isFormValid = username && email && password && passwordConfirmation && firstName && lastName && isValidEmail && passwordMatch;

  const footer = (
    <div className="text-center">
      <p className="text-sm text-text-muted">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );

  return (
    <AuthCard 
      title="OLAF" 
      subtitle="Create your account"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorMessage message={errorMessage} className="mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            required
            icon={<FiUser />}
          />
          <FormField
            label="Last Name"
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            required
            icon={<FiUser />}
          />
        </div>

        <FormField
          label="Username"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          required
          icon={<FiUser />}
        />

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

        <FormField
          label="Phone (Optional)"
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          icon={<FiPhone />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <PasswordField
              label="Password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Create password"
              required
            />
            {password && (
              <div className="mt-2">
                <div className="h-1 bg-white border border-black rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength <= 2
                        ? 'bg-red-500'
                        : passwordStrength <= 3
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <p className={`text-xs mt-1 ${
                  passwordStrength <= 2
                    ? 'text-red-600'
                    : passwordStrength <= 3
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}>
                  {passwordStrength <= 2
                    ? 'Weak'
                    : passwordStrength <= 3
                    ? 'Medium'
                    : 'Strong'} Password
                </p>
              </div>
            )}
          </div>
          <div>
            <PasswordField
              label="Confirm Password"
              id="passwordConfirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm password"
              required
              invalid={passwordConfirmation && !passwordMatch}
              errorMessage={passwordConfirmation && !passwordMatch ? "รหัสผ่านไม่ตรงกัน" : ""}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading || !isFormValid}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </AuthCard>
  );
}

