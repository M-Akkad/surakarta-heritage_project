import React, {useEffect, useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {authFetch} from "../api";

export default function TicketList() {
    const {token, user} = useContext(AuthContext);
    const fetcher = authFetch(token);
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);
    const [sortColumn, setSortColumn] = useState("id");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filters, setFilters] = useState({
        search: "",
        visitor_type: "",
        location_name: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetcher("/tickets/")
            .then(data => setTickets(Array.isArray(data) ? data : []))
            .catch(err => setError(err.detail || err.message));
    }, [token]);

    const handleDelete = async id => {
        if (!window.confirm(`Delete ticket #${id}?`)) return;
        try {
            await fetcher(`/tickets/${id}`, {method: "DELETE"});
            setTickets(ts => ts.filter(t => t.id !== id));
        } catch (err) {
            setError(err.detail || err.message || "Failed to delete ticket");
        }
    };

    const toggleSort = col => {
        if (col === sortColumn) {
            setSortDirection(dir => (dir === "asc" ? "desc" : "asc"));
        } else {
            setSortColumn(col);
            setSortDirection("asc");
        }
    };

    const filtered = tickets
        .filter(t =>
            (filters.search === "" ||
                t.location_name.toLowerCase().includes(filters.search.toLowerCase()) ||
                t.visitor_type.toLowerCase().includes(filters.search.toLowerCase())) &&
            (filters.visitor_type === "" || t.visitor_type === filters.visitor_type) &&
            (filters.location_name === "" || t.location_name === filters.location_name)
        )
        .sort((a, b) => {
            const valA = a[sortColumn];
            const valB = b[sortColumn];
            if (typeof valA === "string") {
                return sortDirection === "asc"
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }
            return sortDirection === "asc" ? valA - valB : valB - valA;
        });

    return (
        <div className="container-fluid px-3">
            <div className="card shadow-sm mb-4">
                <div className="card-header">
                    <h5 className="mb-0">All Tickets</h5>
                </div>

                {/* Filter Controls */}
                <div className="card-body border-bottom">
                    <div className="row g-2">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by location or type"
                                value={filters.search}
                                onChange={e =>
                                    setFilters(f => ({...f, search: e.target.value}))
                                }
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={filters.visitor_type}
                                onChange={e =>
                                    setFilters(f => ({...f, visitor_type: e.target.value}))
                                }
                            >
                                <option value="">All Visitor Types</option>
                                <option value="tourist">Tourist</option>
                                <option value="local">Local</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={filters.location_name}
                                onChange={e =>
                                    setFilters(f => ({...f, location_name: e.target.value}))
                                }
                            >
                                <option value="">All Locations</option>
                                <option value="Kraton">Kraton</option>
                                <option value="Pura Mangkunegaran">Pura Mangkunegaran</option>
                                <option value="Pasar Triwindu">Pasar Triwindu</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Desktop + Tablet Table */}
                <div className="card-body p-0 d-none d-md-block">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                            <tr>
                                {[
                                    "id",
                                    "visitor_type",
                                    "age_group",
                                    "gender",
                                    "location_name",
                                    "issued_at"
                                ].map(col => (
                                    <th
                                        key={col}
                                        onClick={() => toggleSort(col)}
                                        style={{cursor: "pointer"}}
                                    >
                                        {col.replace("_", " ").toUpperCase()}
                                        {sortColumn === col && (
                                            <span className="ms-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                                        )}
                                    </th>
                                ))}
                                <th>ACTIONS</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.length > 0 ? (
                                filtered.map(t => (
                                    <tr key={t.id}>
                                        <td>{t.id}</td>
                                        <td>{t.visitor_type}</td>
                                        <td>{t.age_group}</td>
                                        <td>{t.gender}</td>
                                        <td>{t.location_name}</td>
                                        <td>{new Date(t.issued_at).toLocaleString()}</td>
                                        <td className="text-nowrap">
                                            <div className="d-flex flex-wrap gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        navigate(`/tickets/edit/${t.id}`)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                {user?.role === "admin" && (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(t.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
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

                {/* Mobile Card View */}
                <div className="card-body d-md-none">
                    {filtered.length > 0 ? (
                        filtered.map(t => (
                            <div key={t.id} className="card mb-3 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title fw-bold">Ticket #{t.id}</h6>
                                    <p className="mb-1">
                                        <strong>Type:</strong> {t.visitor_type}
                                    </p>
                                    <p className="mb-1">
                                        <strong>Age:</strong> {t.age_group}
                                    </p>
                                    <p className="mb-1">
                                        <strong>Gender:</strong> {t.gender}
                                    </p>
                                    <p className="mb-1">
                                        <strong>Location:</strong> {t.location_name}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Issued:</strong>{" "}
                                        {new Date(t.issued_at).toLocaleString()}
                                    </p>
                                    <div className="d-flex flex-wrap gap-2 mt-3">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => navigate(`/tickets/edit/${t.id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(t.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-3">No tickets found.</div>
                    )}
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
}
