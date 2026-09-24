import React, { useState } from "react";
import Layout from "../components/Layout";
import { Mic, ArrowRight } from "lucide-react";

const TYPES = [
  { value: "technical", label: "Technical", desc: "DSA · System Design · CS Fundamentals" },
  { value: "hr",        label: "HR",        desc: "Behavioural · Soft Skills · Culture Fit" },
];
const DIFFICULTIES = ["easy", "medium", "hard"];

const MockInterview = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [type, setType] = useState("technical");
  const [difficulty, setDifficulty] = useState("medium");
  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    try {
      setLoading(true); setMessage("");
      const res = await fetch(`${BASE_URL}/interviews/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ type, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.message); return; }
      setInterview(data.interview); setCurrentQuestion(0); setAnswer("");
    } catch { setMessage("Could not start interview"); } finally { setLoading(false); }
  };

  const nextQuestion = async () => {
    if (!answer.trim()) { setMessage("Please write your answer first"); return; }
    try {
      setLoading(true); setMessage("");
      const res = await fetch(`${BASE_URL}/interviews/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ interviewId: interview._id, questionIndex: currentQuestion, answer }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.message); return; }
      if (currentQuestion < interview.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1); setAnswer("");
      } else {
        window.location.href = `/interview-result/${interview._id}`;
      }
    } catch { setMessage("Could not submit answer"); } finally { setLoading(false); }
  };

  /* ── Setup screen ── */
  if (!interview) {
    return (
      <Layout title="Mock Interview" subtitle="AI-powered interview practice">
        <div className="max-w-lg mx-auto py-4">
          <p className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider mb-6">Configure session</p>

          {/* Type */}
          <div className="mb-6">
            <p className="text-[13px] font-medium text-neutral-600 mb-2">Interview type</p>
            <div className="grid grid-cols-2 gap-2.5">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`rounded-xl border p-4 text-left transition ${
                    type === t.value
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  <p className="text-[14px] font-semibold">{t.label}</p>
                  <p className={`text-[12px] mt-0.5 leading-snug ${type === t.value ? "text-neutral-400" : "text-neutral-400"}`}>{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-8">
            <p className="text-[13px] font-medium text-neutral-600 mb-2">Difficulty</p>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 rounded-lg border py-2.5 text-[13px] font-medium capitalize transition ${
                    difficulty === d
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {message && (
            <p className="mb-4 rounded-lg bg-red-50 border border-red-100 px-3.5 py-2.5 text-[13px] text-red-600">{message}</p>
          )}

          <button
            onClick={startInterview}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-[14px] font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50 shadow-xs"
          >
            {loading ? "Generating questions…" : <>Start Interview <ArrowRight size={15} /></>}
          </button>
        </div>
      </Layout>
    );
  }

  /* ── Interview screen ── */
  const question = interview.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / interview.questions.length) * 100;

  return (
    <Layout title="Mock Interview" subtitle={`${interview.type} · ${interview.difficulty}`}>
      <div className="max-w-2xl mx-auto space-y-5 py-2">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-[12px] text-neutral-400 mb-1.5">
            <span>Question {currentQuestion + 1} of {interview.questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
            <div className="h-full rounded-full bg-neutral-900 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-xl border border-neutral-200 bg-white px-5 py-6 sm:px-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-600 uppercase">
              Q{currentQuestion + 1}
            </span>
            <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-600 capitalize">
              {interview.difficulty}
            </span>
          </div>
          <p className="text-[15px] sm:text-[16px] text-neutral-900 leading-relaxed font-medium">{question.question}</p>
        </div>

        {/* Answer Box */}
        <div className="rounded-xl border border-neutral-200 bg-white px-5 py-5 sm:px-6">
          <label className="block text-[12px] font-medium text-neutral-500 mb-2">Your answer</label>
          <textarea
            rows={9}
            placeholder="Write your answer here — be detailed, structured, and clear."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full resize-none rounded-lg bg-neutral-50 border border-neutral-200 px-4 py-3 text-[14px] text-neutral-800 outline-none transition focus:border-neutral-400 focus:bg-white placeholder:text-neutral-300 leading-relaxed"
          />
        </div>

        {message && (
          <p className="rounded-lg bg-red-50 border border-red-100 px-3.5 py-2.5 text-[13px] text-red-600">{message}</p>
        )}

        <button
          onClick={nextQuestion}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-[14px] font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50 shadow-xs"
        >
          {loading
            ? "Evaluating response…"
            : currentQuestion === interview.questions.length - 1
            ? "Finish & Evaluate Interview"
            : <>Next Question <ArrowRight size={15} /></>}
        </button>
      </div>
    </Layout>
  );
};

export default MockInterview;
