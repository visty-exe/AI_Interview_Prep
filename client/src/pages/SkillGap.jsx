import React, { useEffect, useState } from "react";

const SkillGap = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [generating, setGenerating] = useState(false);

  const fetchSkillGap = async () => {
    try {
      const response = await fetch(`${BASE_URL}/skill-gap`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setSkillGap(data.skillGap);
    } catch (error) {
      console.error(error);
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
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setSkillGap(data.skillGap);
      setMessage("Skill gap analysis updated successfully");
    } catch (error) {
      console.error(error);
      setMessage("Could not generate skill gap");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchSkillGap();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1>AI Skill Gap Analysis</h1>

      <button onClick={generateSkillGap} disabled={generating}>
        {generating ? "Analyzing..." : "Generate Skill Gap"}
      </button>

      {message && <p>{message}</p>}

      {!skillGap ? (
        <p>No skill gap analysis available</p>
      ) : (
        <div>
          <h2>Target Role</h2>
          <p>{skillGap.targetRole}</p>

          <hr />

          <h2>Strong Skills</h2>

          {skillGap.strongSkills.length === 0 ? (
            <p>No strong skills identified.</p>
          ) : (
            <ul>
              {skillGap.strongSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          )}

          <hr />

          <h2>Weak Skills</h2>

          {skillGap.weakSkills.length === 0 ? (
            <p>No weak Skills</p>
          ) : (
            <ul>
              {skillGap.weakSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          )}

          <hr />

          <h2>Missing Skills</h2>

          {skillGap.missingSkills.length === 0 ? (
            <p>No missing skills identified.</p>
          ) : (
            <ul>
              {skillGap.missingSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          )}
          <hr />

          <h2>Recommendations</h2>
          {skillGap.recommendations.length === 0 ? (
            <p>No recommendations available.</p>
          ) : (
            <ul>
              {skillGap.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillGap;
