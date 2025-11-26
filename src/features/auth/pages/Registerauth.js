import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiController from "../../../shared/services/ApiController";
import useAuth from "../../../shared/hooks/useAuth";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  function onEmailChange(event) {
    const value = event.target.value;
    setEmail(value);
    setIsValidEmail(value === "" || validateEmail(value));
  }

  function onPasswordChange(event) {
    const value = event.target.value;
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  }

  function onUsernameChange(event) {
    setUsername(event.target.value);
  }

  function onPasswordConfirmationChange(event) {
    setPasswordConfirmation(event.target.value);
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  function onFirstNameChange(event) {
    setFirstName(event.target.value);
  }

  function onLastNameChange(event) {
    setLastName(event.target.value);
  }

  function onPhoneChange(event) {
    setPhone(event.target.value);
  }

  async function onSubmitForm(event) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage(""); // Reset error message

    // Enhanced validation
    if (
      !username ||
      !email ||
      !password ||
      !passwordConfirmation ||
      !firstName ||
      !lastName
    ) {
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

      // Clear form inputs
      setEmail("");
      setPassword("");
      setUsername("");
      setPasswordConfirmation("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setLoading(false);

      // Auto-login if user data is returned
      if (result.data && result.data.user) {
        setUser(result.data.user);
        navigate("/feed");
      } else {
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setLoading(false);

      // แสดง error message ที่เข้าใจง่าย
      if (error.message?.includes('username')) {
        setErrorMessage("ชื่อผู้ใช้นี้มีอยู่แล้ว");
      } else if (error.message?.includes('email')) {
        setErrorMessage("อีเมลนี้มีอยู่แล้ว");
      } else if (error.message?.includes('password')) {
        setErrorMessage("รหัสผ่านไม่ถูกต้อง");
      } else if (error.message?.includes('400')) {
        setErrorMessage("ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูลที่กรอก");
      } else if (error.message?.includes('409')) {
        setErrorMessage("อีเมลหรือชื่อผู้ใช้นี้มีอยู่แล้ว");
      } else if (error.message?.includes('500')) {
        setErrorMessage("เกิดข้อผิดพลาดในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง");
      } else if (error.message?.includes('Network')) {
        setErrorMessage(
          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต"
        );
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
      }
    }
  }

  return (
    <div className="min-vh-50 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <h1 className="crimson-text-bold-italic text-dark mb-2">
                    OLAF
                  </h1>
                  <p className="text-muted small">Create your account</p>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div
                    className="alert alert-danger alert-sm mb-4"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                )}

                {/* Register Form */}
                <form onSubmit={onSubmitForm}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="firstName"
                        className="form-label fw-medium"
                      >
                        First Name
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-person"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="firstName"
                          placeholder="Enter first name"
                          value={firstName}
                          onChange={onFirstNameChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="lastName"
                        className="form-label fw-medium"
                      >
                        Last Name
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-person"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="lastName"
                          placeholder="Enter last name"
                          value={lastName}
                          onChange={onLastNameChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-medium">
                      Username
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-at"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="username"
                        placeholder="Choose a username"
                        value={username}
                        onChange={onUsernameChange}
                        required
                      />
                    </div>
                  </div>

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
                        className={`form-control form-control-lg ${!isValidEmail ? "is-invalid" : ""
                          }`}
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={onEmailChange}
                        required
                      />
                    </div>
                    {!isValidEmail && (
                      <div className="invalid-feedback">
                        กรุณากรอกอีเมลที่ถูกต้อง
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label fw-medium">
                      Phone <small className="text-muted">(Optional)</small>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-telephone"></i>
                      </span>
                      <input
                        type="tel"
                        className="form-control form-control-lg"
                        id="phone"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={onPhoneChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="password"
                        className="form-label fw-medium"
                      >
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
                          placeholder="Create password"
                          value={password}
                          onChange={onPasswordChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={togglePasswordVisibility}
                        >
                          <i
                            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"
                              }`}
                          ></i>
                        </button>
                      </div>
                      {password && (
                        <div className="mt-2">
                          <div className="progress" style={{ height: "4px" }}>
                            <div
                              className={`progress-bar ${passwordStrength <= 2
                                ? "bg-danger"
                                : passwordStrength <= 3
                                  ? "bg-warning"
                                  : "bg-success"
                                }`}
                              style={{
                                width: `${(passwordStrength / 5) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <small
                            className={`text-${passwordStrength <= 2
                              ? "danger"
                              : passwordStrength <= 3
                                ? "warning"
                                : "success"
                              }`}
                          >
                            {passwordStrength <= 2
                              ? "Weak"
                              : passwordStrength <= 3
                                ? "Medium"
                                : "Strong"}{" "}
                            Password
                          </small>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mb-4">
                      <label
                        htmlFor="passwordConfirmation"
                        className="form-label fw-medium"
                      >
                        Confirm Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-lock-fill"></i>
                        </span>
                        <input
                          type={showPasswordConfirmation ? "text" : "password"}
                          className="form-control form-control-lg"
                          id="passwordConfirmation"
                          placeholder="Confirm password"
                          value={passwordConfirmation}
                          onChange={onPasswordConfirmationChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={togglePasswordConfirmationVisibility}
                        >
                          <i
                            className={`bi ${showPasswordConfirmation
                              ? "bi-eye-slash"
                              : "bi-eye"
                              }`}
                          ></i>
                        </button>
                      </div>
                      {passwordConfirmation &&
                        password !== passwordConfirmation && (
                          <div className="invalid-feedback d-block">
                            รหัสผ่านไม่ตรงกัน
                          </div>
                        )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark btn-lg w-100 mb-3"
                    disabled={
                      loading ||
                      !email ||
                      !password ||
                      !passwordConfirmation ||
                      !username ||
                      !firstName ||
                      !lastName ||
                      !isValidEmail ||
                      password !== passwordConfirmation
                    }
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>

                {/* Footer */}
                <div className="text-center">
                  <small className="text-muted">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-decoration-none">
                      Sign in
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
