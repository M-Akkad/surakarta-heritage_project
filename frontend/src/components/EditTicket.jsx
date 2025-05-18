// src/components/EditTicket.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authFetch } from '../api.js';

export default function EditTicket()
{
  const { token } = useContext(AuthContext);
  const fetcher = authFetch(token);
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    visitor_type: 'tourist',
    age_group: 'adult',
    gender: 'male',
    location_name: 'Kraton'
  });
  const [error, setError] = useState(null);

  useEffect(() =>
  {
    fetcher(`/tickets/${id}`)
      .then(data => setForm(data))
      .catch(err => setError(err.detail || err.message));
  }, [id]);

  const handleChange = e =>
  {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e =>
  {
    e.preventDefault();
    setError(null);
    try
    {
      await fetcher(`/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      navigate('/tickets');
    } catch (err)
    {
      setError(err.detail || err.message);
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: 600 }}>
      <div className="card-header"><h5>Edit Ticket #{id}</h5></div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/** Visitor Type **/}
          <div className="mb-3">
            <label className="form-label">Visitor Type</label>
            <select
              name="visitor_type"
              className="form-select"
              value={form.visitor_type}
              onChange={handleChange}
            >
              <option value="tourist">Tourist</option>
              <option value="local">Local</option>
            </select>
          </div>
          {/** Age Group **/}
          <div className="mb-3">
            <label className="form-label">Age Group</label>
            <select
              name="age_group"
              className="form-select"
              value={form.age_group}
              onChange={handleChange}
            >
              <option value="child">Child</option>
              <option value="adult">Adult</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          {/** Gender **/}
          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-select"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          {/** Location **/}
          <div className="mb-3">
            <label className="form-label">Location</label>
            <select
              name="location_name"
              className="form-select"
              value={form.location_name}
              onChange={handleChange}
            >
              <option value="Kraton">Kraton</option>
              <option value="Pura Mangkunegaran">Pura Mangkunegaran</option>
              <option value="Pasar Triwindu">Pasar Triwindu</option>
            </select>
          </div>
          <button className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
