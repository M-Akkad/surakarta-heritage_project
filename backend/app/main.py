from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, get_db
from app.auth import router as auth_router
from app.routes.tickets import router as tickets_router
from app.routes.stats import router as stats_router
from app.routes.users import router as users_router
import logging

logging.getLogger("passlib.handlers.bcrypt").setLevel(logging.ERROR)

app = FastAPI(
    title="Surakarta Heritage API",
    version="1.0"
)

origins = [
    "http://localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(tickets_router, prefix="/api/tickets", tags=["tickets"])
app.include_router(stats_router, prefix="/api/stats", tags=["stats"])


# Root endpoint returning a welcome message
@app.get("/")
def read_root():
    return {"message": "Welcome to Surakarta Heritage API"}
