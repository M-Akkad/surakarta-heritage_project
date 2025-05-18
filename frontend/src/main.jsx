// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// ✅ Correct CSS imports
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.css'

createRoot(document.getElementById('root')).render(<App />)
