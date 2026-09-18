import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MockInterview from "./pages/MockInterview.jsx";
import InterviewResult from "./pages/InterviewResult.jsx";
import CodingInterview from "./pages/CodingInterview.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<h1>AI Placement Platform</h1>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/mock-interview"
          element={
            <ProtectedRoutes>
              <MockInterview />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/interview-result/:id"
          element={
            <ProtectedRoutes>
              <InterviewResult />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/coding-interview"
          element={
            <ProtectedRoutes>
              <CodingInterview />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
