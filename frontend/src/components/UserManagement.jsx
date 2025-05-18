import {listUsers, changeUserRole, API_BASE} from '../api';
import React, {useEffect, useState, useContext} from "react";
import {AuthContext} from "../context/AuthContext";


export default function UserManagement() {
    const {token} = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        listUsers(token)
            .then(data => setUsers(Array.isArray(data) ? data : []))
            .catch(err => setError(err.detail || err.message || "Failed to load users"));
    }, [token]);

    const handleRole = async (u, role) => {
        try {
            await changeUserRole(token, u.username, role);
            setUsers(users => users.map(x => x.username === u.username ? {...x, role} : x));
        } catch (err) {
            setError(err.detail || err.message || "Failed to change role");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm(`Delete user ID ${userId}?`)) return;

        try {
            const res = await fetch(`${API_BASE}/users/id/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Failed to delete user");
            }

            setUsers((users) => users.filter((u) => u.id !== userId));
        } catch (err) {
            alert(err.message);
        }
    };



    return (
        <div className="container-fluid px-3">
            <div className="card mx-auto my-4 shadow-sm" style={{maxWidth: 600}}>
                <div className="card-header"><h5>User Management</h5></div>
                <ul className="list-group list-group-flush">
                    {users.map(u => (
                        <li key={u.username}
                            className="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <span>{u.username}</span>
                            <div className="d-flex gap-2 align-items-center">
                                <select
                                    className="form-select form-select-sm"
                                    value={u.role}
                                    onChange={e => handleRole(u, e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(u.id)}>
                                    Delete
                                </button>
                            </div>
                        </li>

                    ))}
                </ul>
            </div>
        </div>
    );
}
