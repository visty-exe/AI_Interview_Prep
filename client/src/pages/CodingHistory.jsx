import React, { useState,useEffect } from "react";

const CodingHistory = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchHistory = async (req, res) => {
    try {
      const response = await fetch(`${BASE_URL}/coding/history`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setHistory(data.history);
    } catch (error) {
      console.error(error);
      setMessage("Could not fetch coding history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <>
      <div>
        <h1>Coding Interview History</h1>
        <hr/>
        {message && <p>{message}</p>}

        {history.length === 0 ? (
          <p>No coding interviews found.</p>
        ) : (
          history.map((item) => (
            <div key={item._id}>
              <h2>{item.question.title}</h2>

              <p>Difficulty: {item.difficulty}</p>

              <p>Score: {item.score}/10</p>

              <p>{item.feedback || "Not evaluated yet"}</p>

              <hr />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default CodingHistory;
