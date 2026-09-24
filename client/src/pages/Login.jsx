import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Mic, Code2, Target, Map } from "lucide-react";

const Login = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message); return; }
      login(data);
      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f0]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[44%] flex-col justify-between bg-neutral-900 p-12 text-white">
        <span className="text-[15px] font-bold tracking-tight">InterviewPrep</span>

        <div>
          <h2 className="text-4xl font-bold leading-[1.15] tracking-tight">
            Prepare smarter.<br />Land the offer.
          </h2>
          <p className="mt-4 text-neutral-400 text-[15px] leading-relaxed max-w-xs">
            AI mock interviews, coding practice, skill gap analysis — everything you need in one place.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              { icon: Mic,    text: "Mock Interviews (Technical & HR)" },
              { icon: Code2,  text: "Coding Practice with AI Feedback" },
              { icon: Target, text: "Skill Gap Analysis" },
              { icon: Map,    text: "Personalised Learning Roadmap" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[14px] text-neutral-400">
                <Icon size={14} strokeWidth={1.8} className="text-neutral-500 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-neutral-600 text-xs">© 2024 InterviewPrep</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <span className="text-[15px] font-bold tracking-tight text-neutral-900">InterviewPrep</span>
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Welcome back</h2>
          <p className="mt-1 text-[14px] text-neutral-400">Sign in to continue your preparation.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-neutral-600 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="you@example.com"
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] text-neutral-800 outline-none transition placeholder:text-neutral-300 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-neutral-600 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="••••••••"
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] text-neutral-800 outline-none transition placeholder:text-neutral-300 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
              />
            </div>

            {message && (
              <p className="rounded-lg bg-red-50 border border-red-100 px-3.5 py-2.5 text-[13px] text-red-600">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
            >
              {loading ? "Signing in…" : <>Sign In <ArrowRight size={14} /></>}
            </button>
          </form>

          <p className="mt-7 text-[13px] text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-neutral-900 underline underline-offset-2">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
