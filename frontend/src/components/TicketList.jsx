// src/components/TicketList.jsx
import React, { useEffect, useState, useContext } from 'react'
import { authFetch } from '../api.js'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function TicketList()
{
  const { token } = useContext(AuthContext)
  const fetcher = authFetch(token)
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() =>
  {
    if (!token) return
    async function load()
    {
      try
      {
        const data = await fetcher('/tickets/')      // returns parsed JSON
        if (!Array.isArray(data))
        {
          console.error('Expected tickets array, got:', data)
          setTickets([])
        } else
        {
          setTickets(data)
        }
      } catch (err)
      {
        console.error(err)
        setError(err.detail || err.message || 'Failed to load tickets')
      }
    }
    load()
  }, [token])

  const handleDelete = async id =>
  {
    if (!window.confirm(`Delete ticket #${id}?`)) return
    try
    {
      await fetcher(`/tickets/${id}`, { method: 'DELETE' })
      setTickets(ts => ts.filter(t => t.id !== id))
    } catch (err)
    {
      console.error(err)
      setError(err.detail || err.message || 'Failed to delete ticket')
    }
  }

  if (error)
  {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">All Tickets</h5>
      </div>
      <div className="card-body p-0">
        <table className="table mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Age Group</th>
              <th>Gender</th>
              <th>Location</th>
              <th>Issued At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.visitor_type}</td>
                <td>{t.age_group}</td>
                <td>{t.gender}</td>
                <td>{t.location_name}</td>
                <td>{new Date(t.issued_at).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => navigate(`/tickets/edit/${t.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(t.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-3">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

