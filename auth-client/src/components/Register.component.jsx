import React, { useState } from "react";
import axios from "axios";
import { redirect } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/register", {
        email,
        password: password,
      });
      setError(null);
      redirect("/login");
    } catch (error) {
      setError(error.response.data.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... email, password, and confirm password input fields ... */}
      <label>
        Email:{" "}
        <input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </label>
      <label>
        Password:{" "}
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </label>
      <label>
        Confirm Password:{" "}
        <input
          type="password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
