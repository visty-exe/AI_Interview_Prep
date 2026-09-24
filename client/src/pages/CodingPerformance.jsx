import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import Layout from "../components/Layout";
import { BarChart2, Activity, Award, CheckCircle2, ArrowRight } from "lucide-react";

const CodingPerformance = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      setMessage("");
      const response = await fetch(`${BASE_URL}/coding/performance`, {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message); return; }
      setPerformance(data);
    } catch {
      setMessage("Could not fetch performance metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPerformance(); }, []);

  if (loading) {
    return (
      <Layout title="Coding Performance">
        <div className="flex items-center justify-center py-24">
          <p className="text-[13px] text-neutral-400">Loading metrics…</p>
        </div>
      </Layout>
    );
  }

  if (message) {
    return (
      <Layout title="Coding Performance">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <p className="text-[13px] text-neutral-600">{message}</p>
        </div>
      </Layout>
    );
  }

  const statCards = [
    { label: "Total Submissions", value: performance.totalAttempts, sub: "coding runs" },
    { label: "Average Score", value: `${performance.averageScore}/10`, sub: "overall average" },
    { label: "Highest Score", value: `${performance.highestScore}/10`, sub: "top evaluation" },
    { label: "Easy Solved", value: performance.easyAttempts, sub: "foundation tier" },
    { label: "Med / Hard", value: `${performance.mediumAttempts} / ${performance.hardAttempts}`, sub: "advanced tier" },
  ];

  return (
    <Layout title="Coding Performance" subtitle="Algorithmic problem-solving progression">
      <div className="space-y-6">

        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">{s.label}</p>
              <p className="text-2xl font-bold tracking-tight text-neutral-900 mt-2">{s.value}</p>
              <p className="text-[12px] text-neutral-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Difficulty Distribution */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-neutral-800">Difficulty Distribution</h3>
            <span className="text-[12px] text-neutral-400">{performance.totalAttempts} total attempts</span>
          </div>

          {[
            { label: "Easy", count: performance.easyAttempts },
            { label: "Medium", count: performance.mediumAttempts },
            { label: "Hard", count: performance.hardAttempts },
          ].map((tier) => {
            const pct = performance.totalAttempts > 0 ? (tier.count / performance.totalAttempts) * 100 : 0;
            return (
              <div key={tier.label} className="space-y-1.5">
                <div className="flex justify-between text-[12px]">
                  <span className="font-medium text-neutral-700">{tier.label}</span>
                  <span className="text-neutral-400">{tier.count} ({Math.round(pct)}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-neutral-900 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Score Graph */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
          <div>
            <h3 className="text-[14px] font-semibold text-neutral-800">Evaluation History</h3>
            <p className="text-[12px] text-neutral-400">Score per chronological submission attempt</p>
          </div>

          {performance.scoreTrend.length === 0 ? (
            <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-neutral-200 text-center">
              <p className="text-[13px] text-neutral-400">No evaluated coding attempts recorded.</p>
            </div>
          ) : (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performance.scoreTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="interview" tick={{ fontSize: 11, fill: "#737373" }} stroke="#d4d4d4" />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#737373" }} stroke="#d4d4d4" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#171717",
                      borderRadius: 8,
                      border: "none",
                      color: "#fff",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#171717"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#171717" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => (window.location.href = "/coding-interview")}
            className="flex-1 rounded-xl bg-neutral-900 py-3 text-[13px] font-semibold text-white transition hover:bg-neutral-700"
          >
            Launch Coding Interview
          </button>
          <button
            onClick={() => (window.location.href = "/coding-history")}
            className="flex-1 rounded-xl border border-neutral-200 bg-white py-3 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            Full Attempt History
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default CodingPerformance;
