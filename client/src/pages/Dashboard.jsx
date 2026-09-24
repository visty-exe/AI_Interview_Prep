import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import {
  Mic, Code2, Target, BarChart2, Map,
  FileText, ArrowRight, TrendingUp, Award, Activity, Upload,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [name, setName] = useState(user?.name || "");
  const [targetRole, setTargetRole] = useState(user?.targetRole || "");
  const [skills, setSkills] = useState(user?.skills?.join(",") || "");
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeMessage, setResumeMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const totalInterviews = interviews.length;
  const averageScore =
    totalInterviews > 0
      ? interviews.reduce((t, iv) => t + iv.overallScore, 0) / totalInterviews
      : 0;
  const highestScore =
    totalInterviews > 0
      ? Math.max(...interviews.map((iv) => iv.overallScore))
      : 0;
  const scoreTrend = [...interviews].reverse().map((iv, i) => ({
    interview: i + 1,
    score: iv.overallScore,
  }));

  useEffect(() => {
    if (user?.role === "admin") {
      window.location.replace("/admin");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/profile`, {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) setAnalysis(data.user.resumeAnalysis);
      } catch (e) { console.error(e); }
    };
    const fetchInterviews = async () => {
      try {
        const res = await fetch(`${BASE_URL}/interviews`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) setInterviews(data.interviews);
      } catch (e) { console.error(e); } finally { setHistoryLoading(false); }
    };
    fetchProfile();
    fetchInterviews();
  }, [BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          targetRole,
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.message); return; }
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Saved.");
    } catch { setMessage("Something went wrong"); }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resume) { setResumeMessage("Please select a PDF"); return; }
    const formData = new FormData();
    formData.append("resume", resume);
    try {
      const res = await fetch(`${BASE_URL}/users/resume`, {
        method: "POST",
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) { setResumeMessage(data.message); return; }
      setAnalysis(data.analysis);
      setResumeMessage("Resume analysed.");
    } catch { setResumeMessage("Something went wrong"); }
  };

  const goTo = (path) => { window.location.href = path; };

  const statCards = [
    { label: "Interviews", value: totalInterviews, sub: "completed", icon: Mic },
    { label: "Avg Score", value: `${averageScore.toFixed(1)}/10`, sub: "all time", icon: Activity },
    { label: "Best Score", value: `${highestScore.toFixed(1)}/10`, sub: "personal best", icon: Award },
    { label: "Resume", value: `${analysis?.score || 0}/100`, sub: "AI score", icon: FileText },
  ];

  const quickActions = [
    { icon: Mic,    label: "Mock Interview",    desc: "Technical & HR with AI", cta: "Start", path: "/mock-interview" },
    { icon: Code2,  label: "Coding Interview",  desc: "AI-generated problems",   cta: "Practice", path: "/coding-interview" },
    { icon: Target, label: "Skill Gap",         desc: "Analyse your readiness",  cta: "Analyse", path: "/skill-gap" },
    { icon: Map,    label: "Learning Roadmap",  desc: "Personalised study plan", cta: "View", path: "/learning-roadmap" },
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">

        {/* ── GREETING ── */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Good to see you, {user?.name?.split(" ")[0] || "there"}.
          </h2>
          <p className="text-[14px] text-neutral-400">
            {totalInterviews === 0
              ? "Start your first interview to track your progress."
              : `You've completed ${totalInterviews} interview${totalInterviews > 1 ? "s" : ""} · avg score ${averageScore.toFixed(1)}/10`}
          </p>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {statCards.map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-white border border-neutral-200 px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider">{label}</span>
                <Icon size={14} strokeWidth={1.8} className="text-neutral-300" />
              </div>
              <p className="text-2xl font-bold text-neutral-900 tracking-tight">{value}</p>
              <p className="text-[12px] text-neutral-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div>
          <p className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {quickActions.map(({ icon: Icon, label, desc, cta, path }) => (
              <button
                key={label}
                onClick={() => goTo(path)}
                className="group flex flex-col items-start rounded-xl border border-neutral-200 bg-white px-4 py-4 text-left transition hover:border-neutral-900 hover:shadow-sm"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 group-hover:bg-neutral-900 transition-colors">
                  <Icon size={15} strokeWidth={1.8} className="text-neutral-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-[14px] font-semibold text-neutral-800">{label}</p>
                <p className="text-[12px] text-neutral-400 mt-0.5 leading-relaxed">{desc}</p>
                <span className="mt-3 flex items-center gap-1 text-[12px] font-medium text-neutral-400 group-hover:text-neutral-900 transition-colors">
                  {cta} <ArrowRight size={11} />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── PERFORMANCE + PROFILE ── */}
        <div className="grid gap-6 xl:grid-cols-2">

          {/* Score trend */}
          <div className="rounded-xl border border-neutral-200 bg-white px-5 py-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[14px] font-semibold text-neutral-800">Interview Scores</p>
                <p className="text-[12px] text-neutral-400 mt-0.5">Recent history</p>
              </div>
              <button onClick={() => goTo("/coding-performance")} className="flex items-center gap-1 text-[12px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors">
                Details <ArrowRight size={11} />
              </button>
            </div>

            {scoreTrend.length === 0 ? (
              <div className="flex h-36 items-center justify-center rounded-lg bg-neutral-50 border border-dashed border-neutral-200">
                <div className="text-center">
                  <TrendingUp size={20} strokeWidth={1.5} className="text-neutral-300 mx-auto mb-2" />
                  <p className="text-[13px] text-neutral-400">No data yet</p>
                  <button onClick={() => goTo("/mock-interview")} className="mt-1 text-[12px] font-medium text-neutral-600 underline underline-offset-2">
                    Take your first interview
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {scoreTrend.map((item) => (
                  <div key={item.interview}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-neutral-400">Interview {item.interview}</span>
                      <span className="font-semibold text-neutral-700">{item.score.toFixed(1)}/10</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-neutral-900 transition-all"
                        style={{ width: `${Math.min(item.score * 10, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="rounded-xl border border-neutral-200 bg-white px-5 py-5">
            <p className="text-[14px] font-semibold text-neutral-800 mb-1">Profile</p>
            <p className="text-[12px] text-neutral-400 mb-5">Better profile → better AI questions</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { label: "Name", value: name, onChange: setName, placeholder: "Your name" },
                { label: "Target Role", value: targetRole, onChange: setTargetRole, placeholder: "e.g. Backend Developer" },
                { label: "Skills (comma-separated)", value: skills, onChange: setSkills, placeholder: "Java, React, SQL" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-[12px] font-medium text-neutral-500 mb-1">{f.label}</label>
                  <input
                    type="text"
                    value={f.value}
                    placeholder={f.placeholder}
                    onChange={(e) => f.onChange(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-neutral-800 outline-none transition focus:border-neutral-400 focus:bg-white"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full rounded-lg bg-neutral-900 py-2 text-[13px] font-medium text-white transition hover:bg-neutral-700"
              >
                Save Changes
              </button>
              {message && (
                <p className="text-center text-[12px] text-neutral-500">{message}</p>
              )}
            </form>
          </div>
        </div>

        {/* ── RESUME UPLOAD ── */}
        <div className="rounded-xl border border-neutral-200 bg-white px-5 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[14px] font-semibold text-neutral-800">Resume Analysis</p>
              <p className="text-[12px] text-neutral-400 mt-0.5">Upload your PDF — AI will parse and score it</p>
            </div>
            {analysis && (
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[12px] font-semibold text-neutral-700">
                {analysis.score}/100
              </span>
            )}
          </div>

          <form onSubmit={handleResumeUpload} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="block text-[12px] font-medium text-neutral-500 mb-1.5">PDF file</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files[0])}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-neutral-600 outline-none file:mr-3 file:rounded file:border-0 file:bg-neutral-200 file:px-2.5 file:py-1 file:text-[12px] file:font-medium file:text-neutral-700"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-900 hover:text-white hover:border-neutral-900"
            >
              <Upload size={13} strokeWidth={1.8} />
              Analyse
            </button>
          </form>

          {resumeMessage && (
            <p className="mt-2 text-[12px] text-neutral-500">{resumeMessage}</p>
          )}

          {analysis && (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 border-t border-neutral-100 pt-5">
              {[
                { label: "Skills", items: analysis.skills },
                { label: "Strengths", items: analysis.strengths },
                { label: "Weaknesses", items: analysis.weaknesses },
                { label: "Suggestions", items: analysis.suggestions },
              ].map((section) => (
                <div key={section.label}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">{section.label}</p>
                  <ul className="space-y-1">
                    {(section.items || []).map((item, i) => (
                      <li key={i} className="text-[13px] text-neutral-600 leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RECENT INTERVIEWS ── */}
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <div>
              <p className="text-[14px] font-semibold text-neutral-800">Recent Interviews</p>
              <p className="text-[12px] text-neutral-400 mt-0.5">Your last 5 sessions</p>
            </div>
            <button onClick={() => goTo("/coding-performance")} className="flex items-center gap-1 text-[12px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors">
              All <ArrowRight size={11} />
            </button>
          </div>

          {historyLoading ? (
            <p className="px-5 py-6 text-[13px] text-neutral-400">Loading…</p>
          ) : interviews.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Mic size={24} strokeWidth={1.5} className="text-neutral-200 mx-auto mb-3" />
              <p className="text-[13px] text-neutral-400">No interviews yet</p>
              <button onClick={() => goTo("/mock-interview")} className="mt-2 text-[13px] font-medium text-neutral-600 underline underline-offset-2">
                Start your first
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {interviews.slice(0, 5).map((iv) => (
                <div key={iv._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
                      {iv.type === "coding"
                        ? <Code2 size={14} strokeWidth={1.8} className="text-neutral-500" />
                        : <Mic size={14} strokeWidth={1.8} className="text-neutral-500" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-neutral-800 capitalize">{iv.type} Interview</p>
                      <p className="text-[11px] text-neutral-400">{iv.targetRole} · {iv.difficulty} · {new Date(iv.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] font-semibold text-neutral-700">{iv.overallScore.toFixed(1)}<span className="text-neutral-400 font-normal">/10</span></span>
                    <button
                      onClick={() => goTo(`/interview-result/${iv._id}`)}
                      className="flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-[12px] font-medium text-neutral-600 transition hover:border-neutral-400"
                    >
                      View <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
