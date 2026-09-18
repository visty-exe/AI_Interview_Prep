import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [name, setName] = useState(user?.name || "");
  const [targetRole, setTargetRole] = useState(user?.targetRole || "");
  const [skills, setSkills] = useState(user?.skills?.join(",") || "");
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeMessage, setResumeMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const totalInterviews = interviews.length;

  const averageScore =
    totalInterviews > 0
      ? interviews.reduce(
          (total, interview) => total + interview.overallScore,
          0,
        ) / totalInterviews
      : 0;

  const highestScore =
    totalInterviews > 0
      ? Math.max(...interviews.map((interview) => interview.overallScore))
      : 0;

  const scoreTrend = [...interviews].reverse().map((interview, index) => ({
    interview: index + 1,
    score: interview.overallScore,
  }));
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          targetRole,
          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== ""),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message);
        return;
      }
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setAnalysis(data.user.resumeAnalysis);
        }
      } catch (error) {
        console.error(error);
      }
    };
    const fetchInterviews = async () => {
      try {
        const response = await fetch(`${BASE_URL}/interviews`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setInterviews(data.interviews);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchProfile();
    fetchInterviews();
  }, []);

  const handleResumeUpload = async (e) => {
    e.preventDefault();

    if (!resume) {
      setResumeMessage("Please select a PDF");
      return;
    }

    const formData = new FormData();

    formData.append("resume", resume);

    try {
      const response = await fetch(`${BASE_URL}/users/resume`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setResumeMessage(data.message);
        return;
      }
      setAnalysis(data.analysis);
      setResumeMessage("Resume uploaded successfully!");
    } catch (error) {
      console.error(error);
      setResumeMessage("Something went wrong");
    }
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome, {user?.name}</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <hr />

      <h2>My Profile</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Target Role</label>
          <br />

          <input
            type="text"
            placeholder="e.g. Full Stack Developer"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Skills</label>
          <br />

          <input
            type="text"
            placeholder="Java, React, MongoDB"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Update Profile</button>
      </form>

      <p>{message}</p>
      <hr />

      <h2>Upload Resume</h2>
      <form onSubmit={handleResumeUpload}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])}
        />
        <br />
        <br />

        <button type="submit">Upload Resume</button>
      </form>
      <p>{resumeMessage}</p>
      <hr />
      <h2>Placement Preparation</h2>
      <button
        onClick={() => {
          window.location.href = "/mock-interview";
        }}
      >
        Start Mock Interview
      </button>

      <hr />
      <h2>Performance Summary</h2>
      <div>
        <div>
          <h3>Total Interviews</h3>
          <p>{totalInterviews}</p>
        </div>

        <div>
          <h3>Average Score</h3>
          <p>{averageScore.toFixed(1)}/10</p>
        </div>

        <div>
          <h3>Highest Score</h3>
          <p>{highestScore.toFixed(1)}/10</p>
        </div>
      </div>
      <hr />

      <h2>Score Trend</h2>

      {scoreTrend.length === 0 ? (
        <p>No interview data available</p>
      ) : (
        scoreTrend.map((item) => (
          <p key={item.interview}>
            Interview {item.interview}: {item.score.toFixed(1)}/10
          </p>
        ))
      )}
      <hr />

      <h2> Interview History</h2>
      {historyLoading ? (
        <p>Loading interview history...</p>
      ) : interviews.length === 0 ? (
        <p>No interviews completed yet.</p>
      ) : (
        interviews.map((interview) => (
          <div key={interview._id}>
            <h3>{interview.type.toUpperCase()} Interview</h3>

            <p>Role: {interview.targetRole}</p>

            <p>Difficulty: {interview.difficulty}</p>

            <p>Score: {interview.overallScore.toFixed(1)}/10</p>

            <p>Date: {new Date(interview.createdAt).toLocaleDateString()}</p>

            <button
              onClick={() => {
                window.location.href = `/interview-result/${interview._id}`;
              }}
            >
              View Result
            </button>

            <hr />
          </div>
        ))
      )}

      <div>
        {analysis && (
          <>
            <hr />
            <h2>AI Resume Analysis</h2>

            <h3>Resume Score: {analysis.score}/100</h3>

            <h3>Skills</h3>
            <ul>
              {(analysis.skills || []).map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>

            <h3>Strengths</h3>
            <ul>
              {(analysis.strengths || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>Weaknesses</h3>
            <ul>
              {(analysis.weaknesses || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>Missing Skills</h3>
            <ul>
              {(analysis.missingSkills || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>AI Suggestions</h3>
            <ul>
              {(analysis.suggestions || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div>
        <h3>🎤 Mock Interview</h3>
        <p>Practice technical and HR interviews with AI.</p>
      </div>

      <div>
        <h3>💻 Coding Interview</h3>
        <p>Practice coding questions for placements.</p>
      </div>

      <div>
        <h3>📊 Performance</h3>
        <p>Track your interview and coding performance.</p>
      </div>

      <br />

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
