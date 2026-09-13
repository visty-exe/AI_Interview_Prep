import React from "react";
import { useState } from "react";

const Register = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
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

      setMessage("Registration successful!");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  };
  return (
    <>
      <div>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />

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
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">Register</button>
        </form>

        <p>{message}</p>
      </div>
    </>
  );
};

export default Register;
