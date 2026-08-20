import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("JOB_SEEKER");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const user = {
        name: name,
        email: email,
        password: password,
        role: role,
      };

      await api.post("/users", user);

      setMessage("Registration successful!");

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setRole("JOB_SEEKER");

      // Redirect to login after registration
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          error.response?.data ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-auth-page">
      <div className="register-auth-container">
        {/* Logo */}

        <div className="auth-logo">OJPMS</div>

        {/* Heading */}

        <h1>Create Account</h1>

        <p className="auth-subtitle">Create your Online Job Portal account</p>

        {/* Message */}

        {message && (
          <div
            className={
              message === "Registration successful!"
                ? "success-message"
                : "error-message"
            }
          >
            {message}
          </div>
        )}

        {/* Registration Form */}

        <form onSubmit={handleSubmit}>
          {/* Name */}

          <div className="form-group">
            <label className="form-label">Full Name</label>

            <input
              className="form-input"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}

          <div className="form-group">
            <label className="form-label">Email Address</label>

            <input
              className="form-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}

          <div className="form-group">
            <label className="form-label">Password</label>

            <div className="password-wrapper">
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Role */}

          <div className="form-group">
            <label className="form-label">Register As</label>

            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="JOB_SEEKER">Job Seeker</option>

              <option value="RECRUITER">Recruiter</option>
            </select>
          </div>

          {/* Register Button */}

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}

        <div className="auth-footer">
          <span>Already have an account?</span>

          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
