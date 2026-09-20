import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CodingPerformance = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      setMessage("")
      const response = await fetch(`${BASE_URL}/coding/performance`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setPerformance(data);
    } catch (error) {
      console.error(error);
      setMessage("Could not fetch performance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (message) {
    return <p>{message}</p>;
  }

  return (
    <>
      <div>
        <h1>Coding Performance</h1>
        <h2>Total Attempts</h2>
        <p>{performance.totalAttempts}</p>
        <h2>Average Score</h2>
        <p>{performance.averageScore}/10</p>

        <h2>Highest Score</h2>
        <p>{performance.highestScore}/10</p>

        <hr />

        <h2>Difficulty Breakdown</h2>

        <p>Easy: {performance.easyAttempts}</p>

        <p>Medium: {performance.mediumAttempts}</p>

        <p>Hard: {performance.hardAttempts}</p>

        <hr />

        <h2>Score Trend</h2>

        {performance.scoreTrend.length === 0 ? (
          <p>No evaluated interviews yet.</p>
        ) : (
          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer>
              <LineChart
                data={performance.scoreTrend}
                margin={{
                  top: 20,
                  right: 30,
                  left: 10,
                  bottom: 20,
                }}
                
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="interview"
                  label={{
                    value: "Attempt",
                    position: "insideBottom",
                    offset: -10,
                  }}
                />

                <YAxis
                  domain={[0, 10]}
                  label={{
                    value: "Score",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                {/* <Legend /> */}
                <Tooltip />

                <Line type="monotone" dataKey="score" strokeWidth={3} dot={{r:5}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </>
  );
};

export default CodingPerformance;
