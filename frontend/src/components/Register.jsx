import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register as apiRegister } from '../api'

// Registration form: on success, redirect to login page
export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    // Call backend registration API
    const res = await apiRegister(username, password)
    if (res.detail) {
      // If backend returns detail (error), display it
      setError(res.detail)
    } else {
      // On successful registration, navigate to login page
      navigate('/login')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mx-auto p-4" style={{ maxWidth: 400 }}>
      <h3 className="card-title mb-3">Register</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          className="form-control"
          value={username}
          onChange={e => setUsername(e.target.value)}
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
      <button type="submit" className="btn btn-success w-100">
        Register
      </button>
    </form>
  )
}
