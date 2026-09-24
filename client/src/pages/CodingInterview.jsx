import React, { useState } from "react";
import Layout from "../components/Layout";
import { Code2, ArrowRight, AlertCircle } from "lucide-react";

const DIFFICULTIES = ["easy", "medium", "hard"];

const CodingInterview = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [difficulty, setDifficulty] = useState("medium");
  const [codingInterview, setCodingInterview] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [evaluation, setEvaluation] = useState(null);

  const startCodingInterview = async () => {
    try {
      setLoading(true); setMessage("");
      const res = await fetch(`${BASE_URL}/coding/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ difficulty }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.message); return; }
      setCodingInterview(data.codingInterview); setCode("");
    } catch { setMessage("Could not start coding interview"); } finally { setLoading(false); }
  };

  const handleSubmitCode = async () => {
    try {
      setLoading(true); setMessage("");
      const res = await fetch(`${BASE_URL}/coding/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ codingInterviewId: codingInterview._id, code }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.message); return; }
      setEvaluation(data.evaluation);
    } catch { setMessage("Could not evaluate code"); } finally { setLoading(false); }
  };

  /* ── Setup screen ── */
  if (!codingInterview) {
    return (
      <Layout title="Coding Interview" subtitle="AI-generated problem, instant evaluation">
        <div className="max-w-lg mx-auto py-4">
          <p className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider mb-6">Configure session</p>

          <div className="mb-8">
            <p className="text-[13px] font-medium text-neutral-600 mb-2">Select Difficulty</p>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 rounded-lg border py-3 text-[13px] font-medium capitalize transition ${
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
            onClick={startCodingInterview}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-[14px] font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50 shadow-xs"
          >
            {loading ? "Generating problem…" : <>Start Coding Interview <ArrowRight size={15} /></>}
          </button>
        </div>
      </Layout>
    );
  }

  const question = codingInterview.question;

  return (
    <Layout title="Coding Interview" subtitle={`${difficulty} · Java`}>
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr] max-w-6xl mx-auto">

        {/* ── Left: Problem ── */}
        <div className="space-y-4">
          {/* Problem statement */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-600 uppercase">{difficulty}</span>
              <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">Java</span>
            </div>
            <h2 className="text-[16px] sm:text-[17px] font-bold text-neutral-900 mb-2">{question.title}</h2>
            <p className="text-[14px] text-neutral-600 leading-relaxed">{question.description}</p>
          </div>

          {/* I/O + Constraints */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 space-y-4">
            {[
              { label: "Input",       value: question.input },
              { label: "Output",      value: question.output },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">{s.label}</p>
                <p className="text-[13px] text-neutral-700 font-mono bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-2">{s.value}</p>
              </div>
            ))}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Constraints</p>
              <ul className="space-y-1">
                {question.constraints.map((c, i) => (
                  <li key={i} className="flex gap-2 text-[13px] text-neutral-600 font-mono">
                    <span className="text-neutral-300 shrink-0">–</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Evaluation */}
          {evaluation && (
            <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold text-neutral-800">Evaluation Result</p>
                <span className={`rounded-full border px-3 py-0.5 text-[13px] font-bold ${
                  evaluation.score >= 7
                    ? "border-green-200 bg-green-50 text-green-700"
                    : evaluation.score >= 4
                    ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}>
                  {evaluation.score} / 10
                </span>
              </div>
              <p className="text-[14px] text-neutral-600 leading-relaxed">{evaluation.feedback}</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Correctness", value: evaluation.correctness },
                  { label: "Time",        value: evaluation.timeComplexity },
                  { label: "Space",       value: evaluation.spaceComplexity },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg bg-neutral-50 border border-neutral-100 px-3 py-2.5 text-center">
                    <p className="text-[11px] text-neutral-400 mb-0.5">{m.label}</p>
                    <p className="text-[13px] font-semibold text-neutral-800">{m.value}</p>
                  </div>
                ))}
              </div>
              {evaluation.improvements?.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">Improvements</p>
                  <ul className="space-y-1.5">
                    {evaluation.improvements.map((imp, i) => (
                      <li key={i} className="flex gap-2 text-[13px] text-neutral-600">
                        <span className="text-neutral-300 shrink-0">–</span>{imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: Editor ── */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-xl border border-neutral-200 overflow-hidden flex flex-col min-h-[420px]">
            <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Code2 size={13} strokeWidth={1.8} className="text-neutral-400" />
                <span className="text-[12px] font-medium text-neutral-400">Solution.java</span>
              </div>
              <button
                onClick={() => setCode("")}
                className="text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              rows={22}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={"// Write your Java solution here...\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}"}
              spellCheck={false}
              className="flex-1 resize-none bg-neutral-950 px-5 py-4 font-mono text-[13px] text-neutral-100 outline-none placeholder:text-neutral-700 leading-relaxed"
            />
          </div>

          {message && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-3.5 py-2.5 text-[13px] text-red-600">
              <AlertCircle size={13} strokeWidth={1.8} className="shrink-0" />
              {message}
            </div>
          )}

          <button
            onClick={handleSubmitCode}
            disabled={loading || !code.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-[14px] font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50 shadow-xs"
          >
            {loading ? "Evaluating…" : <>Submit Code <ArrowRight size={15} /></>}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CodingInterview;
