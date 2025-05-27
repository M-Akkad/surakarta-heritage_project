# 🏛️ Surakarta Heritage Web App

A web application for managing digital ticketing and visitor statistics for heritage locations in Surakarta, Indonesia.

---

## 📦 Tech Stack

- **Frontend:** React + Vite + Bootstrap 5
- **Backend:** FastAPI (Python)
- **Database:** SQLite (default, configurable)
- **Auth:** Token-based authentication with admin/user roles
- **PWA:** Progressive Web App support

---

## 🔧 Features

### ✅ General
- User registration and login (admin access via secure code)
- Token-based session authentication
- Role-based UI access (admin/user)
- PWA installable app support

### 🎫 Ticket Management
- Issue, list, edit, and delete tickets
- Filter, sort, and paginate ticket tables
- Mobile-friendly ticket card view

### 📊 Admin Dashboard
- View statistics: visitor types, age, gender, location, and issued dates
- Bar charts and pie charts using Recharts

### 👥 User Management (Admin)
- View all users
- Create, delete, and update user roles
- Reset passwords securely

---



## 📱 PWA Support

- The app supports Progressive Web App (PWA) installation on mobile, tablet and desktop.
- Manifest and service worker are handled via `vite-plugin-pwa`.

---

