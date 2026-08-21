import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Default Route */}
      <Route
        path="/"
        element={
          token ? <Navigate to="/home" /> : <Navigate to="/login" />
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          token ? <Navigate to="/home" /> : <Register />
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          token ? <Navigate to="/home" /> : <Login />
        }
      />

      {/* Protected Home Route */}
      <Route
        path="/home"
        element={
          token ? <Home /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

export default App;