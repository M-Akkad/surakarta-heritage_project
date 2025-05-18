// src/components/NavBar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function NavBar()
{
  const { token, user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Heritage</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {token && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/tickets">Tickets</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/issue">Issue</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/stats">Stats</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/users">Users</Link></li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {!token ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
