import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Code2 } from "lucide-react";

const CodingHistory = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/coding/history`, {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message); return; }
      setHistory(data.history);
    } catch {
      setMessage("Could not fetch coding history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  if (loading) {
    return (
      <Layout title="Coding History">
        <div className="flex items-center justify-center py-24">
          <p className="text-[13px] text-neutral-400">Loading attempt records…</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Coding History" subtitle="Archive of all problem solving attempts">
      <div className="space-y-4 max-w-4xl mx-auto py-2">
        {message && (
          <p className="rounded-lg bg-neutral-100 border border-neutral-200 px-3.5 py-2.5 text-[13px] text-neutral-700">
            {message}
          </p>
        )}

        {history && history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 p-12 text-center">
            <Code2 size={24} strokeWidth={1.5} className="text-neutral-300 mx-auto mb-2" />
            <p className="text-[14px] font-medium text-neutral-700">No attempts logged</p>
            <p className="text-[12px] text-neutral-400 mt-1">Start a coding challenge to track your evaluations here.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-white divide-y divide-neutral-100 overflow-hidden shadow-2xs">
            {history && history.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 gap-3 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 shrink-0 mt-0.5">
                    <Code2 size={14} className="text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-neutral-900">
                      {item.question?.title || "Algorithmic Problem"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-600 capitalize">
                        {item.difficulty}
                      </span>
                      {item.feedback && (
                        <p className="text-[12px] text-neutral-400 truncate max-w-md">{item.feedback}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="text-[13px] font-bold text-neutral-900">
                    {item.score != null ? `${item.score} / 10` : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CodingHistory;
