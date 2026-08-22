import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login/`,
        {
          username,
          password,
        }
      );

      console.log("Login response:", response.data);

      // Check whether backend returned access token
      if (!response.data.access) {
        alert("Login failed. Access token not received.");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", response.data.access);

      // Save refresh token if backend sends it
      if (response.data.refresh) {
        localStorage.setItem("refreshToken", response.data.refresh);
      }

      // Save username
      localStorage.setItem(
        "username",
        response.data.username || username
      );

      alert("Login Successful");

      // Navigate to Home
      navigate("/home", { replace: true });

    } catch (error) {
      console.error("Login error:", error.response?.data || error);

      if (error.response) {
        const data = error.response.data;

        alert(
          data.detail ||
          data.message ||
          "Invalid username or password"
        );
      } else {
        alert("Cannot connect to backend");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;