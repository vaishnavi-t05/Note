
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import { useToast } from "../ToastContext";

function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // REGISTER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      username,
      email,
      password,
      confirmPassword,
    } = user;

    // =========================
    // EMPTY FIELD VALIDATION
    // =========================
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      showToast(
        "Please fill all fields",
        "error"
      );
      return;
    }

    // =========================
    // PASSWORD VALIDATION
    // =========================
    if (password !== confirmPassword) {
      showToast(
        "Passwords do not match",
        "error"
      );
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/register/`,
        {
          username: username,
          email: email,
          password: password,
        }
      );

      console.log(
        "Registration response:",
        response.data
      );

      // =========================
      // SUCCESS POPUP
      // =========================
      showToast(
        "Registration successful!",
        "success"
      );

      // Wait so user can see popup
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error
      );

      if (error.response) {
        const data = error.response.data;

        showToast(
          data.message ||
            data.detail ||
            "Registration failed",
          "error"
        );
      } else {
        showToast(
          "Cannot connect to backend",
          "error"
        );
      }
    }
  };

  return (
    <div className="register-container">

      <div className="register-box">

        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={user.username}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={user.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit">
            Register
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;

