import React, {useContext} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import './styling/NavBar.css'

export default function NavBar() {
    const {token, logout, user} = useContext(AuthContext);
    const location = useLocation();

    const isActive = path => location.pathname.startsWith(path);
    console.log("Current user:", token, user);
    sessionStorage.getItem('token')



    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold" to="/">🏛️ Heritage</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarResponsive">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {token && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/tickets">🎫 Tickets</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/issue">📝 Issue</Link>
                                </li>

                                {/* Only admin sees these */}
                                {user?.role === "admin" && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/stats">📊 Stats</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/users">👥 Users</Link>
                                        </li>
                                    </>
                                )}


                            </>

                        )}


                    </ul>
                    <div className="d-flex align-items-center ms-lg-3">
                        {!token ? (
                            <>
                                <Link className={`nav-link ${isActive("/login") ? "active" : ""}`} to="/login">🔐
                                    Login</Link>
                                <Link className={`nav-link ${isActive("/register") ? "active" : ""}`} to="/register">✍️
                                    Register</Link>
                            </>
                        ) : (
                            <button className="btn btn-sm btn-outline-danger" onClick={logout}>🚪 Logout</button>
                        )}
                    </div>
                </div>
            </div>
        </nav>

    );
}