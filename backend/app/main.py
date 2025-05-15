from fastapi import FastAPI
from app.routes import tickets, stats
from app.database import Base, engine
from app import auth

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api")
app.include_router(tickets.router, prefix="/api")
app.include_router(stats.router, prefix="/api")