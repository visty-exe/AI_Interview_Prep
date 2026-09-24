import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { ArrowLeft, RotateCcw } from "lucide-react";

const InterviewResult = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`${BASE_URL}/interviews/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        if (response.ok) setInterview(data.interview);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <Layout title="Interview Result">
        <div className="flex items-center justify-center py-24">
          <p className="text-[13px] text-neutral-400">Loading interview evaluation…</p>
        </div>
      </Layout>
    );
  }

  if (!interview) {
    return (
      <Layout title="Interview Result">
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-neutral-800">Result not found</h2>
            <p className="text-neutral-400 text-sm mt-1">This session record could not be loaded.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const score = interview.overallScore;

  return (
    <Layout title="Interview Evaluation" subtitle={`${interview.type} · ${interview.targetRole}`}>
      <div className="max-w-3xl mx-auto space-y-6 py-2">

        {/* Score banner */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Overall Score</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-bold tracking-tight text-neutral-900">{score.toFixed(1)}</span>
                <span className="text-[14px] text-neutral-400">/ 10</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[12px]">
              <span className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1 font-medium text-neutral-700">
                {interview.targetRole}
              </span>
              <span className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1 font-medium text-neutral-700 capitalize">
                {interview.type}
              </span>
              <span className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1 font-medium text-neutral-700 capitalize">
                {interview.difficulty}
              </span>
            </div>
          </div>

          <div className="mt-5 h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-neutral-900 transition-all duration-300"
              style={{ width: `${Math.min(score * 10, 100)}%` }}
            />
          </div>
        </div>

        {/* Question breakdown */}
        <div className="space-y-4">
          <p className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Question Analysis</p>
          {interview.questions.map((q, index) => (
            <div key={index} className="rounded-xl border border-neutral-200 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-600 uppercase">
                  Q{index + 1}
                </span>
                <span className="text-[13px] font-semibold text-neutral-900">
                  {q.score} <span className="text-neutral-400 font-normal">/ 10</span>
                </span>
              </div>

              <p className="text-[14px] font-medium text-neutral-800 leading-relaxed">{q.questions}</p>

              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Your response</p>
                  <p className="text-[13px] text-neutral-700 bg-neutral-50 border border-neutral-100 rounded-lg p-3 leading-relaxed">
                    {q.answer || "No response submitted."}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">AI assessment</p>
                  <p className="text-[13px] text-neutral-600 leading-relaxed bg-white border border-neutral-200 rounded-lg p-3">
                    {q.feedback}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => (window.location.href = "/mock-interview")}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-[13px] font-semibold text-white transition hover:bg-neutral-700"
          >
            <RotateCcw size={14} /> New Interview
          </button>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-3 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default InterviewResult;