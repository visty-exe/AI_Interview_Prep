import React from "react";
import { useEffect } from "react";

const LearningRoadmap = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const fetchRoadmap = async () => {
    try {
      const response = await fetch(`${BASE_URL}/roadmap`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setRoadmap(data.roadmap);
    } catch (error) {
      console.error(error);
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
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setRoadmap(data.roadmap);
      setMessage("Learning roadmap updated successfully");
    } catch (error) {
      console.error(error);
      setMessage("Could not generate roadmap");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  if (loading) {
    return <h2>Loading roadmap...</h2>;
  }
  return (
    <>
      <div>
        <h1>AI Learning Roadmap</h1>

        <button onClick={generateRoadmap} disabled={generating}>
          {generating ? "Generating..." : "Generate Roadmap"}
        </button>

        {message && <p>{message}</p>}

        {!roadmap ? (
          <p>No learning roadmap available</p>
        ) : (
          <>
            <h2>Target Role</h2>
            <p>{roadmap.targetRole}</p>

            <hr />
            <h2>Roadmap</h2>

            {roadmap.roadmap.map((phase) => {
              <div key={phase._id}>
                <h3>
                  Phase {phase.phase}: {phase.title}
                </h3>

                <p>
                  <strong>Priority:</strong> {phase.priority}
                </p>
                <p>
                  <strong>Estimated Time:</strong> {phase.estimatedTime}
                </p>

                <h4>Skills</h4>
                <ul>
                  {phase.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}

                  <h4>Topics</h4>

                  <ul>
                    {phase.topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>

                  <hr />
                </ul>
              </div>;
            })}
          </>
        )}
      </div>
    </>
  );
};

export default LearningRoadmap;
