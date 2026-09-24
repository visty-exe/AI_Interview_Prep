import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const Register = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message); return; }
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2200);
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
            Start your journey<br />to your dream role.
          </h2>
          <p className="mt-4 text-neutral-400 text-[15px] leading-relaxed max-w-xs">
            Create a free account and get instant access to all AI interview tools.
          </p>

          <ul className="mt-10 space-y-3.5">
            {[
              "AI Mock Interviews — Technical & HR",
              "Coding problems with instant AI evaluation",
              "Skill gap detection vs your target role",
              "Personalised phase-by-phase learning roadmap",
              "Resume parsing and AI feedback",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[14px] text-neutral-400">
                <CheckCircle2 size={14} strokeWidth={1.8} className="text-neutral-500 mt-0.5 shrink-0" />
                {f}
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

          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Create an account</h2>
          <p className="mt-1 text-[14px] text-neutral-400">Free forever. No credit card required.</p>

          {success ? (
            <div className="mt-8 rounded-xl border border-green-100 bg-green-50 p-6 text-center">
              <CheckCircle2 size={32} strokeWidth={1.5} className="text-green-600 mx-auto mb-3" />
              <p className="font-semibold text-green-800 text-[15px]">Account created!</p>
              <p className="text-[13px] text-green-600 mt-1">Redirecting you to sign in…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-neutral-600 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Vishal Tyagi"
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] text-neutral-800 outline-none transition placeholder:text-neutral-300 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
                />
              </div>

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
                  placeholder="Min. 8 characters"
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
                {loading ? "Creating account…" : <>Create Account <ArrowRight size={14} /></>}
              </button>
            </form>
          )}

          <p className="mt-7 text-[13px] text-neutral-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-neutral-900 underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
