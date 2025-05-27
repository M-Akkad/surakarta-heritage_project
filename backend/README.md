# Surakarta Heritage – Backend (FastAPI)

REST API built with **FastAPI**, supporting role-based access control, ticketing, admin statistics, and user management
for the Surakarta heritage system.

---

## ⚙️ Requirements

- Python 3.10+
- pip

---

## 📁 Project Structure

```
app/
│
├── main.py              # FastAPI app entry point
├── models.py            # SQLAlchemy models
├── database.py          # DB connection & session
├── crud.py              # DB interaction logic
├── auth.py              # Auth & token logic
├── schemas.py           # Pydantic schemas
└── routes/
    ├── tickets.py       # Ticket CRUD endpoints
    ├── stats.py         # Admin-only stats
    └── users.py         # Admin user management
```

---

## 🛠️ Setup Instructions

### 1. Clone & Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use venv\Scripts\activate
pip install -r requirements.txt
```

> Or install manually:

```bash
pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-dotenv
```

---

### 2. Environment Variables

Create a `.env` file in `backend/`:

```env
DATABASE_URL=sqlite:///./app.db
ADMIN_SECRET_CODE=myadmincode123
```

---

### 3. Run the App

```bash
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

---

## 🔐 Authentication & Roles

- Token-based auth using `Bearer <token>`
- Two roles:
    - **admin** – Can manage users, tickets, and stats
    - **user** – Can only manage their own tickets

To register as admin, users must supply the correct `ADMIN_SECRET_CODE`.

---

## 🔑 Endpoints Overview

### 🔸 `/api/auth`

- `POST /register` — Register as user/admin
- `POST /login` — Token auth via form data
- `GET /me` — Get current logged-in user

### 🔸 `/api/tickets`

- `GET /` — List tickets (admin sees all)
- `POST /` — Create ticket (user only)
- `GET /{id}` — View a ticket
- `PUT /{id}` — Edit own ticket or admin
- `DELETE /{id}` — Delete own ticket or admin

### 🔸 `/api/users` (Admin only)

- `GET /` — List all users
- `PATCH /{username}/role?role=user|admin` — Change user role
- `DELETE /id/{user_id}` — Delete user
- `POST /{username}/reset-password` — Reset user password

### 🔸 `/api/stats` (Admin only)

- `GET /` — Ticket totals, breakdowns by type, age, location, and issue date

---

## 🗃️ Database

- SQLite (`app.db`) created automatically on startup.
- Admin users can be promoted manually or registered with a secret code.

---

## 🧪 Testing the API

Use tools like **Postman** or the built-in **Swagger UI**:

- http://localhost:8000/docs

---