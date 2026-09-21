
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { useToast } from "../ToastContext";

function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // LOGIN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    // Empty field validation
    if (!username || !password) {
      showToast(
        "Please enter username and password",
        "error"
      );
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

      // =========================
      // CHECK ACCESS TOKEN
      // =========================
      if (!response.data.access) {
        showToast(
          "Login failed. Access token not received.",
          "error"
        );
        return;
      }

      // =========================
      // SAVE ACCESS TOKEN
      // =========================
      localStorage.setItem(
        "token",
        response.data.access
      );

      // =========================
      // SAVE REFRESH TOKEN
      // =========================
      if (response.data.refresh) {
        localStorage.setItem(
          "refreshToken",
          response.data.refresh
        );
      }

      // =========================
      // SAVE USERNAME
      // =========================
      localStorage.setItem(
        "username",
        response.data.username || username
      );

      // =========================
      // SUCCESS POPUP
      // =========================
      showToast(
        "Login successful!",
        "success"
      );

      // Wait so user can see popup
      setTimeout(() => {
        navigate("/home", {
          replace: true,
        });
      }, 1200);

    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data || error
      );

      if (error.response) {
        const data = error.response.data;
        const status = error.response.status;

        if (status === 401) {
          showToast(
            data.detail ||
              "Invalid username or password",
            "error"
          );
        } else if (status >= 500) {
          showToast(
            "Server error. Please try again later.",
            "error"
          );
        } else {
          showToast(
            data.detail ||
              data.message ||
              "Login failed",
            "error"
          );
        }
      } else {
        showToast(
          "Cannot connect to backend",
          "error"
        );
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

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;

