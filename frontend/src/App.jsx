// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Pages / Components
import NavBar from './components/NavBar'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import TicketList from './components/TicketList'
import IssueTicket from './components/IssueTicket'
import EditTicket from './components/EditTicket'
import Stats from './components/Stats'
import UserManagement from './components/UserManagement'
import Footer from './components/Footer';



export default function App() {
    return (
        <Router>
            <AuthProvider>
                <NavBar />
                <div className="container mt-4">
                    <Routes>
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
                <Footer /> {/* Footer added */}
            </AuthProvider>
        </Router>
    )
}
