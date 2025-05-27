# Surakarta Heritage – Frontend

This is the **frontend React app** for the Surakarta Heritage digital ticketing system.

## 🎯 Overview

Visitors can:
- Browse Surakarta heritage sites
- Register/login as user or admin
- Issue and manage tickets
- Admins can view analytics & manage users

Built with **React**, **Bootstrap**, and uses **FastAPI** as backend.

---

## 🚀 Setup Instructions



### Install Dependencies

```bash
  npm install
```


## 🧪 Run in Development

```bash
  npm run dev
```

Then open `http://localhost:5173`.

---

## 📦 Build for Production

```bash
  npm run build
```

Optional preview:

```bash
  npm run preview
```

---

## 📱 Progressive Web App (PWA)

- Configured using `vite-plugin-pwa`
- Works as a mobile installable app
- Manifest + icons under `public/`

---

## 🔐 Auth & Roles

- Session stored in `sessionStorage`
- Users can register normally
- Admins must enter the admin code at registration
- Admins can view:
    - User management page (`/users`)
    - Stats dashboard (`/stats`)
    - Delete tickets

---

## 📁 Folder Structure Highlights

```
src/
├── components/          # UI Components & Pages
├── context/             # Auth context provider
├── api.js               # API utilities
├── App.jsx              # Main app with routes
├── main.jsx             # Entry point
└── styles/              # Global styles
```

---

## 👨‍💻 Key Libraries

- **React Router DOM** — Routing
- **Bootstrap 5** — Styling
- **Recharts** — Stats visualization
- **vite-plugin-pwa** — PWA support

---

