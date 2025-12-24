import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/css/login.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Swal from "sweetalert2";

export default function Loginform() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredUsername, setRegisteredUsername] = useState("");

  // State for forms
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupUsername, setSignupUsername] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
    // Reset registration success when switching forms
    if (location.pathname === "/login") {
      setRegistrationSuccess(false);
    }
  }, [location.pathname]);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      navigate("/");
    }
  }, [navigate]);

  // Login function
  async function handleLogin(e) {
    e.preventDefault();
    
    if (!loginUsername.trim() || !loginPassword.trim()) {
      // alert("Please fill in all fields");
      Swal.fire({
        toast:true,
  icon: "warning",
  title: "Missing Fields",
  text: "Please fill in all required fields.",
});

      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok && data.token) {
        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Dispatch auth event for Navbar
        window.dispatchEvent(new Event("authChange"));
        
        // alert(data.message || "Login successful!");
        Swal.fire({
  icon: "success",
  title: "Login Successful",
  text: data.message || "Welcome back!",
  timer: 1500,
  showConfirmButton: false,
});

        navigate("/");
      } else {
        let errorMsg = data.message || "Login failed";
        if (data.errors) {
          errorMsg += ": " + Object.values(data.errors).flat().join(", ");
        } else if (data.detail) {
          errorMsg = data.detail;
        }
        // alert(errorMsg);
        Swal.fire({
  icon: "error",
  title: "Login Failed",
  text: errorMsg,
});

      }
    } catch (err) {
      console.error("Login error:", err);
      // alert("Network error. Please check your connection and CORS settings.");
      Swal.fire({
  icon: "error",
  title: "Network Error",
  text: "Check your connection or CORS settings.",
});

    } finally {
      setLoading(false);
    }
  }

  // Signup function
  async function handleSignup(e) {
    e.preventDefault();
    
    // Validation
    if (!signupUsername.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      // alert("Passwords do not match");
      Swal.fire({
  icon: "warning",
  title: "Password Mismatch",
  text: "Both passwords must match.",
});

      return;
    }

    if (signupPassword.length < 8) {
      // alert("Password must be at least 8 characters long");
      Swal.fire({
  icon: "info",
  title: "Weak Password",
  text: "Password must be at least 8 characters long.",
});

      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
          first_name: signupFirstName,
          last_name: signupLastName,
        }),
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (res.ok) {
        // Registration successful - but DO NOT login automatically
        setRegistrationSuccess(true);
        setRegisteredUsername(signupUsername);
        
        // Clear form fields
        setSignupUsername("");
        setSignupFirstName("");
        setSignupLastName("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupConfirmPassword("");
        
        // alert(data.message || "Registration successful! Please login with your credentials.");
        Swal.fire({
  icon: "success",
  title: "Registration Successful",
  text: data.message || "Please login with your new credentials.",
  confirmButtonText: "OK",
});

        // Auto-fill login form with registered username
        setLoginUsername(signupUsername);
        
        // Switch to login form
        navigate("/login");
      } else {
        let errorMsg = data.message || "Signup failed";
        if (data.errors) {
          const errors = [];
          Object.entries(data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => errors.push(`${field}: ${msg}`));
            } else {
              errors.push(`${field}: ${messages}`);
            }
          });
          errorMsg += "\n" + errors.join("\n");
        }
        // alert(errorMsg);
        Swal.fire({
  icon: "error",
  title: "Signup Failed",
  html: errorMsg.replace(/\n/g, "<br/>"), // keeps formatting
});

      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Network error. Please check your connection and CORS settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="form-container">
          <div className="form-toggle">
            <button
              className={isLogin ? "active" : ""}
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Login
            </button>
            <button
              className={!isLogin ? "active" : ""}
              onClick={() => navigate("/signup")}
              disabled={loading}
            >
              Signup
            </button>
          </div>

          {/* Show success message if just registered */}
          {isLogin && registrationSuccess && (
            <div className="success-message">
              ✅ Registration successful! Please login with your credentials.
              {registeredUsername && (
                <p>Username: <strong>{registeredUsername}</strong> is pre-filled for you.</p>
              )}
            </div>
          )}

          {isLogin ? (
            <form className="form" onSubmit={handleLogin}>
              <h2>Login Form</h2>
              <input
                type="text"
                placeholder="Enter your username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                disabled={loading}
                required
              />
              
              <input
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                disabled={loading}
                required
              />
              
              <a href="#"onClick={()=>navigate("/forgotpassword")}>Forgot password?</a>
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              
              <p>
                Not a member?{" "}
                <a href="#" onClick={() => navigate("/signup")}>
                  Signup now
                </a>
              </p>
            </form>
          ) : (
            <form className="form" onSubmit={handleSignup}>
              <h2>Signup Form</h2>
              <input 
                type="text" 
                placeholder="Enter your Username *"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                disabled={loading}
                required
              />
              <input 
                type="text" 
                placeholder="Enter your First Name"
                value={signupFirstName}
                onChange={(e) => setSignupFirstName(e.target.value)}
                disabled={loading}
              />
              <input 
                type="text" 
                placeholder="Enter your Last Name"
                value={signupLastName}
                onChange={(e) => setSignupLastName(e.target.value)}
                disabled={loading}
              />
              <input 
                type="email" 
                placeholder="Enter your email *"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                disabled={loading}
                required
              />
              <input 
                type="password" 
                placeholder="Enter your password *"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                disabled={loading}
                required
                minLength="8"
              />
              <input 
                type="password" 
                placeholder="Confirm password *"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Signup"}
              </button>
              
              <p>
                Already have an account?{" "}
                <a href="#" onClick={() => navigate("/login")}>
                  Login
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}