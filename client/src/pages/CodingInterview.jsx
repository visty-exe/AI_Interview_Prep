import React, { useState } from "react";

const CodingInterview = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [difficulty, setDifficulty] = useState("medium");
  const [codingInterview, setCodingInterview] = useState(null);
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const startCodingInterview = async () => {
    try {
      const response = await fetch(`${BASE_URL}/coding/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ difficulty }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setCodingInterview(data.codingInterview);
      setCode("");
    } catch (error) {
      console.error(error);
      setMessage("Could not start coding interview");
    } finally {
      setLoading(false);
    }
  };

  if (!codingInterview) {
    return (
      <>
        <div>
          <h1>AI Coding Platform</h1>

          <h2>Select Difficulty</h2>

          <button onClick={() => setDifficulty("easy")}>Easy</button>

          <button onClick={() => setDifficulty("medium")}>Medium</button>

          <button onClick={() => setDifficulty("hard")}>Hard</button>

          <br />
          <br />

          <p> Selected Difficulty: {difficulty}</p>

          <button onClick={startCodingInterview} disabled={loading}>
            {loading ? "Generating..." : "Start Coding Interview"}
          </button>

          <p>{message}</p>
        </div>
      </>
    );
  }
  const question = codingInterview.question;
  return (
    <>
      <div>
        <h1>AI Coding Intervieww</h1>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <h3>Input</h3>
        <p>{question.input}</p>
        <h3>Output</h3>
        <p>{question.output}</p>
        <h3>Constraints</h3>
        <ul>
          {question.constraints.map((c, index) => (
            <li key={index}>{c}</li>
          ))}
        </ul>
        <hr />
        <h2>Write Your Java Code</h2>
        <textarea
          rows="20"
          cols="80"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your Java code here..."
        />
        <br />
        <br />
        <button>Submit Code</button>
        <p>{message}</p>
      </div>
    </>
  );
};

export default CodingInterview;
