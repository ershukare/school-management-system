import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login successful:", data);

      // Token fi user browser keessatti kuusi
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Role irratti hundaa'uun gara dashboard sirrii deemi
      if (data.user.role === "admin") {
        navigate("/");
      } else if (data.user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (data.user.role === "student") {
        navigate("/student-dashboard");
      } else {
        throw new Error("Unknown user role");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          S
        </div>

        {/* Title */}
        <h2 className="login-title">
          School Management System
        </h2>

        <p className="login-subtitle">
          Sign in to continue to your account
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="login-form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="login-input"
            />
          </div>

          {/* Password */}
          <div className="login-form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="login-input"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Footer */}
        <div className="login-footer">
          School Management System © 2026
        </div>

      </div>
    </div>
  );
}

export default Login;