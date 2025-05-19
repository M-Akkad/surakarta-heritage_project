import
{
    listUsers,
    changeUserRole,
    createUser,
    resetUserPassword,
    API_BASE,
} from "../api";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserManagement()
{
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [newUser, setNewUser] = useState({
        username: "",
        password: "",
        role: "user",
    });
    const [resetPassword, setResetPassword] = useState({});

    useEffect(() =>
    {
        // if (!token) return;
        if (!token)
        {
            navigate("/", { replace: true });
            return;
        }


        const checkUserRole = async () =>
        {
            try
            {
                const res = await fetch(`${API_BASE}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Unauthorized");

                const user = await res.json();
                setCurrentUser(user);

                if (user.role === "admin")
                {
                    const data = await listUsers(token);
                    setUsers(Array.isArray(data) ? data : []);
                } else
                {
                    navigate("/", { replace: true });
                }
            } catch (err)
            {
                console.error("Not admin, redirecting:", err);
                navigate("/", { replace: true });
            }
        };

        checkUserRole();
    }, [token, navigate]);

    if (!currentUser) return null;
    if (currentUser.role !== "admin") return null;


    const handleCreateUser = async () =>
    {
        try
        {
            const created = await createUser(token, newUser);
            setUsers([...users, created]);
            setNewUser({ username: "", password: "", role: "user" });
        } catch (err)
        {
            setError(err.detail || err.message);
        }
    };

    const handleResetPassword = async (username) =>
    {
        const newPass = resetPassword[username];
        if (!newPass) return alert("Enter a password");
        try
        {
            await resetUserPassword(token, username, newPass);
            alert("Password reset successful");
            setResetPassword((prev) => ({ ...prev, [username]: "" }));
        } catch (err)
        {
            alert(err.detail || err.message);
        }
    };

    const handleRole = async (u, role) =>
    {
        try
        {
            await changeUserRole(token, u.username, role);
            setUsers((users) =>
                users.map((x) =>
                    x.username === u.username ? { ...x, role } : x
                )
            );
        } catch (err)
        {
            setError(err.detail || err.message || "Failed to change role");
        }
    };

    const handleDelete = async (userId) =>
    {
        if (!window.confirm(`Delete user ID ${userId}?`)) return;
        try
        {
            const res = await fetch(`${API_BASE}/users/id/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Failed to delete user");
            setUsers((users) => users.filter((u) => u.id !== userId));
        } catch (err)
        {
            alert(err.message);
        }
    };

    return (
        <div className="container-fluid px-3">
            {/* Create user form */}
            <div className="card p-4 mb-4 shadow-sm" style={{ maxWidth: 700, margin: "0 auto" }}>
                <h5 className="mb-3">Create New User</h5>
                <div className="row g-3 align-items-center">
                    <div className="col-md-4">
                        <input
                            className="form-control"
                            placeholder="Username"
                            value={newUser.username}
                            onChange={(e) =>
                                setNewUser({ ...newUser, username: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            className="form-control"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) =>
                                setNewUser({ ...newUser, password: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={newUser.role}
                            onChange={(e) =>
                                setNewUser({ ...newUser, role: e.target.value })
                            }
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-success w-100" onClick={handleCreateUser}>
                            Create
                        </button>
                    </div>
                </div>
            </div>

            {/* Error alert */}
            {error && (
                <div className="alert alert-danger text-center" style={{ maxWidth: 700, margin: "0 auto" }}>
                    {error}
                </div>
            )}

            {/* User list */}
            <div className="card mx-auto my-4 shadow-sm" style={{ maxWidth: 700 }}>
                <div className="card-header">
                    <h5 className="mb-0">User Management</h5>
                </div>
                <ul className="list-group list-group-flush">
                    {users.map((u) => (
                        <li
                            key={u.username}
                            className="list-group-item"
                            style={{ paddingBottom: "1rem" }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-semibold">{u.username}</span>
                                <div className="d-flex gap-2 align-items-center">
                                    <select
                                        className="form-select form-select-sm"
                                        value={u.role}
                                        onChange={(e) => handleRole(u, e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(u.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <input
                                    className="form-control form-control-sm"
                                    placeholder="New password"
                                    value={resetPassword[u.username] || ""}
                                    onChange={(e) =>
                                        setResetPassword((prev) => ({
                                            ...prev,
                                            [u.username]: e.target.value,
                                        }))
                                    }
                                />
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => handleResetPassword(u.username)}
                                >
                                    Reset
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
