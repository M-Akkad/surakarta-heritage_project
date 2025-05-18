// src/components/Login.jsx
import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Navigate } from 'react-router-dom'

export default function Login()
{
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { token, login } = useContext(AuthContext)
  const navigate = useNavigate()

  // if already logged in, kick them to home page
  if (token) return <Navigate to="/tickets" replace />

  const handleSubmit = async e =>
  {
    e.preventDefault()
    setError(null)
    try
    {
      await login(username, password)
      navigate('/')
    } catch (err)
    {
      setError(err.detail || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mx-auto p-4" style={{ maxWidth: 400 }}>
      <h3 className="card-title mb-3">Login</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          className="form-control"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">Login</button>
    </form>
  )
}
