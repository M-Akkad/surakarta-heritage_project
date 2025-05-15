# README.md

# Surakarta Heritage Ticketing Backend (FastAPI)

This is the backend API for the Surakarta Heritage Ticketing system. It allows staff to issue visitor tickets and admins
to view visitor statistics and filter records.

---

## 🚀 Features

- ✅ Ticket creation by staff
- ✅ Role-based login and access control
- ✅ Admin-only statistics dashboard
- ✅ Filtering tickets by visitor type, age group, location, and date range
- ✅ Secure API using token-based authentication (OAuth2)

---

## 🛠️ Tech Stack

- **FastAPI** for building the REST API
- **SQLAlchemy** for ORM
- **SQLite** (default, but can be swapped for PostgreSQL/MySQL)
- **Pydantic** for request/response models

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # Entry point
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic data validation
│   ├── crud.py              # Business logic and DB operations
│   ├── database.py          # DB config and connection
│   ├── auth.py              # Auth logic and login route
│   └── routes/
│       ├── tickets.py       # Ticket creation and filtering
│       └── stats.py         # Admin-only statistics endpoint
├── requirements.txt
└── README.md
```

---

## ▶️ Running the App

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

```bash
uvicorn app.main:app --reload
```
---

## 🔐 Authentication Flow

### 1. Login

`POST /api/login`

- Form data: `username`, `password`
- Response: `{ "access_token": "token-user", "token_type": "bearer" }`

### 2. Use Token

Send the token as a header:

```
Authorization: Bearer token-user
```

---

## 📮 API Endpoints

| Method | Endpoint              | Access | Description                     |
|--------|-----------------------|--------|---------------------------------|
| POST   | `/api/login`          | Public | Login to get access token       |
| POST   | `/api/tickets`        | Staff  | Issue a ticket                  |
| GET    | `/api/tickets/search` | Staff  | Filter/search issued tickets    |
| GET    | `/api/stats`          | Admin  | View visitor statistics summary |

---

## 🧪 Testing (Optional)

Test with tools like **Postman**, **Thunder Client**, or the built-in docs:

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

---
