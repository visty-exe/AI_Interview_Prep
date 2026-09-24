import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import { Users, Mic, Code2, Activity, Award, RefreshCw, Search } from "lucide-react";

const AdminDashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/dashboard`, {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message); return; }
      setDashboard(data);
    } catch {
      setMessage("Could not fetch admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) {
    return (
      <Layout title="Admin Console" subtitle="Platform metrics & student activity">
        <div className="flex items-center justify-center py-24">
          <p className="text-[13px] text-neutral-400">Loading admin console…</p>
        </div>
      </Layout>
    );
  }

  if (message) {
    return (
      <Layout title="Admin Console" subtitle="Platform metrics & student activity">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 max-w-sm mx-auto text-center">
          <p className="text-[13px] text-neutral-600">{message}</p>
        </div>
      </Layout>
    );
  }

  const statCards = [
    { label: "Enrolled Candidates", value: dashboard.totalStudents, icon: Users },
    { label: "Interviews Taken", value: dashboard.totalInterviews, icon: Mic },
    { label: "Coding Submissions", value: dashboard.totalCodingAttempts, icon: Code2 },
    { label: "Avg Interview Score", value: `${dashboard.averageInterviewScore}/10`, icon: Activity },
    { label: "Avg Coding Score", value: `${dashboard.averageCodingScore}/10`, icon: Award },
  ];

  const filteredUsers = dashboard.recentUsers.filter((u) =>
    u.name?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    u.targetRole?.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  const thCls = "px-5 py-3 text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wider";
  const tdCls = "px-5 py-3.5 text-[13px]";

  const setTab = (tab) => {
    if (tab === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ tab });
    }
  };

  return (
    <Layout title="Admin Console" subtitle="Platform metrics & candidate governance">
      <div className="space-y-6">

        {/* Top Control Bar & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs">
          <div>
            <h2 className="text-[15px] font-bold tracking-tight text-neutral-900">Governance Console</h2>
            <p className="text-[12px] text-neutral-400 mt-0.5">Platform overview and student tracking</p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Filter Tabs */}
            <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-1">
              {[
                { id: "all", label: "Overview" },
                { id: "candidates", label: "Candidates" },
                { id: "interviews", label: "Sessions" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    activeTab === t.id
                      ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={fetchDashboard}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[12px] font-medium text-neutral-700 transition hover:bg-neutral-50 shadow-2xs shrink-0"
              title="Refresh Data"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {/* Metric Cards (Shown on Overview or All) */}
        {(activeTab === "all" || activeTab === "overview") && (
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">{s.label}</span>
                    <Icon size={14} className="text-neutral-400" />
                  </div>
                  <p className="text-2xl font-bold tracking-tight text-neutral-900">{s.value}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent Students Table (Shown on All or Candidates tab) */}
        {(activeTab === "all" || activeTab === "candidates") && (
          <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-neutral-100 gap-3">
              <div>
                <h2 className="text-[14px] font-semibold text-neutral-800">Candidate Registry</h2>
                <p className="text-[11px] text-neutral-400 mt-0.5">Enrolled candidates preparing for placements</p>
              </div>

              {/* Search filter */}
              <div className="relative w-full sm:w-64">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filter candidates…"
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-8 pr-3 py-1.5 text-[12px] text-neutral-800 outline-none transition focus:border-neutral-400 focus:bg-white"
                />
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <p className="p-5 text-[13px] text-neutral-400">No matching candidates found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-100">
                    <tr>
                      <th className={thCls}>Candidate</th>
                      <th className={thCls}>Email</th>
                      <th className={thCls}>Target Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className={`${tdCls} font-medium text-neutral-900`}>
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                            {user.name}
                          </div>
                        </td>
                        <td className={`${tdCls} text-neutral-500 font-mono text-[12px]`}>{user.email}</td>
                        <td className={`${tdCls} text-neutral-600`}>
                          {user.targetRole ? (
                            <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                              {user.targetRole}
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-[12px]">Unset</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Recent Activity Table (Shown on All or Interviews tab) */}
        {(activeTab === "all" || activeTab === "interviews") && (
          <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
            <div className="px-5 py-4 border-b border-neutral-100">
              <h2 className="text-[14px] font-semibold text-neutral-800">Interview Activity Log</h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">Live records of candidate mock interview evaluations</p>
            </div>

            {dashboard.recentInterviews.length === 0 ? (
              <p className="p-5 text-[13px] text-neutral-400">No session history found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-100">
                    <tr>
                      <th className={thCls}>Candidate</th>
                      <th className={thCls}>Type</th>
                      <th className={thCls}>Difficulty</th>
                      <th className={thCls}>Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {dashboard.recentInterviews.map((iv) => (
                      <tr key={iv._id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className={`${tdCls} font-medium text-neutral-900`}>{iv.user?.name || "Anonymous"}</td>
                        <td className={`${tdCls} text-neutral-600 capitalize`}>{iv.type}</td>
                        <td className={`${tdCls}`}>
                          <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-700 capitalize">
                            {iv.difficulty}
                          </span>
                        </td>
                        <td className={`${tdCls} font-bold text-neutral-900`}>{iv.overallScore} / 10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default AdminDashboard;