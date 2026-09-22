import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/dashboard`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setDashboard(data);
    } catch (error) {
      console.error(error);
      setMessage("Could not fetch admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <h2>Loading admin dashboard...</h2>;
  }

  if (message) {
    return <p>{message}</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div>
        <h2>Total Students</h2>
        <p>{dashboard.totalStudents}</p>
      </div>

      <div>
        <h2>Total Interviews</h2>
        <p>{dashboard.totalInterviews}</p>
      </div>

      <div>
        <h2>Total Coding Attempts</h2>
        <p>{dashboard.totalCodingAttempts}</p>
      </div>

      <div>
        <h2>Average Interview Score</h2>
        <p>{dashboard.averageInterviewScore} / 10</p>
      </div>

      <div>
        <h2>Average Coding Score</h2>
        <p>{dashboard.averageCodingScore} / 10</p>
      </div>

      <hr />

      <h2>Recent Students</h2>

      {dashboard.recentUsers.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul>
          {dashboard.recentUsers.map((user) => (
            <li key={user._id}>
              <strong>{user.name}</strong> - {user.email}
              <br />
              Target Role: {user.targetRole || "Not specified"}
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h2>Recent Interview Activity</h2>

      {dashboard.recentInterviews.length === 0 ? (
        <p>No interview activity found.</p>
      ) : (
        <ul>
          {dashboard.recentInterviews.map((interview) => (
            <li key={interview._id}>
              <strong>{interview.user?.name || "Unknown User"}</strong>
              {" - "}
              {interview.type} interview
              <br />
              Difficulty: {interview.difficulty}
              <br />
              Score: {interview.overallScore} / 10
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
