import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      });
      onLogin(response.data.token); // Pass token to parent component for storage
      setError(null);
      navigate("/");
    } catch (error) {
      setError(error.response.data.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... email and password input fields ... */}
      <label>
        Email:{" "}
        <input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </label>
      <br />
      <br />
      <label>
        Password:{" "}
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
