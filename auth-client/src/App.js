import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.component";
import Register from "./components/Register.component";
import Home from "./components/Home.component";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import Home from "./components/Home";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setIsLoggedIn(true);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <Routes>
        <Route path="api/login" />
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <p>You are already logged in!</p>
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Home onLogout={handleLogout} />
            ) : (
              <p>Please log in to access this page.</p>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
