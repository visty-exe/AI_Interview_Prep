import React, { useState } from "react";
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

      <div>
        <h3>📄 Resume Analysis</h3>
        <p>Upload your resume and get AI-powered feedback.</p>
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
