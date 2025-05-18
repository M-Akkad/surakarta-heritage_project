// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import
{
  login as loginRequest,
  register as registerRequest,
  fetchMe,
} from '../api.js'

export const AuthContext = createContext()

export function AuthProvider({ children })
{
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // whenever we get a token, fetch /auth/me
  useEffect(() =>
  {
    if (!token)
    {
      setUser(null)
      return
    }
    fetchMe(token)
      .then(setUser)
      .catch(() =>
      {
        // if token invalid, clear it
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      })
  }, [token])

  const login = async (username, password) =>
  {
    // 1) hit /login
    const { access_token } = await loginRequest(username, password);
    // 2) store token
    localStorage.setItem("token", access_token);
    setToken(access_token);
    // 3) immediately fetch the current user
    const me = await fetchMe(access_token);
    setUser(me);
    // 4) navigate into the app
    navigate("/tickets");
  };


  const register = async (username, password) =>
  {
    await registerRequest(username, password)
    // after sign-up, send them to login
    navigate('/login')
  }

  const logout = () =>
  {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
