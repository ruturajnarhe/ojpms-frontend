import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await api.post("/users/login", null, {
        params: {
          email: email,
          password: password,
        },
      });

      const user = response.data;

      console.log("Logged in user:", user);

      // Store logged-in user
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Login successful!");

      // Redirect based on role
      if (user.role === "JOB_SEEKER") {
        navigate("/jobs");
      } else if (user.role === "RECRUITER") {
        navigate("/recruiter-dashboard");
      } else {
        setMessage("Invalid user role");
      }
    } catch (error) {
      console.error("Login error:", error);

      setMessage(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        {/* EMAIL */}

        <div>
          <label>Email</label>

          <br />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <br />

        {/* PASSWORD */}

        <div>
          <label>Password</label>

          <br />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">Login</button>
      </form>

      {/* MESSAGE */}

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}
    </div>
  );
}

export default Login;
