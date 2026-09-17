import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const InterviewResult = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`${BASE_URL}/interviews/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setInterview(data.interview);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  }, [id]);

  if (loading) {
    return <h2>Loading result...</h2>;
  }

  if (!interview) {
    return <h2>Result not found</h2>;
  }

  return (
    <div>
      <h1>Interview Result</h1>
      <h2>Overall Score: {interview.overallScore.toFixed(1)}/10</h2>

      <p>Role: {interview.targetRole}</p>

      <p>Type: {interview.type}</p>
      <hr />

      <h2>Question Analysis</h2>

      {interview.questions.map((question, index) => (
        <div key={index}>
          <h3>Question {index + 1}</h3>

          <p>
            <strong>{question.questions}</strong>
          </p>

          <p>
            <strong>Your Answer:</strong>
          </p>

          <p>{question.answer}</p>

          <p>
            <strong>Score:</strong> {question.score}/10
          </p>

          <p>
            <strong>AI Feedback:</strong> {question.feedback}
          </p>

          <hr/>
        </div>
      ))}
    </div>
  );
};


export default InterviewResult