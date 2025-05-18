import {API_BASE} from "../api";
import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.jsx";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [adminCode, setAdminCode] = useState("");
    const [showAdminCode, setShowAdminCode] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const result = await register(username, password, adminCode);
            setSuccess(result.message || "Registration successful");
            setUsername("");
            setPassword("");
            setAdminCode("");

            // Redirect to login after 15 seconds
            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (err) {
            setError(err.message || "Registration failed");
        }
    };



    const isCodeFilled = adminCode.trim().length > 0;

    return (
        <form onSubmit={handleSubmit} className="card mx-auto p-4" style={{maxWidth: 500}}>
            <h3 className="card-title mb-3">Register</h3>

            {success && <div className="alert alert-info">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                    className="form-control"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>

            {/* Toggle for admin */}
            <div className="form-check form-switch mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="adminSwitch"
                    checked={showAdminCode}
                    onChange={() => setShowAdminCode(v => !v)}
                />
                <label className="form-check-label" htmlFor="adminSwitch">
                    Register as Admin
                </label>
            </div>

            {/* Admin Code Input */}
            {showAdminCode && (

                <div className="mb-3">
                    <label className="form-label">Admin Access Code</label>
                    <input
                        className="form-control"
                        value={adminCode}
                        onChange={e => setAdminCode(e.target.value)}
                    />
                    {isCodeFilled && (
                        <div className="form-text mt-1">
                            Your access code will be securely validated on submission.
                        </div>
                    )}
                </div>
            )}

            <button type="submit" className="btn btn-success w-100 mt-3">Register</button>
        </form>
    );
}
