import React, { useState, useContext } from 'react'
import { authFetch } from '../api'
import { AuthContext } from '../context/AuthContext'

export default function IssueTicket()
{
  const { token } = useContext(AuthContext)
  const fetcher = authFetch(token)
  const [form, setForm] = useState({
    visitor_type: 'tourist',
    age_group: 'adult',
    gender: 'male',
    location_name: 'Kraton'
  })
  const [result, setResult] = useState(null)

  const handleChange = e =>
  {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e =>
  {
    e.preventDefault()
    try
    {
      // fetcher already .json()’s on success
      const created = await fetcher('/tickets', {
        method: 'POST',
        body: JSON.stringify(form)
      })
      setResult(created)
    } catch (err)
    {
      console.error(err)
      setError(err.detail || 'Failed to issue ticket')
    }
  }

  return (
    <div className="card mx-auto" style={{ maxWidth: 600 }}>
      <div className="card-header">
        <h5 className="mb-0">Issue New Ticket</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Visitor Type */}
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

          {/* Age Group */}
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

          {/* Gender */}
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

          {/* Location */}
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

          <button className="btn btn-primary">Submit</button>
        </form>

        {result && (
          <div className="alert alert-success mt-3">
            <strong>Created:</strong>
            <pre className="mb-0">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
