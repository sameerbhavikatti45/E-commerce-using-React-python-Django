import React, { useState, useEffect } from "react"; // Added useEffect import
import axios from "axios";
import "./styles/css/ForgotPassword.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Step 1: Request reset
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/forgot-password", { email });

      if (response.data.success) {
        setMessage("Reset code sent to your email");
        setStep(2);
        setResendTimer(60); // 60 seconds cooldown
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify reset code - ADDED THIS FUNCTION
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/verify-reset-code", {
        email,
        code: resetCode,
      });

      if (response.data.success) {
        setToken(response.data.token);
        setMessage("Code verified. Set your new password");
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password - ADDED THIS FUNCTION
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });

      if (response.data.success) {
        setMessage("Password reset successfully! You can now login");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/resend-code", { email });

      if (response.data.success) {
        setMessage("New code sent to your email");
        setResendTimer(60);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    const mediumRegex =
      /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

    if (strongRegex.test(password)) return "strong";
    if (mediumRegex.test(password)) return "medium";
    return "weak";
  };

  const passwordStrength = checkPasswordStrength(newPassword);

  return (
    <>
      <Navbar />
      <div className="forgot-password-flow">
        <h2>Reset Your Password</h2>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-step">
            <div className={`step-circle ${step >= 1 ? "active" : ""}`}>
              {step > 1 ? "✓" : "1"}
            </div>
            <span className={`step-label ${step === 1 ? "active" : ""}`}>
              Enter Email
            </span>
          </div>
          <div className="progress-step">
            <div className={`step-circle ${step >= 2 ? "active" : ""}`}>
              {step > 2 ? "✓" : "2"}
            </div>
            <span className={`step-label ${step === 2 ? "active" : ""}`}>
              Verify Code
            </span>
          </div>
          <div className="progress-step">
            <div className={`step-circle ${step >= 3 ? "active" : ""}`}>3</div>
            <span className={`step-label ${step === 3 ? "active" : ""}`}>
              New Password
            </span>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label>Enter your email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? (
                <span className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeSubmit}>
            <div className="email-display">
              Code sent to: <strong>{email}</strong>
            </div>
            <div className="form-group">
              <label>Enter 6-digit verification code</label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) =>
                  setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="123456"
                maxLength="6"
                pattern="\d{6}"
                required
              />
            </div>

            <div className="resend-container">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendTimer > 0 || loading}
                className="resend-link"
              >
                {resendTimer > 0
                  ? `Resend code in ${resendTimer}s`
                  : "Resend code"}
              </button>
            </div>

            <div className="button-group">
              <button
                type="submit"
                disabled={loading || resetCode.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <button type="button" onClick={() => setStep(1)}>
                Back
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset}>
            <div className="form-group">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="password-strength">
                  <div
                    className={`strength-bar strength-${passwordStrength}`}
                  ></div>
                  <div className="strength-text">
                    Strength: {passwordStrength}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            {/* Password Requirements */}
            <div className="password-requirements">
              <h4>Password must include:</h4>
              <div
                className={`requirement ${
                  newPassword.length >= 6 ? "valid" : "invalid"
                }`}
              >
                <span className="requirement-icon">
                  {newPassword.length >= 6 ? "✓" : "○"}
                </span>
                At least 6 characters
              </div>
              <div
                className={`requirement ${
                  /(?=.*[A-Z])/.test(newPassword) ? "valid" : "invalid"
                }`}
              >
                <span className="requirement-icon">
                  {/(?=.*[A-Z])/.test(newPassword) ? "✓" : "○"}
                </span>
                One uppercase letter
              </div>
              <div
                className={`requirement ${
                  /(?=.*[0-9])/.test(newPassword) ? "valid" : "invalid"
                }`}
              >
                <span className="requirement-icon">
                  {/(?=.*[0-9])/.test(newPassword) ? "✓" : "○"}
                </span>
                One number
              </div>
            </div>

            <div className="button-group">
              <button
                type="submit"
                disabled={
                  loading ||
                  newPassword.length < 6 ||
                  newPassword !== confirmPassword
                }
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <button type="button" onClick={() => setStep(2)}>
                Back
              </button>
            </div>
          </form>
        )}

        {message && (
          <div
            className={`message ${
              message.includes("successfully") ? "success" : "info"
            }`}
          >
            {message}
          </div>
        )}

        {error && <div className="message error">{error}</div>}

        <div className="terms-notice">
          By resetting your password, you agree to our
          <a href="/terms"> Terms of Service</a> and
          <a href="/privacy"> Privacy Policy</a>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ForgotPassword;
