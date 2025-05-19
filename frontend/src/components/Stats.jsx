import React, { useEffect, useState, useContext } from "react";
import
{
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { authFetch } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomizedLabel = (entry, total) =>
{
  const percent = ((entry.value / total) * 100).toFixed(1);
  return `${entry.name} (${percent}%)`;
};

export default function Stats()
{
  const { token } = useContext(AuthContext);
  const fetcher = authFetch(token);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() =>
  {

    if (!token)
    {
      navigate("/", { replace: true });
      return;
    }


    fetcher("/stats/")
      .then(setStats)
      .catch(e => setError(e.detail || e.message));
  }, [token]);

  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (!stats) return <div className="text-center py-5">Loading statistics…</div>;

  const toPieData = (obj) => Object.entries(obj).map(([name, value]) => ({ name, value }));
  const totalTickets = stats.total_tickets || 1;
  const issuedData = Object.entries(stats.issued_at_distribution || {}).map(([date, count]) => ({ date, count }));

  return (
    <div className="container-fluid px-3">
      <div className="card mx-auto my-4 shadow-sm" style={{ maxWidth: 500 }}>
        <div className="card-header"><h5 className="mb-0">Overall Ticket Statistics</h5></div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item"><strong>Total Tickets:</strong> {stats.total_tickets}</li>
          <li className="list-group-item"><strong>Tourists:</strong> {stats.tourist_count} ({((stats.tourist_count / totalTickets) * 100).toFixed(1)}%)</li>
          <li className="list-group-item"><strong>Locals:</strong> {stats.local_count} ({((stats.local_count / totalTickets) * 100).toFixed(1)}%)</li>
        </ul>
      </div>

      <div className="row g-4 px-2">
        <div className="col-md-6">
          <h6 className="text-center">Age Group Distribution</h6>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={toPieData(stats.age_distribution)}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={({ name, value }) =>
                  renderCustomizedLabel({ name, value }, totalTickets)
                }
              >
                {toPieData(stats.age_distribution).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}`, "Count"]}
                labelFormatter={(name) => name}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6">
          <h6 className="text-center">Location Distribution</h6>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={toPieData(stats.location_distribution)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Visitors" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-12">
          <h6 className="text-center">Tickets Issued Per Day</h6>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={issuedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Tickets Issued" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
