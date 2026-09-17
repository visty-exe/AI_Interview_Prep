import React from "react";
import { useState } from "react";

const MockInterview = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [type, setType] = useState("technical");
  const [difficulty, setDifficulty] = useState("medium");
  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${BASE_URL}/interviews/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          type,
          difficulty,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setInterview(data.interview);
      setCurrentQuestion(0);
      setAnswer("");
    } catch (error) {
      console.error(error);
      setMessage("Could not start interview");
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    if (!answer.trim()) {
      setMessage("Please write your answer first");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${BASE_URL}/interviews/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")} `,
        },
        body: JSON.stringify({
          interviewId: interview._id,
          questionIndex: currentQuestion,
          answer,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      console.log("Evaluation:", data.evaluation);
      if (currentQuestion < interview.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);

        setAnswer("");
      } else {
        setMessage("Interview completed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not submit answer");
    } finally {
      setLoading(false);
    }
  };

  if (!interview) {
    return (
      <>
        <div>
          <h1>AI Mock Interview</h1>
          <h2>Interview Type</h2>

          <button onClick={() => setType("technical")}>Technical</button>

          <button onClick={() => setType("hr")}>HR</button>

          <h2>Difficulty</h2>

          <button onClick={() => setDifficulty("easy")}>Easy</button>
          <button onClick={() => setDifficulty("medium")}>Medium</button>
          <button onClick={() => setDifficulty("hard")}>Hard</button>

          <br />
          <br />

          <button onClick={startInterview} disabled={loading}>
            {loading ? "starting..." : "Start Interview"}
          </button>

          <p>{message}</p>
        </div>
      </>
    );
  }
  const question = interview.questions[currentQuestion];

  return (
    <>
      <div>
        <h1>AI Mock Interview</h1>
        <p>
          Question{currentQuestion + 1} of {interview.questions.length}
        </p>

        <h2>{question.question}</h2>

        <textarea
          rows="8"
          cols="60"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
          }}
        />

        <br />
        <br />

        <button onClick={nextQuestion} disabled={loading}>
          {loading
            ? "Evaluating..."
            : currentQuestion === interview.questions.length - 1
              ? "Finish Interview"
              : "Next Question"}
        </button>

        <p>{message}</p>
      </div>
    </>
  );
};

export default MockInterview;
