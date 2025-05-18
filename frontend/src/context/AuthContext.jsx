import React, {createContext, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    login as loginRequest,
    fetchMe, API_BASE
} from '../api.js';

export const AuthContext = createContext();

export function AuthProvider({children}) {
    const [token, setToken] = useState(() => sessionStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Load user info on token change
    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }
        fetchMe(token)
            .then(setUser)
            .catch(() => {
                sessionStorage.removeItem('token');
                setToken(null);
                setUser(null);
            });
    }, [token]);


    const login = async (username, password) => {
        const {access_token} = await loginRequest(username, password);
        sessionStorage.setItem('token', access_token);
        setToken(access_token);
        const me = await fetchMe(access_token);
        setUser(me);
        navigate('/tickets');
    };

    const register = async (username, password, admin_code = "") => {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password, admin_code}),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Registration failed");
        return data;
    };


    const logout = () => {
        sessionStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{token, user, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
}
