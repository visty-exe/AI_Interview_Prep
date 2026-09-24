import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Target, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Lightbulb, ArrowRight } from "lucide-react";

const SkillGap = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [generating, setGenerating] = useState(false);

  const fetchSkillGap = async () => {
    try {
      const response = await fetch(`${BASE_URL}/skill-gap`, {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message); return; }
      setSkillGap(data.skillGap);
    } catch {
      setMessage("Could not fetch skill gap");
    } finally {
      setLoading(false);
    }
  };

  const generateSkillGap = async () => {
    try {
      setGenerating(true);
      setMessage("");
      const response = await fetch(`${BASE_URL}/skill-gap/generate`, {
        method: "POST",
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message); return; }
      setSkillGap(data.skillGap);
      setMessage("Skill gap analysis updated.");
    } catch {
      setMessage("Could not generate skill gap");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => { fetchSkillGap(); }, []);

  if (loading) {
    return (
      <Layout title="Skill Gap Analysis">
        <div className="flex items-center justify-center py-24">
          <p className="text-[13px] text-neutral-400">Loading skill assessment…</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Skill Gap Analysis" subtitle="Target role readiness benchmark">
      <div className="space-y-6">

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-6">
          <div>
            <span className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Benchmark Target</span>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 mt-1">
              {skillGap?.targetRole || "Software Engineer"}
            </h2>
            <p className="text-[13px] text-neutral-400 mt-0.5">
              Evaluated against industry prerequisites and interview criteria.
            </p>
          </div>

          <button
            onClick={generateSkillGap}
            disabled={generating}
            className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 shrink-0"
          >
            <RefreshCw size={13} className={generating ? "animate-spin" : ""} />
            {generating ? "Analyzing…" : "Run Assessment"}
          </button>
        </div>

        {message && (
          <p className="rounded-lg bg-neutral-100 border border-neutral-200 px-3.5 py-2.5 text-[13px] text-neutral-700">
            {message}
          </p>
        )}

        {!skillGap ? (
          <div className="rounded-xl border border-dashed border-neutral-200 p-12 text-center">
            <Target size={24} strokeWidth={1.5} className="text-neutral-300 mx-auto mb-2" />
            <p className="text-[14px] font-medium text-neutral-700">No assessment generated yet</p>
            <p className="text-[12px] text-neutral-400 mt-1">Run an analysis to inspect your proficiency gaps.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* Strong Skills */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-neutral-900" strokeWidth={2} />
                <h3 className="text-[14px] font-semibold text-neutral-800">Verified Proficiencies</h3>
              </div>
              {skillGap.strongSkills.length === 0 ? (
                <p className="text-[13px] text-neutral-400">None detected yet.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {skillGap.strongSkills.map((s, i) => (
                    <span key={i} className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[12px] font-medium text-neutral-700">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Weak Skills */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-neutral-900" strokeWidth={2} />
                <h3 className="text-[14px] font-semibold text-neutral-800">Needs Improvement</h3>
              </div>
              {skillGap.weakSkills.length === 0 ? (
                <p className="text-[13px] text-neutral-400">No weak areas identified.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {skillGap.weakSkills.map((s, i) => (
                    <span key={i} className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[12px] font-medium text-neutral-700">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Skills */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4">
              <div className="flex items-center gap-2">
                <XCircle size={16} className="text-neutral-900" strokeWidth={2} />
                <h3 className="text-[14px] font-semibold text-neutral-800">Missing Core Skills</h3>
              </div>
              {skillGap.missingSkills.length === 0 ? (
                <p className="text-[13px] text-neutral-400">No missing prerequisites.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {skillGap.missingSkills.map((s, i) => (
                    <span key={i} className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[12px] font-medium text-neutral-700">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4 md:col-span-2 xl:col-span-1">
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-neutral-900" strokeWidth={2} />
                <h3 className="text-[14px] font-semibold text-neutral-800">Direct Actions</h3>
              </div>
              {skillGap.recommendations.length === 0 ? (
                <p className="text-[13px] text-neutral-400">No actions required.</p>
              ) : (
                <ul className="space-y-2">
                  {skillGap.recommendations.map((r, i) => (
                    <li key={i} className="text-[12px] text-neutral-600 leading-relaxed border-b border-neutral-100 pb-2 last:border-0 last:pb-0">
                      {r}
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        )}

        {/* Footer Link */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
          <div>
            <p className="text-[13px] font-semibold text-neutral-800">Structured Study Plan</p>
            <p className="text-[12px] text-neutral-400">Bridge your detected gaps with a step-by-step roadmap.</p>
          </div>
          <button
            onClick={() => (window.location.href = "/learning-roadmap")}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3.5 py-2 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-900 hover:text-white hover:border-neutral-900"
          >
            Open Roadmap <ArrowRight size={13} />
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default SkillGap;
