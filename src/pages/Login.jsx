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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login/`,
        {
          username: username,
          password: password,
        }
      );

      console.log(response.data.access);

      alert("Login Successful");

      // Optional: save token if backend sends one
      if (response.data.access) {
        localStorage.setItem("token", response.data.access);
      }

      // Optional: save username
      if (response.data.username) {
        localStorage.setItem("username", response.data.username);
      }

      navigate("/Home");

    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Invalid email or password"
        );
      } else {
        alert("Cannot connect to backend");
      }
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

          <button type="submit">
            Login
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