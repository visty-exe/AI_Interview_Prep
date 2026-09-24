import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Map, RefreshCw, CheckCircle2, Clock } from "lucide-react";

const LearningRoadmap = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const fetchRoadmap = async () => {
    try {
      const response = await fetch(`${BASE_URL}/roadmap`, {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message); return; }
      setRoadmap(data.roadmap);
    } catch {
      setMessage("Could not fetch roadmap");
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmap = async () => {
    try {
      setGenerating(true);
      setMessage("");
      const response = await fetch(`${BASE_URL}/roadmap/generate`, {
        method: "POST",
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message); return; }
      setRoadmap(data.roadmap);
      setMessage("Roadmap updated.");
    } catch {
      setMessage("Could not generate roadmap");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => { fetchRoadmap(); }, []);

  if (loading) {
    return (
      <Layout title="Learning Roadmap">
        <div className="flex items-center justify-center py-24">
          <p className="text-[13px] text-neutral-400">Loading syllabus roadmap…</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Learning Roadmap" subtitle="Phase-by-phase placement syllabus">
      <div className="space-y-6 max-w-5xl mx-auto py-2">

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-6">
          <div>
            <span className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Target Objective</span>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 mt-1">
              {roadmap?.targetRole || "Software Engineering"}
            </h2>
            <p className="text-[13px] text-neutral-400 mt-0.5">
              Structured preparation schedule organized by sequential mastery phases.
            </p>
          </div>

          <button
            onClick={generateRoadmap}
            disabled={generating}
            className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 shrink-0"
          >
            <RefreshCw size={13} className={generating ? "animate-spin" : ""} />
            {generating ? "Regenerating…" : "Regenerate Plan"}
          </button>
        </div>

        {message && (
          <p className="rounded-lg bg-neutral-100 border border-neutral-200 px-3.5 py-2.5 text-[13px] text-neutral-700">
            {message}
          </p>
        )}

        {!roadmap ? (
          <div className="rounded-xl border border-dashed border-neutral-200 p-12 text-center">
            <Map size={24} strokeWidth={1.5} className="text-neutral-300 mx-auto mb-2" />
            <p className="text-[14px] font-medium text-neutral-700">No roadmap generated yet</p>
            <p className="text-[12px] text-neutral-400 mt-1">Generate a curriculum tailored to your target position.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {roadmap.roadmap.map((phase) => (
              <div key={phase._id} className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white text-[12px] font-bold">
                      {phase.phase}
                    </span>
                    <h3 className="text-[15px] font-bold text-neutral-900">{phase.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-[12px]">
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Clock size={12} /> {phase.estimatedTime}
                    </span>
                    <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold uppercase text-neutral-600">
                      {phase.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 pt-1">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">Focus Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.skills.map((skill, i) => (
                        <span key={i} className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[12px] font-medium text-neutral-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">Key Topics</p>
                    <ul className="space-y-1.5">
                      {phase.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-neutral-600">
                          <CheckCircle2 size={13} className="text-neutral-400 mt-0.5 shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default LearningRoadmap;
