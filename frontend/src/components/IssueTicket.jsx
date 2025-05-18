import React, {useState, useContext} from "react";
import {authFetch} from "../api";
import {AuthContext} from "../context/AuthContext";

export default function IssueTicket() {
    const {token} = useContext(AuthContext);
    const fetcher = authFetch(token);

    const [form, setForm] = useState({
        visitor_type: "",
        age_group: "",
        gender: "",
        location_name: ""
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = e => {
        const {name, value} = e.target;
        setForm(f => ({...f, [name]: value}));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        try {
            await fetcher("/tickets", {
                method: "POST",
                body: JSON.stringify(form)
            });
            setForm({
                visitor_type: "",
                age_group: "",
                gender: "",
                location_name: ""
            });
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError(err.detail || "Failed to issue ticket");
        }
    };

    return (
        <div className="container-fluid px-3">
            <div className="card mx-auto my-4 shadow-sm" style={{maxWidth: 600}}>
                <div className="card-header">
                    <h5 className="mb-0">Issue New Ticket</h5>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">Ticket successfully created!</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Visitor Type */}
                        <div className="mb-3">
                            <label className="form-label">Visitor Type</label>
                            <select
                                name="visitor_type"
                                className="form-select"
                                value={form.visitor_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select visitor type</option>
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
                                required
                            >
                                <option value="">Select age group</option>
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
                                required
                            >
                                <option value="">Select gender</option>
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
                                required
                            >
                                <option value="">Select location</option>
                                <option value="Kraton">Kraton</option>
                                <option value="Pura Mangkunegaran">Pura Mangkunegaran</option>
                                <option value="Pasar Triwindu">Pasar Triwindu</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
