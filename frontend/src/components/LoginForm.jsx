import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './LoginForm.css';

function LoginForm({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("Login response:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true); // ✅ this updates App state
        navigate("/profile");
      } else {
        console.error("No token received");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;