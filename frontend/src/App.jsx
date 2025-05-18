import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import TicketList from "./components/TicketList";
import IssueTicket from "./components/IssueTicket";
import Stats from "./components/Stats";
import EditTicket from "./components/EditTicket";
import UserManagement from "./components/UserManagement";
import Home from "./components/Home";

function NavBar()
{
  const { token, logout } = React.useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Heritage
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/tickets">
                    Tickets
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/issue">
                    Issue
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/stats">
                    Stats
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    Users
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button
                  className="btn btn-outline-danger"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default function App()
{
  return (
    <Router>
      <AuthProvider>
        <NavBar />

        <div className="container">
          <Routes>
            <Route
              path="/Home"
            />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tickets" element={<TicketList />} />
            <Route path="/issue" element={<IssueTicket />} />
            <Route path="/tickets/edit/:id" element={<EditTicket />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
