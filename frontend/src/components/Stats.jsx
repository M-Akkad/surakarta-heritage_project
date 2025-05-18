import React, { useEffect, useState, useContext } from "react";
import { authFetch } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Stats() {
  const { token } = useContext(AuthContext);
  const fetcher = authFetch(token);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetcher("/stats/")
        .then(setStats)
        .catch(e => setError(e.detail || e.message));
  }, [token]);

  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (!stats) return <div className="text-center py-5">Loading statistics…</div>;

  return (
      <div className="container-fluid px-3">
        <div className="card mx-auto my-4 shadow-sm" style={{ maxWidth: 500 }}>
          <div className="card-header">
            <h5 className="mb-0">Ticket Statistics</h5>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>Total Tickets:</strong> {stats.total_tickets}</li>
            <li className="list-group-item"><strong>Local Count:</strong> {stats.local_count}</li>
            <li className="list-group-item"><strong>Tourist Count:</strong> {stats.tourist_count}</li>
          </ul>
        </div>
      </div>
  );
}
