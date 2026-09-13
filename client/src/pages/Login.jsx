import React from "react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Login = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      login(data);
      setMessage("Login Successful!");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  };
  return (
    <>
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter your Email"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Enter your password"
            onChange={handleChange}
          />

          <button type="submit">Login</button>
        </form>
        <p>{message}</p>
      </div>
    </>
  );
};

export default Login;
