import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import MockInterview from "./pages/MockInterview.jsx";
import InterviewResult from "./pages/InterviewResult.jsx";
import CodingInterview from "./pages/CodingInterview.jsx";
import CodingHistory from "./pages/CodingHistory.jsx";
import SkillGap from "./pages/SkillGap.jsx";
import CodingPerformance from "./pages/CodingPerformance.jsx";
import LearningRoadmap from "./pages/LearningRoadmap.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import { Mic, Code2, Target, Map, ArrowRight } from "lucide-react";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-[#f5f5f0] text-neutral-900 flex flex-col justify-between px-6 py-10 md:px-12">
              <header className="flex items-center justify-between max-w-6xl mx-auto w-full">
                <span className="text-[15px] font-bold tracking-tight text-neutral-900">InterviewPrep</span>
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-[13px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors px-3 py-1.5"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-neutral-700"
                  >
                    Get Started
                  </Link>
                </div>
              </header>

              <main className="max-w-4xl mx-auto w-full py-16 text-center">
                <span className="inline-block rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-6">
                  Intelligent Career Preparation
                </span>

                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.1]">
                  Interview preparation, engineered for precision.
                </h1>

                <p className="mt-5 text-[16px] text-neutral-500 max-w-xl mx-auto leading-relaxed">
                  Real-time technical and behavioural mock interviews, automated code evaluations,
                  curriculum gap discovery, and personalised mastery roadmaps.
                </p>

                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <Link
                    to="/register"
                    className="flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-neutral-700"
                  >
                    Create Free Account <ArrowRight size={15} />
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-xl border border-neutral-200 bg-white px-6 py-3.5 text-[14px] font-medium text-neutral-800 transition hover:bg-neutral-50 shadow-sm"
                  >
                    Sign In
                  </Link>
                </div>

                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                  {[
                    { icon: Mic, title: "Mock Interviews", desc: "Adaptive technical & HR prompts with immediate evaluation" },
                    { icon: Code2, title: "Algorithmic Challenges", desc: "In-browser Java compilation, complexity analysis & feedback" },
                    { icon: Target, title: "Skill Gap Audits", desc: "Benchmark competencies against role target standards" },
                    { icon: Map, title: "Learning Curriculum", desc: "Step-by-step phased study schedules customized for you" },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="rounded-xl border border-neutral-200 bg-white p-5">
                      <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center mb-3">
                        <Icon size={16} className="text-neutral-900" />
                      </div>
                      <p className="text-[14px] font-semibold text-neutral-900">{title}</p>
                      <p className="text-[12px] text-neutral-500 mt-1 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </main>

              <footer className="max-w-6xl mx-auto w-full text-center text-[12px] text-neutral-400">
                © 2024 InterviewPrep · Crafted for career readiness.
              </footer>
            </div>
          }
        />
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

        <Route
          path="/coding-history"
          element={
            <ProtectedRoutes>
              <CodingHistory />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/coding-performance"
          element={
            <ProtectedRoutes>
              <CodingPerformance />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/skill-gap"
          element={
            <ProtectedRoutes>
              <SkillGap />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/learning-roadmap"
          element={
            <ProtectedRoutes>
              <LearningRoadmap />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
