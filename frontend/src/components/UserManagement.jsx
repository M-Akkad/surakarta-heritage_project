import React, { useEffect, useState, useContext } from 'react'
import { listUsers, changeUserRole } from '../api'
import { AuthContext } from '../context/AuthContext'

export default function UserManagement()
{
  const { token } = useContext(AuthContext)
  const [users, setUsers] = useState([])


  const [error, setError] = useState(null)

  useEffect(() =>
  {
    listUsers(token)
      .then(data =>
      {
        if (!Array.isArray(data)) throw data
        setUsers(data)
      })
      .catch(err =>
      {
        console.error(err)
        setError(err.detail || err.message || 'Failed to load users')
      })

  }, [token])

  const handleRole = async (u, role) =>
  {
    try
    {
      await changeUserRole(token, u.username, role)
      setUsers(us => us.map(x => x.username === u.username ? { ...x, role } : x))
    } catch (err)
    {
      console.error(err)
      setError(err.detail || err.message || 'Failed to change role')
    }
  }

  if (error)
  {
    return <div className="alert alert-danger">Error: {error}</div>
  }

  return (
    <div className="card mx-auto" style={{ maxWidth: 600 }}>
      <div className="card-header"><h5>User Management</h5></div>
      <ul className="list-group list-group-flush">
        {users.map(u => (
          <li key={u.username} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{u.username}</span>
            <select
              className="form-select w-auto"
              value={u.role}
              onChange={e => handleRole(u, e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  )
}
